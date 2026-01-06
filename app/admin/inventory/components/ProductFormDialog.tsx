// app/admin/inventory/components/ProductFormDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import { ProductFormData } from "@/hooks/useProducts";
import { Category } from "@prisma/client";

const CATEGORIES = [
  { value: Category.BASIC, label: "Basic" },
  { value: Category.PREMIUM, label: "Premium" },
  { value: Category.DEEP, label: "Deep" },
  { value: Category.TREATMENT, label: "Treatment" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  mode,
  formData,
  setFormData,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new product or service"
              : "Update product information"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Product Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="min-h-20 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Price *</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Duration (days) *</Label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Stock</Label>
            <Input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  category: value as Category,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
            />
            <Label>Active</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {mode === "add" ? "Add Product" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
