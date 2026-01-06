// app/admin/inventory/components/DeleteDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  onConfirm: () => Promise<boolean>; // ⬅️ penting
  onCancel: () => void;
}

export function DeleteDialog({
  open,
  onOpenChange,
  productName,
  onConfirm,
  onCancel,
}: DeleteDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    const success = await onConfirm();

    if (!success) {
      setError(
        "Product cannot be deleted because it has been ordered. Please set it inactive instead."
      );
      setLoading(false);
      return;
    }

    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{productName}&quot;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
