import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Clock, Target, Zap, Globe, Calendar, BarChart3, Heart, Repeat } from "lucide-react";
const metrics = [{
  category: "User Growth",
  icon: Users,
  stats: [{
    label: "Total Active Users",
    value: "15,247",
    change: "+23.5%",
    period: "this month"
  }, {
    label: "New Signups",
    value: "1,892",
    change: "+18.2%",
    period: "this week"
  }, {
    label: "Creator Retention",
    value: "94.2%",
    change: "+5.1%",
    period: "90-day"
  }]
}, {
  category: "Content Performance",
  icon: TrendingUp,
  stats: [{
    label: "Contents Generated",
    value: "5.2M+",
    change: "+45.7%",
    period: "total"
  }, {
    label: "Avg. View Boost",
    value: "247%",
    change: "+12.3%",
    period: "per video"
  }, {
    label: "Viral Rate",
    value: "28.5%",
    change: "+8.9%",
    period: "success rate"
  }]
}, {
  category: "Platform Impact",
  icon: Globe,
  stats: [{
    label: "YouTube Creators",
    value: "8,450",
    change: "+31.2%",
    period: "active"
  }, {
    label: "TikTok Creators",
    value: "4,230",
    change: "+67.8%",
    period: "active"
  }, {
    label: "Instagram Creators",
    value: "2,567",
    change: "+29.4%",
    period: "active"
  }]
}];
const realtimeStats = [{
  title: "Live Generation Activity",
  icon: Zap,
  metrics: [{
    label: "Titles Generated Today",
    value: "12,847",
    isLive: true
  }, {
    label: "Active Sessions",
    value: "1,247",
    isLive: true
  }, {
    label: "Peak Concurrent Users",
    value: "2,156",
    isLive: false
  }]
}, {
  title: "Success Metrics",
  icon: Target,
  metrics: [{
    label: "Customer Satisfaction",
    value: "4.9/5",
    progress: 98
  }, {
    label: "Feature Adoption Rate",
    value: "87.3%",
    progress: 87
  }, {
    label: "API Uptime",
    value: "99.98%",
    progress: 99.98
  }]
}];
const timeBasedMetrics = [{
  period: "Last 7 Days",
  growth: "+23%",
  users: "1,892",
  content: "89.2K"
}, {
  period: "Last 30 Days",
  growth: "+67%",
  users: "7,431",
  content: "312K"
}, {
  period: "Last 90 Days",
  growth: "+145%",
  users: "18,923",
  content: "1.2M"
}, {
  period: "This Year",
  growth: "+289%",
  users: "45,721",
  content: "4.8M"
}];
export const UserMetrics = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            <BarChart3 className="w-4 h-4 mr-2" />
            Live Metrics
          </Badge>
          <h2 className="text-4xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            PopMitra by the Numbers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time insights into our growing community and platform performance
          </p>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {metrics.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.category} 
                className="animate-slide-up shadow-soft border-0"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-primary rounded-lg">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {category.stats.map((stat) => (
                    <div key={stat.label} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                          <div className="text-xs text-success font-medium">{stat.change}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{stat.period}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {realtimeStats.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card 
                key={section.title} 
                className="animate-slide-up shadow-soft border-0"
                style={{ animationDelay: `${(index + 3) * 0.2}s` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-secondary rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.metrics.map((metric) => (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          {metric.label}
                          {metric.isLive && (
                            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                          )}
                        </span>
                        <span className="text-xl font-bold text-foreground">{metric.value}</span>
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

        {/* Time-based Growth Metrics */}
        <Card className="animate-fade-in shadow-medium border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Growth Timeline</CardTitle>
                <p className="text-sm text-muted-foreground">User acquisition and content generation over time</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {timeBasedMetrics.map((period) => (
                <div key={period.period} className="text-center space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">{period.period}</div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-success">{period.growth}</div>
                    <div className="text-xs text-muted-foreground">Growth</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <div>
                      <div className="text-lg font-semibold">{period.users}</div>
                      <div className="text-xs text-muted-foreground">Users</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{period.content}</div>
                      <div className="text-xs text-muted-foreground">Content</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Stats Bar */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="inline-flex flex-wrap justify-center gap-8 p-6 bg-muted/30 rounded-xl">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm"><strong>4.9/5</strong> User Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Repeat className="w-5 h-5 text-primary" />
              <span className="text-sm"><strong>94.2%</strong> Retention Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm"><strong>99.98%</strong> Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="text-sm"><strong>247%</strong> Avg Performance Boost</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};