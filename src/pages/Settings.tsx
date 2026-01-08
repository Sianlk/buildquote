import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  User,
  Building2,
  CreditCard,
  Bell,
  Shield,
  Palette,
  Loader2,
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  // Profile
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");

  // Preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [defaultRegion, setDefaultRegion] = useState("south_east");
  const [defaultVat, setDefaultVat] = useState("20");

  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Settings saved successfully");
    setSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="company">
              <Building2 className="h-4 w-4 mr-2" />
              Company
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="glass-card p-6 rounded-xl space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{user?.email}</h3>
                  <p className="text-sm text-muted-foreground">Free Plan</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Change Photo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Smith"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7123 456789"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Email Address</Label>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="mt-1 bg-secondary/30"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Contact support to change your email address
                </p>
              </div>

              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* Company Tab */}
          <TabsContent value="company">
            <div className="glass-card p-6 rounded-xl space-y-6">
              <div>
                <Label>Company Name</Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="ABC Builders Ltd"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Default Region</Label>
                  <select
                    value={defaultRegion}
                    onChange={(e) => setDefaultRegion(e.target.value)}
                    className="w-full mt-1 h-10 rounded-lg border border-input bg-background px-3"
                  >
                    <option value="london">London</option>
                    <option value="south_east">South East</option>
                    <option value="south_west">South West</option>
                    <option value="midlands">Midlands</option>
                    <option value="north">North</option>
                    <option value="scotland">Scotland</option>
                    <option value="wales">Wales</option>
                    <option value="ni">Northern Ireland</option>
                  </select>
                </div>
                <div>
                  <Label>Default VAT Rate (%)</Label>
                  <select
                    value={defaultVat}
                    onChange={(e) => setDefaultVat(e.target.value)}
                    className="w-full mt-1 h-10 rounded-lg border border-input bg-background px-3"
                  >
                    <option value="0">0% (Zero Rated)</option>
                    <option value="5">5% (Reduced)</option>
                    <option value="20">20% (Standard)</option>
                  </select>
                </div>
              </div>

              <div>
                <Label>Company Logo</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your logo or click to upload
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Upload Logo
                  </Button>
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Current Plan</h3>
                    <p className="text-sm text-muted-foreground">Free Plan</p>
                  </div>
                  <Button variant="gold">Upgrade to Pro</Button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center p-4 rounded-lg bg-secondary/30">
                  <div>
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-xs text-muted-foreground">Projects</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">100</p>
                    <p className="text-xs text-muted-foreground">AI Credits</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">Yes</p>
                    <p className="text-xs text-muted-foreground">Watermarks</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-semibold mb-4">Payment Method</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  No payment method on file
                </p>
                <Button variant="outline">Add Payment Method</Button>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-semibold mb-4">Billing History</h3>
                <p className="text-sm text-muted-foreground">
                  No billing history available
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="glass-card p-6 rounded-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your projects
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Project Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded about overdue invoices and deliveries
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Compliance Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Be notified about compliance issues
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive news and feature updates
                  </p>
                </div>
                <Switch />
              </div>

              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save Preferences
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
