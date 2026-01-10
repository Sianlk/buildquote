import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  PoundSterling,
  FileText,
  FolderOpen,
  Clock,
} from "lucide-react";

interface AnalyticsData {
  projectStats: {
    total: number;
    byStatus: { status: string; count: number }[];
    byType: { type: string; count: number }[];
    totalValue: number;
    avgDuration: number;
  };
  complianceStats: {
    overallScore: number;
    passed: number;
    warning: number;
    failed: number;
    recentChecks: { project: string; score: number; date: string }[];
  };
  financialStats: {
    totalInvoiced: number;
    totalPaid: number;
    outstanding: number;
    retention: number;
    monthlyRevenue: { month: string; revenue: number; expenses: number }[];
  };
  recentActivity: {
    type: string;
    description: string;
    date: string;
    status: string;
  }[];
}

const STATUS_COLORS: Record<string, string> = {
  draft: "#6b7280",
  in_progress: "#3b82f6",
  quoted: "#10b981",
  approved: "#22c55e",
  completed: "#059669",
  archived: "#9ca3af",
};

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function DashboardAnalytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  async function fetchAnalytics() {
    try {
      const [projectsRes, invoicesRes, complianceRes, receiptsRes] = await Promise.all([
        supabase.from("projects").select("*"),
        supabase.from("invoices").select("*"),
        supabase.from("compliance_reports").select("*"),
        supabase.from("trade_receipts").select("*"),
      ]);

      const projects = projectsRes.data || [];
      const invoices = invoicesRes.data || [];
      const compliance = complianceRes.data || [];
      const receipts = receiptsRes.data || [];

      // Project statistics
      const byStatus = projects.reduce((acc, p) => {
        const status = p.status || "draft";
        const existing = acc.find(a => a.status === status);
        if (existing) existing.count++;
        else acc.push({ status, count: 1 });
        return acc;
      }, [] as { status: string; count: number }[]);

      const byType = projects.reduce((acc, p) => {
        const type = p.project_type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        const existing = acc.find(a => a.type === type);
        if (existing) existing.count++;
        else acc.push({ type, count: 1 });
        return acc;
      }, [] as { type: string; count: number }[]);

      // Compliance statistics
      const passed = compliance.filter(c => c.status === "pass").length;
      const warning = compliance.filter(c => c.status === "warning").length;
      const failed = compliance.filter(c => c.status === "fail").length;
      const total = passed + warning + failed;
      const overallScore = total > 0 ? Math.round((passed / total) * 100) : 100;

      // Financial statistics
      const totalInvoiced = invoices.reduce((sum, i) => sum + (i.gross_value || 0), 0);
      const totalPaid = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + (i.gross_value || 0), 0);
      const outstanding = totalInvoiced - totalPaid;
      const retention = invoices.reduce((sum, i) => sum + (i.retention_value || 0), 0);

      // Monthly revenue calculation (last 6 months)
      const monthlyRevenue = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthInvoices = invoices.filter(inv => {
          const invDate = new Date(inv.created_at!);
          return invDate >= monthStart && invDate <= monthEnd;
        });
        
        const monthReceipts = receipts.filter(r => {
          const rDate = new Date(r.receipt_date);
          return rDate >= monthStart && rDate <= monthEnd;
        });
        
        monthlyRevenue.push({
          month,
          revenue: monthInvoices.reduce((sum, i) => sum + (i.gross_value || 0), 0),
          expenses: monthReceipts.reduce((sum, r) => sum + (r.gross_amount || 0), 0),
        });
      }

      // Recent compliance checks
      const recentChecks = compliance
        .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
        .slice(0, 5)
        .map(c => ({
          project: c.project_id,
          score: c.passed ? 100 : c.status === "warning" ? 50 : 0,
          date: c.created_at!,
        }));

      setAnalytics({
        projectStats: {
          total: projects.length,
          byStatus,
          byType: byType.slice(0, 6),
          totalValue: projects.reduce((sum, p) => sum + (p.estimated_cost || 0), 0),
          avgDuration: projects.length > 0 
            ? Math.round(projects.reduce((sum, p) => sum + (p.estimated_duration_weeks || 0), 0) / projects.length)
            : 0,
        },
        complianceStats: {
          overallScore,
          passed,
          warning,
          failed,
          recentChecks,
        },
        financialStats: {
          totalInvoiced,
          totalPaid,
          outstanding,
          retention,
          monthlyRevenue,
        },
        recentActivity: [],
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  const { projectStats, complianceStats, financialStats } = analytics;

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-3xl font-bold">{projectStats.total}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-success/10 to-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quoted Value</p>
                <p className="text-3xl font-bold">£{(projectStats.totalValue / 1000).toFixed(0)}k</p>
              </div>
              <PoundSterling className="h-8 w-8 text-success opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-warning/10 to-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
                <p className="text-3xl font-bold">{complianceStats.overallScore}%</p>
              </div>
              {complianceStats.overallScore >= 80 ? (
                <CheckCircle className="h-8 w-8 text-success opacity-70" />
              ) : complianceStats.overallScore >= 50 ? (
                <AlertTriangle className="h-8 w-8 text-warning opacity-70" />
              ) : (
                <XCircle className="h-8 w-8 text-destructive opacity-70" />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Duration</p>
                <p className="text-3xl font-bold">{projectStats.avgDuration} wks</p>
              </div>
              <Clock className="h-8 w-8 text-accent-foreground opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Revenue vs Expenses (6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={financialStats.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis tickFormatter={(v) => `£${(v/1000).toFixed(0)}k`} className="text-xs" />
                  <Tooltip 
                    formatter={(value: number) => `£${value.toLocaleString()}`}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--destructive))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Project Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-primary" />
              Projects by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStats.byStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    label={({ status, count }) => `${status}: ${count}`}
                    labelLine={false}
                  >
                    {projectStats.byStatus.map((entry, index) => (
                      <Cell 
                        key={entry.status} 
                        fill={STATUS_COLORS[entry.status] || CHART_COLORS[index % CHART_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              Compliance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-primary">{complianceStats.overallScore}%</div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Passed</span>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success">
                  {complianceStats.passed}
                </Badge>
              </div>
              <Progress value={(complianceStats.passed / (complianceStats.passed + complianceStats.warning + complianceStats.failed || 1)) * 100} className="h-2 bg-success/20" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm">Warnings</span>
                </div>
                <Badge variant="outline" className="bg-warning/10 text-warning">
                  {complianceStats.warning}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">Failed</span>
                </div>
                <Badge variant="outline" className="bg-destructive/10 text-destructive">
                  {complianceStats.failed}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PoundSterling className="h-4 w-4 text-primary" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-success/10">
                <p className="text-xs text-muted-foreground">Total Paid</p>
                <p className="text-lg font-bold text-success">£{financialStats.totalPaid.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-warning/10">
                <p className="text-xs text-muted-foreground">Outstanding</p>
                <p className="text-lg font-bold text-warning">£{financialStats.outstanding.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Invoiced</span>
                <span className="font-mono">£{financialStats.totalInvoiced.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Retention Held</span>
                <span className="font-mono">£{financialStats.retention.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="font-medium">Collection Rate</span>
                <span className="font-mono font-medium text-primary">
                  {financialStats.totalInvoiced > 0 
                    ? Math.round((financialStats.totalPaid / financialStats.totalInvoiced) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Types Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Projects by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectStats.byType} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="type" 
                    type="category" 
                    width={100}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
