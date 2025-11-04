import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, Info, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notice {
  id: string;
  title: string;
  message: string;
  type: string;
  expires_at: string | null;
}

export const NoticeBar = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const { data } = await supabase
      .from("notices")
      .select("*")
      .eq("is_active", true)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order("created_at", { ascending: false });

    if (data) {
      setNotices(data);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800";
      case "success":
        return "bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-200 border-green-200 dark:border-green-800";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200 border-red-200 dark:border-red-800";
      default:
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800";
    }
  };

  const activeNotices = notices.filter((notice) => !dismissed.includes(notice.id));

  if (activeNotices.length === 0) return null;

  return (
    <div className="space-y-2">
      {activeNotices.map((notice) => (
        <div
          key={notice.id}
          className={`border-b px-4 py-3 flex items-start gap-3 ${getStyles(notice.type)}`}
        >
          {getIcon(notice.type)}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{notice.title}</p>
            <p className="text-sm mt-1">{notice.message}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => setDismissed([...dismissed, notice.id])}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
