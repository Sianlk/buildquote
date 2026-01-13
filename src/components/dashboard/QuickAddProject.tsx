import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";

interface QuickAddProjectProps {
  onSubmit: (data: {
    name: string;
    projectType: string;
    address?: string;
    postcode?: string;
  }) => Promise<void>;
}

const PROJECT_TYPES = [
  { value: "single_storey_rear", label: "Single Storey Rear Extension" },
  { value: "single_storey_side", label: "Single Storey Side Extension" },
  { value: "double_storey_rear", label: "Double Storey Rear Extension" },
  { value: "loft_dormer", label: "Dormer Loft Conversion" },
  { value: "loft_hip_to_gable", label: "Hip to Gable Loft" },
  { value: "garage_integral", label: "Garage Conversion" },
  { value: "new_build", label: "New Build" },
  { value: "renovation", label: "Full Renovation" },
];

export function QuickAddProject({ onSubmit }: QuickAddProjectProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");

  const handleSubmit = async () => {
    if (!name || !projectType) return;

    setLoading(true);
    try {
      await onSubmit({ name, projectType, address, postcode });
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setProjectType("");
    setAddress("");
    setPostcode("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Quick Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick Add Project</DialogTitle>
          <DialogDescription>
            Create a new project quickly. You can add more details later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Smith Residence Extension"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Project Type *</Label>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Optional"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode</Label>
              <Input
                id="postcode"
                placeholder="e.g., SW1A 1AA"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name || !projectType || loading}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Create Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
