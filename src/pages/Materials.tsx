import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Package,
  Plus,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
} from "lucide-react";

type Project = Tables<"projects">;
type MaterialOrder = Tables<"material_orders">;

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: any }> = {
  draft: { bg: "bg-muted/50", text: "text-muted-foreground", icon: Package },
  ordered: { bg: "bg-primary/10", text: "text-primary", icon: Clock },
  shipped: { bg: "bg-warning/10", text: "text-warning", icon: Truck },
  delivered: { bg: "bg-success/10", text: "text-success", icon: CheckCircle },
  delayed: { bg: "bg-destructive/10", text: "text-destructive", icon: AlertCircle },
};

const MATERIAL_CATEGORIES = [
  { name: "Structural Steel", items: ["RSJ Beams", "Steel Columns", "Lintels", "Joist Hangers"] },
  { name: "Timber", items: ["Softwood Joists", "Roof Trusses", "Battens", "Plywood Sheets"] },
  { name: "Concrete", items: ["Ready Mix C25", "Ready Mix C30", "Blocks", "Foundation Mix"] },
  { name: "Insulation", items: ["Kingspan 100mm", "Rockwool", "PIR Board", "Cavity Batts"] },
  { name: "Roofing", items: ["Concrete Tiles", "Slate", "EPDM Membrane", "Lead Flashing"] },
  { name: "Windows & Doors", items: ["UPVC Windows", "Aluminium Doors", "Bi-fold Doors", "Velux Windows"] },
  { name: "Electrical", items: ["Consumer Unit", "Cable 2.5mm", "Cable 1.5mm", "Accessories"] },
  { name: "Plumbing", items: ["Copper Pipe 15mm", "Copper Pipe 22mm", "Waste Pipe", "Fittings"] },
];

