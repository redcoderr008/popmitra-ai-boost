import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCountAnimation } from "@/hooks/useCountAnimation";
export const UserMetrics = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalGenerations, setTotalGenerations] = useState(0);
  const [loading, setLoading] = useState(true);

  const animatedUsers = useCountAnimation(totalUsers);
  const animatedGenerations = useCountAnimation(totalGenerations);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data: usersData } = await supabase.rpc('get_total_users');
        const { data: generationsData } = await supabase.rpc('get_total_generations');

        setTotalUsers(usersData || 0);
        setTotalGenerations(generationsData || 0);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  if (loading) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="relative overflow-hidden border-primary/20 hover-scale">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <CardContent className="relative p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {formatNumber(animatedUsers)}
              </CardTitle>
              <p className="text-muted-foreground text-lg font-medium">
                Content Creators
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-primary/20 hover-scale">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <CardContent className="relative p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {formatNumber(animatedGenerations)}
              </CardTitle>
              <p className="text-muted-foreground text-lg font-medium">
                Titles Generated
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};