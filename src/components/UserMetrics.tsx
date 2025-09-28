import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Zap, 
  Globe,
  Calendar,
  BarChart3,
  Heart,
  Repeat
} from "lucide-react";

const metrics = [
  {
    category: "User Growth",
    icon: Users,
    stats: [
      { label: "Total Active Users", value: "15,247", change: "+23.5%", period: "this month" },
      { label: "New Signups", value: "1,892", change: "+18.2%", period: "this week" },
      { label: "Creator Retention", value: "94.2%", change: "+5.1%", period: "90-day" }
    ]
  },
  {
    category: "Content Performance",
    icon: TrendingUp,
    stats: [
      { label: "Contents Generated", value: "5.2M+", change: "+45.7%", period: "total" },
      { label: "Avg. View Boost", value: "247%", change: "+12.3%", period: "per video" },
      { label: "Viral Rate", value: "28.5%", change: "+8.9%", period: "success rate" }
    ]
  },
  {
    category: "Platform Impact",
    icon: Globe,
    stats: [
      { label: "YouTube Creators", value: "8,450", change: "+31.2%", period: "active" },
      { label: "TikTok Creators", value: "4,230", change: "+67.8%", period: "active" },
      { label: "Instagram Creators", value: "2,567", change: "+29.4%", period: "active" }
    ]
  }
];

const realtimeStats = [
  { 
    title: "Live Generation Activity", 
    icon: Zap,
    metrics: [
      { label: "Titles Generated Today", value: "12,847", isLive: true },
      { label: "Active Sessions", value: "1,247", isLive: true },
      { label: "Peak Concurrent Users", value: "2,156", isLive: false }
    ]
  },
  {
    title: "Success Metrics",
    icon: Target,
    metrics: [
      { label: "Customer Satisfaction", value: "4.9/5", progress: 98 },
      { label: "Feature Adoption Rate", value: "87.3%", progress: 87 },
      { label: "API Uptime", value: "99.98%", progress: 99.98 }
    ]
  }
];

const timeBasedMetrics = [
  { period: "Last 7 Days", growth: "+23%", users: "1,892", content: "89.2K" },
  { period: "Last 30 Days", growth: "+67%", users: "7,431", content: "312K" },
  { period: "Last 90 Days", growth: "+145%", users: "18,923", content: "1.2M" },
  { period: "This Year", growth: "+289%", users: "45,721", content: "4.8M" }
];

export const UserMetrics = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="w-6 h-6 text-primary" />
            <Badge variant="secondary" className="text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Live Metrics
            </Badge>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Real Impact, Real Numbers
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            See how PopMitra is transforming the content creation landscape with measurable results and growing community success
          </p>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {metrics.map((category, idx) => {
            const IconComponent = category.icon;
            return (
              <Card key={idx} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-background/60 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {category.stats.map((stat, statIdx) => (
                    <div key={statIdx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {stat.change}
                        </Badge>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                        <span className="text-xs text-muted-foreground mb-1">{stat.period}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {realtimeStats.map((section, idx) => {
            const IconComponent = section.icon;
            return (
              <Card key={idx} className="bg-gradient-to-br from-background/80 to-muted/20 backdrop-blur-sm border border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.metrics.map((metric, metricIdx) => (
                    <div key={metricIdx} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.label}</span>
                        {metric.isLive && (
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-green-600 dark:text-green-400">Live</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">{metric.value}</span>
                      </div>
                      {metric.progress !== undefined && (
                        <Progress value={metric.progress} className="h-2" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Time-based Growth */}
        <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-xl">
              <Calendar className="w-6 h-6 text-primary" />
              Growth Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {timeBasedMetrics.map((period, idx) => (
                <div key={idx} className="text-center p-6 rounded-xl bg-background/50 backdrop-blur-sm">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-4">{period.period}</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                        {period.growth}
                      </div>
                      <div className="text-xs text-muted-foreground">Growth Rate</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-primary">{period.users}</div>
                        <div className="text-xs text-muted-foreground">New Users</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-primary">{period.content}</div>
                        <div className="text-xs text-muted-foreground">Generated</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Stats Banner */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 rounded-3xl p-8 text-center border border-primary/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center gap-2">
              <Heart className="w-8 h-8 text-red-500 mb-2" />
              <div className="text-2xl font-bold">99.2%</div>
              <div className="text-sm text-muted-foreground">User Satisfaction</div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <Repeat className="w-8 h-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold">94.7%</div>
              <div className="text-sm text-muted-foreground">Return Rate</div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <Clock className="w-8 h-8 text-purple-500 mb-2" />
              <div className="text-2xl font-bold">1.2s</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <Globe className="w-8 h-8 text-green-500 mb-2" />
              <div className="text-2xl font-bold">127</div>
              <div className="text-sm text-muted-foreground">Countries Served</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};