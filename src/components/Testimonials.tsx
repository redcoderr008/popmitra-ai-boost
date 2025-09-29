import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, TrendingUp, Users, PlayCircle } from "lucide-react";
const testimonials = [{
  id: 1,
  name: "Sarah Mitchell",
  role: "YouTube Creator",
  avatar: "/placeholder.svg",
  content: "PopMitra transformed my content strategy completely. My videos now get 3x more views on average, and the AI suggestions are incredibly accurate.",
  rating: 5,
  stats: "250K+ subscribers",
  platform: "YouTube"
}, {
  id: 2,
  name: "Alex Rodriguez",
  role: "TikTok Influencer",
  avatar: "/placeholder.svg",
  content: "The hashtag suggestions alone boosted my reach by 180%. I've gone from 50K to 500K followers in just 6 months using PopMitra's recommendations.",
  rating: 5,
  stats: "500K+ followers",
  platform: "TikTok"
}, {
  id: 3,
  name: "Emma Chen",
  role: "Instagram Content Creator",
  avatar: "/placeholder.svg",
  content: "I was struggling with content ideas until I found PopMitra. Now I consistently create viral content that resonates with my audience.",
  rating: 5,
  stats: "125K+ followers",
  platform: "Instagram"
}, {
  id: 4,
  name: "Marcus Johnson",
  role: "Digital Marketing Agency",
  avatar: "/placeholder.svg",
  content: "We use PopMitra for all our clients' content optimization. It's increased our campaign success rate by 85% and saved us countless hours.",
  rating: 5,
  stats: "50+ clients",
  platform: "Agency"
}, {
  id: 5,
  name: "Lisa Park",
  role: "Podcast Host",
  avatar: "/placeholder.svg",
  content: "The title suggestions are pure gold. My podcast downloads increased by 120% after implementing PopMitra's recommendations.",
  rating: 5,
  stats: "75K+ downloads/month",
  platform: "Podcast"
}, {
  id: 6,
  name: "David Thompson",
  role: "Brand Manager",
  avatar: "/placeholder.svg",
  content: "PopMitra helps us create content that actually converts. Our engagement rates have never been higher, and our ROI has improved dramatically.",
  rating: 5,
  stats: "Fortune 500 Company",
  platform: "Brand"
}];
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
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Testimonials
          </Badge>
          <h2 className="text-4xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Loved by 15,000+ Creators Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how PopMitra is transforming content creation and helping creators achieve viral success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="group hover:shadow-medium transition-all duration-300 animate-slide-up border-0 shadow-soft"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${platformColors[testimonial.platform as keyof typeof platformColors] || 'bg-muted'}`}
                      >
                        {testimonial.platform}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                  <p className="text-foreground leading-relaxed pl-6">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>{testimonial.stats}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16 animate-fade-in">
          <div className="inline-flex items-center gap-8 p-6 bg-card border rounded-xl shadow-soft">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">15,247 Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">5.2M+ Contents Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">247% Avg View Boost</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};