export default function Materials() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [orders, setOrders] = useState<MaterialOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [selectedProject, setSelectedProject] = useState("");
  const [supplier, setSupplier] = useState("");
  const [orderItems, setOrderItems] = useState<{ name: string; quantity: number; unit: string; unitCost: number }[]>([
    { name: "", quantity: 1, unit: "each", unitCost: 0 }
  ]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [leadTimeDays, setLeadTimeDays] = useState("7");

  useEffect(() => {
    fetchData();
  }, [user]);

  async function fetchData() {
    if (!user) return;

    const [projectsRes, ordersRes] = await Promise.all([
      supabase.from("projects").select("*"),
      supabase.from("material_orders").select("*").order("created_at", { ascending: false }),
    ]);

    if (projectsRes.data) setProjects(projectsRes.data);
    if (ordersRes.data) setOrders(ordersRes.data);
    setLoading(false);
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name || "Unknown Project";
  };

  const addItem = () => {
    setOrderItems([...orderItems, { name: "", quantity: 1, unit: "each", unitCost: 0 }]);
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...orderItems];
    (newItems[index] as any)[field] = value;
    setOrderItems(newItems);
  };

  const totalCost = orderItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

  const handleCreateOrder = async () => {
    if (!selectedProject || orderItems.every(item => !item.name)) {
      toast.error("Please select a project and add at least one item");
      return;
    }

    setCreating(true);

    try {
      const { data, error } = await supabase
        .from("material_orders")
        .insert({
          project_id: selectedProject,
          supplier: supplier || null,
          items: orderItems.filter(item => item.name),
          total_cost: totalCost,
          lead_time_days: parseInt(leadTimeDays),
          delivery_date: deliveryDate || null,
          order_date: new Date().toISOString().split("T")[0],
          status: "draft",
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Order created successfully");
      setOrders([data, ...orders]);
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create order");
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setSelectedProject("");
    setSupplier("");
    setOrderItems([{ name: "", quantity: 1, unit: "each", unitCost: 0 }]);
    setDeliveryDate("");
    setLeadTimeDays("7");
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from("material_orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update order");
    } else {
      toast.success("Order updated");
      setOrders(orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ));
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Material Orders</h1>
            <p className="text-muted-foreground">
              Track and manage material procurement
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Material Order</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Project</Label>
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Supplier</Label>
                    <Input
                      placeholder="e.g., Travis Perkins"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Order Items</Label>
                  <div className="space-y-2">
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30">
                        <Select
                          value={item.name}
                          onValueChange={(value) => updateItem(index, "name", value)}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select item" />
                          </SelectTrigger>
                          <SelectContent>
                            {MATERIAL_CATEGORIES.map((cat) => (
                              <div key={cat.name}>
                                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                                  {cat.name}
                                </div>
                                {cat.items.map((mat) => (
                                  <SelectItem key={mat} value={mat}>
                                    {mat}
                                  </SelectItem>
                                ))}
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                          className="w-20 font-mono"
                          placeholder="Qty"
                        />
                        <Select
                          value={item.unit}
                          onValueChange={(value) => updateItem(index, "unit", value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="each">Each</SelectItem>
                            <SelectItem value="m">Metres</SelectItem>
                            <SelectItem value="m2">m²</SelectItem>
                            <SelectItem value="m3">m³</SelectItem>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="pack">Pack</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">£</span>
                          <Input
                            type="number"
                            value={item.unitCost}
                            onChange={(e) => updateItem(index, "unitCost", parseFloat(e.target.value))}
                            className="w-24 font-mono"
                            placeholder="Unit cost"
                          />
                        </div>
                        {orderItems.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="text-destructive"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addItem}>
                      + Add Item
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Lead Time (days)</Label>
                    <Input
                      type="number"
                      value={leadTimeDays}
                      onChange={(e) => setLeadTimeDays(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Expected Delivery</Label>
                    <Input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary/30">
                  <div className="flex justify-between font-semibold">
                    <span>Total Order Value</span>
                    <span className="font-mono text-primary">£{totalCost.toLocaleString()}</span>
                  </div>
                </div>

                <Button onClick={handleCreateOrder} className="w-full" disabled={creating}>
                  {creating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Create Order
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-6 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
            <p className="stat-number text-2xl">{orders.length}</p>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Pending Delivery</p>
            <p className="stat-number text-2xl">
              {orders.filter((o) => o.status === "ordered" || o.status === "shipped").length}
            </p>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Total Value</p>
            <p className="stat-number text-2xl">
              £{orders.reduce((sum, o) => sum + (o.total_cost || 0), 0).toLocaleString()}
            </p>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Delivered</p>
            <p className="stat-number text-2xl">
              {orders.filter((o) => o.status === "delivered").length}
            </p>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="glass-card p-12 rounded-xl text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first material order to track deliveries.
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = STATUS_COLORS[order.status || "draft"];
              const StatusIcon = statusConfig.icon;
              const items = (order.items as any[]) || [];

              return (
                <div key={order.id} className="glass-card p-6 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${statusConfig.bg}`}>
                        <StatusIcon className={`h-5 w-5 ${statusConfig.text}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold">{getProjectName(order.project_id)}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusConfig.bg} ${statusConfig.text}`}>
                            {order.status}
                          </span>
                        </div>
                        {order.supplier && (
                          <p className="text-sm text-muted-foreground">{order.supplier}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {items.length} items • Ordered: {order.order_date ? format(new Date(order.order_date), "MMM d") : "N/A"}
                          {order.delivery_date && ` • Delivery: ${format(new Date(order.delivery_date), "MMM d")}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="stat-number text-2xl mb-2">
                        £{(order.total_cost || 0).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2">
                        {order.status === "draft" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, "ordered")}
                          >
                            Mark Ordered
                          </Button>
                        )}
                        {order.status === "ordered" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, "shipped")}
                          >
                            Mark Shipped
                          </Button>
                        )}
                        {order.status === "shipped" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, "delivered")}
                          >
                            Mark Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex flex-wrap gap-2">
                      {items.slice(0, 4).map((item: any, i: number) => (
                        <span key={i} className="text-xs px-2 py-1 rounded bg-secondary/50">
                          {item.name} ×{item.quantity}
                        </span>
                      ))}
                      {items.length > 4 && (
                        <span className="text-xs px-2 py-1 rounded bg-secondary/50 text-muted-foreground">
                          +{items.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
