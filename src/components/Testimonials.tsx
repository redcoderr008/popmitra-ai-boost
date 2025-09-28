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
  return;
};