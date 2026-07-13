"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

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
import type {
  CategoryOption,
  UnitOption,
} from "@/components/products/product-form";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
  categories: CategoryOption[];
  units: UnitOption[];
};

export function EditProductDialog({ product, categories, units }: Props) {
  const [open, setOpen] = useState(false);

  // Map product fields to appropriate form values.
  // Note: cost and reorderPoint are numbers in the schema.
  const defaultValues = {
    name: product.name,
    sku: product.sku || "",
    categoryId:
      categories.find((c) => c.name === product.categoryName)?.id || "",
    unitId: units.find((u) => u.name === product.unitName)?.id || "",
    cost: parseFloat(product.cost) || 0,
    reorderPoint: parseFloat(product.reorderPoint) || 0,
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon-xs"
          onClick={(e) => {
            // Prevent triggering row navigation
            e.stopPropagation();
            setOpen(true);
          }}
          className="border-border hover:bg-bg-surface-hover hover:text-text-primary"
        >
          <Pencil className="size-3" />
          <span className="sr-only">Edit Product</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent
        onClick={(e) => e.stopPropagation()} // Prevent closing dialog on content click if inside clicked row
        className="max-w-lg! rounded-sm border-border bg-bg-surface p-6 text-text-primary"
      >
        <AlertDialogHeader className="place-items-start! text-left! border-b border-border pb-4">
          <AlertDialogTitle className="text-sm font-semibold uppercase tracking-widest text-text-primary">
            Edit Product
          </AlertDialogTitle>
          <AlertDialogDescription className="text-text-secondary">
            Update the product details for {product.name}.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ProductForm
          mode="update"
          productId={product.id}
          defaultValues={defaultValues}
          categories={categories}
          units={units}
          onSuccess={() => setOpen(false)}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
