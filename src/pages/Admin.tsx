import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Users, 
  Shield, 
  Settings, 
  BarChart3, 
  Loader2, 
  UserPlus,
  Crown,
  AlertTriangle,
  CheckCircle,
  Search,
  RefreshCw
} from "lucide-react";
import { Navigate } from "react-router-dom";

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  company_name: string;
  subscription_tier: string;
  credits_remaining: number;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

export default function Admin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    proUsers: 0,
    businessUsers: 0,
    totalProjects: 0,
    totalJobs: 0,
  });

  // Role update dialog
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newRole, setNewRole] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) return;

    try {
      const { data } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });

      setIsAdmin(data === true);

      if (data === true) {
        await Promise.all([fetchUsers(), fetchStats()]);
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setUsers(profiles || []);

      // Fetch roles for all users
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (userRoles) {
        const roleMap: Record<string, string> = {};
        userRoles.forEach((r) => {
          roleMap[r.user_id] = r.role;
        });
        setRoles(roleMap);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const [profilesRes, projectsRes, jobsRes] = await Promise.all([
        supabase.from("profiles").select("subscription_tier"),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("trade_jobs").select("id", { count: "exact", head: true }),
      ]);

      const profiles = profilesRes.data || [];
      
      setStats({
        totalUsers: profiles.length,
        proUsers: profiles.filter((p) => p.subscription_tier === "pro").length,
        businessUsers: profiles.filter((p) => p.subscription_tier === "business").length,
        totalProjects: projectsRes.count || 0,
        totalJobs: jobsRes.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const updateUserRole = async () => {
    if (!selectedUser || !newRole) return;

    setUpdating(true);
    try {
      // Check if user already has a role
      const existingRole = roles[selectedUser.user_id];
      const roleValue = newRole as "admin" | "moderator" | "user";

      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from("user_roles")
          .update({ role: roleValue })
          .eq("user_id", selectedUser.user_id);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from("user_roles")
          .insert([{ user_id: selectedUser.user_id, role: roleValue }]);

        if (error) throw error;
      }

      toast.success(`Role updated to ${newRole}`);
      setRoles({ ...roles, [selectedUser.user_id]: newRole });
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update role");
    } finally {
      setUpdating(false);
    }
  };

  const updateSubscription = async (userId: string, tier: string) => {
    try {
      const tierValue = tier as "free" | "pro" | "business" | "enterprise";
      const { error } = await supabase
        .from("profiles")
        .update({ subscription_tier: tierValue })
        .eq("user_id", userId);

      if (error) throw error;

      toast.success(`Subscription updated to ${tier}`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update subscription");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage users, roles, and platform settings
            </p>
          </div>
          
          <Button variant="outline" onClick={() => { fetchUsers(); fetchStats(); }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.proUsers}</p>
                  <p className="text-xs text-muted-foreground">Pro Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.businessUsers}</p>
                  <p className="text-xs text-muted-foreground">Business</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalProjects}</p>
                  <p className="text-xs text-muted-foreground">Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalJobs}</p>
                  <p className="text-xs text-muted-foreground">Trade Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and manage all platform users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{u.full_name || "No name"}</p>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                          {u.company_name && (
                            <p className="text-xs text-muted-foreground">{u.company_name}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={roles[u.user_id] === "admin" ? "default" : "outline"}
                          className={roles[u.user_id] === "admin" ? "bg-yellow-500" : ""}
                        >
                          {roles[u.user_id] || "user"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={u.subscription_tier || "free"}
                          onValueChange={(v) => updateSubscription(u.user_id, v)}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="pro">Pro</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{u.credits_remaining}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(u);
                                setNewRole(roles[u.user_id] || "user");
                              }}
                            >
                              <Shield className="h-4 w-4 mr-1" />
                              Role
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update User Role</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div>
                                <Label>User</Label>
                                <p className="text-sm text-muted-foreground">
                                  {selectedUser?.email}
                                </p>
                              </div>
                              <div>
                                <Label>Role</Label>
                                <Select value={newRole} onValueChange={setNewRole}>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="moderator">Moderator</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              {newRole === "admin" && (
                                <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg">
                                  <AlertTriangle className="h-4 w-4 text-warning" />
                                  <p className="text-sm text-warning">
                                    Admin role grants full platform access
                                  </p>
                                </div>
                              )}
                              <Button
                                onClick={updateUserRole}
                                disabled={updating}
                                className="w-full"
                              >
                                {updating ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                Update Role
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
