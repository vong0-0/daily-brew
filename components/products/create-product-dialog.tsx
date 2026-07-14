"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/products/product-form";
import type { CategoryOption } from "@/lib/data/category";
import type { UnitOption } from "@/lib/data/unit";

type Props = {
  categories: CategoryOption[];
  units: UnitOption[];
};

export function CreateProductDialog({ categories, units }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button id="create-product-btn" className="px-4 py-2">
          <Plus />
          Add Product
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-lg! rounded-sm border-border bg-bg-surface p-6 text-text-primary">
        <AlertDialogHeader className="place-items-start! text-left! border-b border-border pb-4">
          <AlertDialogTitle className="text-sm font-semibold uppercase tracking-widest text-text-primary">
            Add New Product
          </AlertDialogTitle>
          <AlertDialogDescription className="text-text-secondary">
            Register a new raw material to the inventory.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ProductForm
          mode="create"
          categories={categories}
          units={units}
          onSuccess={() => setOpen(false)}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
