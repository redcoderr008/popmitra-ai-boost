import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, TrendingUp, Users, PlayCircle } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "YouTube Creator",
    avatar: "/placeholder.svg",
    content: "PopMitra transformed my content strategy completely. My videos now get 3x more views on average, and the AI suggestions are incredibly accurate.",
    rating: 5,
    stats: "250K+ subscribers",
    platform: "YouTube"
  },
  {
    id: 2,
    name: "Alex Rodriguez",
    role: "TikTok Influencer", 
    avatar: "/placeholder.svg",
    content: "The hashtag suggestions alone boosted my reach by 180%. I've gone from 50K to 500K followers in just 6 months using PopMitra's recommendations.",
    rating: 5,
    stats: "500K+ followers",
    platform: "TikTok"
  },
  {
    id: 3,
    name: "Emma Chen",
    role: "Instagram Content Creator",
    avatar: "/placeholder.svg",
    content: "I was struggling with content ideas until I found PopMitra. Now I consistently create viral content that resonates with my audience.",
    rating: 5,
    stats: "125K+ followers",
    platform: "Instagram"
  },
  {
    id: 4,
    name: "Marcus Johnson",
    role: "Digital Marketing Agency",
    avatar: "/placeholder.svg",
    content: "We use PopMitra for all our clients' content optimization. It's increased our campaign success rate by 85% and saved us countless hours.",
    rating: 5,
    stats: "50+ clients",
    platform: "Agency"
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "Podcast Host",
    avatar: "/placeholder.svg",
    content: "The title suggestions are pure gold. My podcast downloads increased by 120% after implementing PopMitra's recommendations.",
    rating: 5,
    stats: "75K+ downloads/month",
    platform: "Podcast"
  },
  {
    id: 6,
    name: "David Thompson",
    role: "Brand Manager",
    avatar: "/placeholder.svg",
    content: "PopMitra helps us create content that actually converts. Our engagement rates have never been higher, and our ROI has improved dramatically.",
    rating: 5,
    stats: "Fortune 500 Company",
    platform: "Brand"
  }
];

const platformColors = {
  YouTube: "bg-red-500/10 text-red-700 dark:text-red-300",
  TikTok: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
  Instagram: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  Agency: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Podcast: "bg-green-500/10 text-green-700 dark:text-green-300",
  Brand: "bg-orange-500/10 text-orange-700 dark:text-orange-300"
};

export const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Quote className="w-6 h-6 text-primary" />
            <Badge variant="secondary" className="text-sm">
              Trusted by 15,000+ Creators
            </Badge>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Loved by Creators Worldwide
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            See how content creators are transforming their reach and engagement with PopMitra's AI-powered optimization
          </p>
        </div>

        {/* Success Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm border">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
            </div>
            <div className="text-3xl font-bold text-primary mb-1">247%</div>
            <div className="text-sm text-muted-foreground">Average View Increase</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm border">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-8 h-8 text-blue-500 mb-2" />
            </div>
            <div className="text-3xl font-bold text-primary mb-1">15K+</div>
            <div className="text-sm text-muted-foreground">Active Creators</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm border">
            <div className="flex items-center justify-center mb-2">
              <PlayCircle className="w-8 h-8 text-purple-500 mb-2" />
            </div>
            <div className="text-3xl font-bold text-primary mb-1">5.2M+</div>
            <div className="text-sm text-muted-foreground">Contents Optimized</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm border">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-8 h-8 text-yellow-500 mb-2" />
            </div>
            <div className="text-3xl font-bold text-primary mb-1">4.9</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-background/60 backdrop-blur-sm border border-border/50">
              <CardContent className="p-8">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="font-semibold text-foreground mb-1">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground mb-2">{testimonial.role}</div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${platformColors[testimonial.platform as keyof typeof platformColors]}`}
                      >
                        {testimonial.platform}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {testimonial.stats}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-3xl p-8 border border-primary/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Join Thousands of Successful Creators
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Start optimizing your content today and see the difference AI-powered suggestions can make for your growth.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Free to start
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                No credit card required
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};