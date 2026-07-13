import { z } from "zod/v4";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(100, "Product name must not exceed 100 characters"),
  sku: z
    .string()
    .trim()
    .max(50, "SKU must not exceed 50 characters")
    .optional()
    .or(z.literal("")),
  categoryId: z.string().min(1, "Category is required"),
  unitId: z.string().min(1, "Unit is required"),
  cost: z.coerce
    .number()
    .min(0, "Cost must be a non-negative number"),
  reorderPoint: z.coerce
    .number()
    .min(0, "Reorder point must be a non-negative number"),
});

export type CreateProductRequest = z.input<typeof productSchema>
export type CreateProductPayload = z.infer<typeof productSchema>

// Update uses the same schema — no reason required
export type UpdateProductRequest = CreateProductRequest
export type UpdateProductPayload = CreateProductPayload
