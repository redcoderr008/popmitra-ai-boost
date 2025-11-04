import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Users, TrendingUp, Bell, Eye, Trash2, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Stats {
  totalUsers: number;
  totalViews: number;
  todayViews: number;
  activeNotices: number;
}

interface Notice {
  id: string;
  title: string;
  message: string;
  type: string;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

export default function Admin() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdmin();
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalViews: 0, todayViews: 0, activeNotices: 0 });
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    message: "",
    type: "info",
    is_active: true,
    expires_at: "",
  });

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      fetchNotices();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Get total page views
      const { count: viewCount } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true });

      // Get today's views
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayCount } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString());

      // Get active notices
      const { count: noticeCount } = await supabase
        .from("notices")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      setStats({
        totalUsers: userCount || 0,
        totalViews: viewCount || 0,
        todayViews: todayCount || 0,
        activeNotices: noticeCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchNotices = async () => {
    const { data } = await supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setNotices(data);
    }
  };

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("notices").insert({
      ...noticeForm,
      created_by: user.id,
      expires_at: noticeForm.expires_at || null,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create notice",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Notice created successfully",
      });
      setShowAddNotice(false);
      setNoticeForm({ title: "", message: "", type: "info", is_active: true, expires_at: "" });
      fetchNotices();
      fetchStats();
    }
  };

  const handleDeleteNotice = async (id: string) => {
    const { error } = await supabase.from("notices").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete notice",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Notice deleted successfully",
      });
      fetchNotices();
      fetchStats();
    }
  };

  const handleToggleNotice = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("notices")
      .update({ is_active: !isActive })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update notice",
        variant: "destructive",
      });
    } else {
      fetchNotices();
      fetchStats();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                <Eye className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Today's Views</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayViews}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Notices</CardTitle>
                <Bell className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeNotices}</div>
              </CardContent>
            </Card>
          </div>

          {/* Notices Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Notices Management</CardTitle>
                  <CardDescription>Create and manage site-wide notices</CardDescription>
                </div>
                <Button onClick={() => setShowAddNotice(!showAddNotice)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Notice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddNotice && (
                <form onSubmit={handleAddNotice} className="space-y-4 mb-6 p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={noticeForm.title}
                      onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={noticeForm.message}
                      onChange={(e) => setNoticeForm({ ...noticeForm, message: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={noticeForm.type}
                        onValueChange={(value) => setNoticeForm({ ...noticeForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="expires_at">Expires At (Optional)</Label>
                      <Input
                        id="expires_at"
                        type="datetime-local"
                        value={noticeForm.expires_at}
                        onChange={(e) => setNoticeForm({ ...noticeForm, expires_at: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={noticeForm.is_active}
                        onCheckedChange={(checked) => setNoticeForm({ ...noticeForm, is_active: checked })}
                      />
                      <Label>Active</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowAddNotice(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Notice</Button>
                    </div>
                  </div>
                </form>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notices.map((notice) => (
                    <TableRow key={notice.id}>
                      <TableCell className="font-medium">{notice.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{notice.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={notice.is_active ? "default" : "secondary"}>
                          {notice.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(notice.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleNotice(notice.id, notice.is_active)}
                          >
                            {notice.is_active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteNotice(notice.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
