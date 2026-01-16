import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Minus, Search, Package } from "lucide-react";
import {
  DetailedComponent,
  PLUMBING_COMPONENTS,
  ELECTRICAL_COMPONENTS,
  CARPENTRY_COMPONENTS,
} from "@/lib/detailed-components-data";

interface SelectedComponent {
  component: DetailedComponent;
  quantity: number;
}

interface ComponentSelectorProps {
  trade: "plumbing" | "electrical" | "carpentry";
  selectedComponents: SelectedComponent[];
  onComponentsChange: (components: SelectedComponent[]) => void;
  useTradePrices: boolean;
}

export function ComponentSelector({
  trade,
  selectedComponents,
  onComponentsChange,
  useTradePrices,
}: ComponentSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const components =
    trade === "plumbing"
      ? PLUMBING_COMPONENTS
      : trade === "electrical"
      ? ELECTRICAL_COMPONENTS
      : CARPENTRY_COMPONENTS;

  const categories = ["all", ...new Set(components.map((c) => c.category))];

  const filteredComponents = components.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const addComponent = (component: DetailedComponent) => {
    const existing = selectedComponents.find((sc) => sc.component.id === component.id);
    if (existing) {
      onComponentsChange(
        selectedComponents.map((sc) =>
          sc.component.id === component.id ? { ...sc, quantity: sc.quantity + 1 } : sc
        )
      );
    } else {
      onComponentsChange([...selectedComponents, { component, quantity: 1 }]);
    }
  };

  const updateQuantity = (componentId: string, delta: number) => {
    onComponentsChange(
      selectedComponents
        .map((sc) =>
          sc.component.id === componentId
            ? { ...sc, quantity: Math.max(0, sc.quantity + delta) }
            : sc
        )
        .filter((sc) => sc.quantity > 0)
    );
  };

  const removeComponent = (componentId: string) => {
    onComponentsChange(selectedComponents.filter((sc) => sc.component.id !== componentId));
  };

  const totalCost = selectedComponents.reduce((sum, sc) => {
    const price = useTradePrices ? sc.component.tradeCost : sc.component.retailCost;
    return sum + price * sc.quantity;
  }, 0);

  const categoryLabels: Record<string, string> = {
    all: "All",
    pipe: "Pipes",
    fitting: "Fittings",
    valve: "Valves",
    seal: "Seals & O-rings",
    fixing: "Fixings & Clips",
    consumable: "Consumables",
    electrical: "Electrical",
    tool: "Tools",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Components & Materials</Label>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Package className="h-4 w-4 mr-2" />
              Add Components
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Select Components</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search components..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="flex-wrap h-auto gap-1">
                  {categories.map((cat) => (
                    <TabsTrigger key={cat} value={cat} className="text-xs">
                      {categoryLabels[cat] || cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <ScrollArea className="flex-1 max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="text-right">Trade</TableHead>
                      <TableHead className="text-right">Retail</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComponents.map((component) => {
                      const selected = selectedComponents.find(
                        (sc) => sc.component.id === component.id
                      );
                      return (
                        <TableRow key={component.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{component.name}</p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {component.partCode}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {component.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            £{component.tradeCost.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            £{component.retailCost.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {selected ? (
                              <div className="flex items-center gap-1">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(component.id, -1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center text-sm">
                                  {selected.quantity}
                                </span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(component.id, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => addComponent(component)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <span className="text-sm text-muted-foreground">
                  {selectedComponents.length} items selected
                </span>
              </div>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {selectedComponents.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="w-24 text-center">Qty</TableHead>
                <TableHead className="w-24 text-right">Unit</TableHead>
                <TableHead className="w-24 text-right">Total</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedComponents.map((sc) => {
                const unitPrice = useTradePrices
                  ? sc.component.tradeCost
                  : sc.component.retailCost;
                return (
                  <TableRow key={sc.component.id}>
                    <TableCell>
                      <span className="text-sm">{sc.component.name}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(sc.component.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={sc.quantity}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value) || 0;
                            const delta = newQty - sc.quantity;
                            updateQuantity(sc.component.id, delta);
                          }}
                          className="w-12 h-6 text-center text-sm p-0"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(sc.component.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      £{unitPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">
                      £{(unitPrice * sc.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-destructive"
                        onClick={() => removeComponent(sc.component.id)}
                      >
                        ×
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="bg-muted/30">
                <TableCell colSpan={3} className="font-semibold">
                  Materials Total
                </TableCell>
                <TableCell className="text-right font-bold text-primary">
                  £{totalCost.toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {selectedComponents.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
          <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No components added yet</p>
          <p className="text-xs">Click "Add Components" to select materials</p>
        </div>
      )}
    </div>
  );
}