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
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of satisfied content creators
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <Badge className={platformColors[testimonial.platform as keyof typeof platformColors]}>
                    {testimonial.platform}
                  </Badge>
                </div>
                
                <div className="flex mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                
                <Quote className="w-8 h-8 text-muted-foreground/20 mb-2" />
                <p className="text-foreground mb-4">{testimonial.content}</p>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>{testimonial.stats}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};