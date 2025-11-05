import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, Info, CheckCircle, XCircle, Bell } from "lucide-react";

interface Notice {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
}

export const NoticeModal = () => {
  const { user } = useAuth();
  const [currentNotice, setCurrentNotice] = useState<Notice | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [noticeQueue, setNoticeQueue] = useState<Notice[]>([]);

  useEffect(() => {
    if (user) {
      fetchUndismissedNotices();
    }
  }, [user]);

  useEffect(() => {
    if (noticeQueue.length > 0 && !isOpen) {
      setCurrentNotice(noticeQueue[0]);
      setIsOpen(true);
    }
  }, [noticeQueue, isOpen]);

  const fetchUndismissedNotices = async () => {
    if (!user) return;

    // Get active notices
    const { data: notices, error: noticesError } = await supabase
      .from("notices")
      .select("id, title, message, type, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (noticesError || !notices) return;

    // Get user's dismissed notices
    const { data: dismissals } = await supabase
      .from("user_notice_dismissals")
      .select("notice_id")
      .eq("user_id", user.id);

    const dismissedIds = new Set(dismissals?.map(d => d.notice_id) || []);

    // Filter out dismissed notices
    const undismissed = notices.filter(n => !dismissedIds.has(n.id));
    setNoticeQueue(undismissed);
  };

  const handleDismiss = async (dismissType: 'permanent' | 'temporary') => {
    if (!user || !currentNotice) return;

    if (dismissType === 'permanent' || dontShowAgain) {
      await supabase.from("user_notice_dismissals").insert({
        user_id: user.id,
        notice_id: currentNotice.id,
        dismiss_type: 'permanent',
      });
    }

    // Move to next notice
    const remaining = noticeQueue.slice(1);
    setNoticeQueue(remaining);
    setIsOpen(false);
    setDontShowAgain(false);
    
    setTimeout(() => {
      if (remaining.length > 0) {
        setCurrentNotice(remaining[0]);
        setIsOpen(true);
      } else {
        setCurrentNotice(null);
      }
    }, 300);
  };

  const handleViewLater = async () => {
    // Just close for now, will show again on next page load
    setIsOpen(false);
    const remaining = noticeQueue.slice(1);
    setNoticeQueue(remaining);
    setDontShowAgain(false);
    
    setTimeout(() => {
      if (remaining.length > 0) {
        setCurrentNotice(remaining[0]);
        setIsOpen(true);
      } else {
        setCurrentNotice(null);
      }
    }, 300);
  };

  const getNoticeIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="w-6 h-6 text-blue-500" />;
      case "warning":
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "error":
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Bell className="w-6 h-6 text-primary" />;
    }
  };

  if (!currentNotice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getNoticeIcon(currentNotice.type)}
            {currentNotice.title}
          </DialogTitle>
          <DialogDescription className="pt-4 text-base">
            {currentNotice.message}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="dontShow"
            checked={dontShowAgain}
            onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
          />
          <Label
            htmlFor="dontShow"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Don't show this notice again
          </Label>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleViewLater}
            className="w-full sm:w-auto"
          >
            View Later
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleDismiss('temporary')}
            className="w-full sm:w-auto"
          >
            Dismiss
          </Button>
          <Button
            onClick={() => handleDismiss('permanent')}
            className="w-full sm:w-auto"
          >
            Got it!
          </Button>
        </DialogFooter>

        {noticeQueue.length > 1 && (
          <p className="text-xs text-muted-foreground text-center">
            {noticeQueue.length - 1} more notice{noticeQueue.length - 1 > 1 ? 's' : ''} remaining
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
