import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyOTPRequest {
  email?: string;
  phone?: string;
  otp: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, phone, otp }: VerifyOTPRequest = await req.json();

    console.log('Verify OTP request for:', email || phone);

    // Validate input
    if (!otp || (!email && !phone)) {
      throw new Error('Missing required fields');
    }

    // Create Supabase admin client
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

    // Clean up expired OTPs first
    await supabaseAdmin.rpc('cleanup_expired_otps');

    // Find pending user with matching OTP
    const { data: pendingUser, error: fetchError } = await supabaseAdmin
      .from('pending_users')
      .select('*')
      .or(email ? `email.eq.${email}` : `phone.eq.${phone}`)
      .eq('otp', otp)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching pending user:', fetchError);
      throw new Error('Error verifying OTP');
    }

    if (!pendingUser) {
      throw new Error('Invalid or expired verification code');
    }

    console.log('Found pending user:', pendingUser.id);

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: pendingUser.email || `${pendingUser.phone?.replace(/[^0-9]/g, '')}@temp.popmitra.com`,
      password: pendingUser.password_hash, // Note: This will be hashed again by Supabase
      phone: pendingUser.phone || undefined,
      email_confirm: true,
      phone_confirm: pendingUser.phone ? true : false,
      user_metadata: {
        display_name: pendingUser.full_name,
        email_verified: true
      }
    });

    if (authError) {
      console.error('Error creating user:', authError);
      
      // Check if user already exists
      if (authError.message.includes('already registered')) {
        throw new Error('This account already exists. Please sign in instead.');
      }
      
      throw new Error('Failed to create account');
    }

    console.log('User created successfully:', authData.user?.id);

    // Delete the pending user record
    await supabaseAdmin
      .from('pending_users')
      .delete()
      .eq('id', pendingUser.id);

    // Generate session for the user
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: pendingUser.email || `${pendingUser.phone?.replace(/[^0-9]/g, '')}@temp.popmitra.com`,
    });

    if (sessionError) {
      console.error('Error generating session:', sessionError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Account verified successfully',
        userId: authData.user?.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in verify-otp function:', error);
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
