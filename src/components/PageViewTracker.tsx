import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView();
  }, [location.pathname]);

  const trackPageView = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Generate or get session ID
      let sessionId = sessionStorage.getItem("session_id");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem("session_id", sessionId);
      }

      await supabase.from("page_views").insert({
        page_path: location.pathname,
        user_id: user?.id || null,
        session_id: sessionId,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      // Silently fail - analytics shouldn't break the app
      console.debug("Page view tracking error:", error);
    }
  };

  return null;
};
