import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SignUpRequest {
  fullName: string;
  email?: string;
  phone?: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fullName, email, phone, password }: SignUpRequest = await req.json();

    console.log('Signup request received for:', email || phone);

    // Validate input
    if (!fullName || !password || (!email && !phone)) {
      throw new Error('Missing required fields');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Create Supabase client with service role for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Check rate limits (3 attempts per hour per email/phone)
    const identifier = email || phone || '';
    const identifierType = email ? 'email' : 'phone';
    
    const { data: rateLimitResult, error: rateLimitError } = await supabaseAdmin
      .rpc('check_signup_rate_limit', {
        _identifier: identifier,
        _identifier_type: identifierType,
        _max_attempts: 3,
        _window_minutes: 60
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
      throw new Error('Service temporarily unavailable. Please try again later.');
    }

    if (!rateLimitResult.allowed) {
      const resetDate = new Date(rateLimitResult.reset_at);
      const minutesUntilReset = Math.ceil((resetDate.getTime() - Date.now()) / 60000);
      throw new Error(`Too many signup attempts. Please try again in ${minutesUntilReset} minutes.`);
    }

    // Check if user already exists in pending_users
    const { data: existingPending } = await supabaseAdmin
      .from('pending_users')
      .select('*')
      .or(email ? `email.eq.${email}` : `phone.eq.${phone}`)
      .maybeSingle();

    if (existingPending) {
      // Delete old pending registration
      await supabaseAdmin
        .from('pending_users')
        .delete()
        .eq('id', existingPending.id);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('OTP generated successfully for:', email || phone);

    // Calculate expiry time (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Store pending user with OTP (password will be hashed by Supabase Auth)
    const { error: insertError } = await supabaseAdmin
      .from('pending_users')
      .insert({
        email: email || null,
        phone: phone || null,
        full_name: fullName,
        password_hash: password, // Stored temporarily, will be hashed by Supabase Auth
        otp: otp,
        expires_at: expiresAt
      });

    if (insertError) {
      console.error('Error inserting pending user:', insertError);
      throw new Error('Failed to create pending registration');
    }

    // Send OTP via email using Resend API
    if (email) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: "PopMitra <onboarding@resend.dev>",
          to: [email],
          subject: "Verify Your PopMitra Account",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Welcome to PopMitra!</h1>
              <p style="font-size: 16px; color: #666;">Hi ${fullName},</p>
              <p style="font-size: 16px; color: #666;">Thank you for signing up! Use the verification code below to complete your registration:</p>
              <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
                <h2 style="color: #333; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h2>
              </div>
              <p style="font-size: 14px; color: #999;">This code will expire in 5 minutes.</p>
              <p style="font-size: 14px; color: #999;">If you didn't request this code, please ignore this email.</p>
            </div>
          `,
        })
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error('Error sending email:', errorData);
        throw new Error('Failed to send verification email');
      }

      const emailData = await emailResponse.json();
      console.log('Email sent successfully:', emailData);
    } else if (phone) {
      // Send OTP via SMS (using existing send-otp function)
      const { error: smsError } = await supabaseAdmin.functions.invoke('send-otp', {
        body: { phoneNumber: phone, otp: otp }
      });

      if (smsError) {
        console.error('Error sending SMS:', smsError);
        throw new Error('Failed to send verification code via SMS');
      }

      console.log('SMS sent successfully to:', phone);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Verification code sent to ${email ? 'email' : 'phone'}`,
        expiresIn: 300 // seconds
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in signup function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
