import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingCart,
  Package,
  Truck,
  Printer,
  Download,
  Check,
} from "lucide-react";
import {
  ConsolidatedMaterial,
  SupplierOrder,
  consolidateMaterials,
  generateSupplierOrders,
  groupByCategory,
  PREFERRED_SUPPLIERS,
} from "@/lib/materials-shopping-list";

interface MaterialsShoppingListProps {
  jobMaterials: { jobName: string; materials: { name: string; quantity: number; unit: string; unitCostTrade: number; unitCostRetail: number }[] }[];
  isTradePrice: boolean;
}

export function MaterialsShoppingList({ jobMaterials, isTradePrice }: MaterialsShoppingListProps) {
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  
  const consolidated = consolidateMaterials(jobMaterials);
  const byCategory = groupByCategory(consolidated);
  const supplierOrders = generateSupplierOrders(consolidated, selectedSupplier || undefined);
  
  const totalItems = consolidated.length;
  const totalCost = consolidated.reduce(
    (sum, m) => sum + (isTradePrice ? m.totalCostTrade : m.totalCostRetail), 
    0
  );

  const toggleItem = (name: string) => {
    const next = new Set(checkedItems);
    if (next.has(name)) {
      next.delete(name);
    } else {
      next.add(name);
    }
    setCheckedItems(next);
  };

  const printShoppingList = () => {
    const content = `
      <html>
      <head>
        <title>Materials Shopping List</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 20px; }
          h1 { color: #1a1a1a; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #f5f5f5; }
          .total { font-weight: bold; font-size: 1.2em; }
          .category { background: #e5e7eb; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Materials Shopping List</h1>
        <p>Generated: ${new Date().toLocaleDateString()}</p>
        <table>
          <thead>
            <tr>
              <th>Material</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(byCategory).map(([cat, materials]) => `
              <tr class="category"><td colspan="5">${cat}</td></tr>
              ${materials.map(m => `
                <tr>
                  <td>${m.name}</td>
                  <td>${m.totalQuantity}</td>
                  <td>${m.unit}</td>
                  <td>£${(isTradePrice ? m.unitCostTrade : m.unitCostRetail).toFixed(2)}</td>
                  <td>£${(isTradePrice ? m.totalCostTrade : m.totalCostRetail).toFixed(2)}</td>
                </tr>
              `).join("")}
            `).join("")}
          </tbody>
        </table>
        <p class="total">Total: £${totalCost.toFixed(2)} (${totalItems} items)</p>
      </body>
      </html>
    `;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const downloadCSV = () => {
    const headers = ["Category", "Material", "Quantity", "Unit", "Unit Price", "Total", "Jobs"];
    const rows = consolidated.map(m => [
      m.category,
      m.name,
      m.totalQuantity,
      m.unit,
      isTradePrice ? m.unitCostTrade : m.unitCostRetail,
      isTradePrice ? m.totalCostTrade : m.totalCostRetail,
      m.jobs.join("; "),
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "materials-shopping-list.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (consolidated.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No materials to display</p>
          <p className="text-sm text-muted-foreground">Add jobs with materials to generate a shopping list</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">£{totalCost.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  {totalItems} items | {isTradePrice ? "Trade" : "Retail"} prices
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All suppliers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Suppliers</SelectItem>
                  {Object.values(PREFERRED_SUPPLIERS).flat().filter((v, i, a) => a.indexOf(v) === i).map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={printShoppingList}>
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={downloadCSV}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* By Category */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Materials by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {Object.entries(byCategory).map(([category, materials]) => (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <span>{category}</span>
                    <Badge variant="secondary">{materials.length}</Badge>
                    <span className="text-sm text-muted-foreground ml-2">
                      £{materials.reduce((s, m) => s + (isTradePrice ? m.totalCostTrade : m.totalCostRetail), 0).toFixed(2)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8"></TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Jobs</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materials.map(m => (
                        <TableRow key={m.name} className={checkedItems.has(m.name) ? "opacity-50" : ""}>
                          <TableCell>
                            <Checkbox 
                              checked={checkedItems.has(m.name)} 
                              onCheckedChange={() => toggleItem(m.name)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{m.name}</TableCell>
                          <TableCell>{m.totalQuantity} {m.unit}</TableCell>
                          <TableCell>£{(isTradePrice ? m.unitCostTrade : m.unitCostRetail).toFixed(2)}</TableCell>
                          <TableCell>£{(isTradePrice ? m.totalCostTrade : m.totalCostRetail).toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {m.jobs.map(j => (
                                <Badge key={j} variant="outline" className="text-xs">{j}</Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Supplier Orders */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Supplier Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supplierOrders.map(order => (
              <Card key={order.supplier} className="border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{order.supplier}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items</span>
                      <span>{order.itemCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-semibold">
                        £{(isTradePrice ? order.totalCostTrade : order.totalCostRetail).toFixed(2)}
                      </span>
                    </div>
                    <ScrollArea className="h-24 mt-2">
                      <div className="space-y-1">
                        {order.materials.map(m => (
                          <div key={m.name} className="text-xs flex justify-between">
                            <span className="truncate flex-1">{m.name}</span>
                            <span className="ml-2">{m.totalQuantity} {m.unit}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
