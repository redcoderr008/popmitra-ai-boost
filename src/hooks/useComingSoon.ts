import { useToast } from "@/hooks/use-toast";

export const useComingSoon = () => {
  const { toast } = useToast();

  const showComingSoon = () => {
    toast({
      title: "Coming Soon!",
      description: "This feature is under development and will be available soon.",
      duration: 2000,
    });
  };

  return { showComingSoon };
};