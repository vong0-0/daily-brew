"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import {
  productSchema,
  type CreateProductRequest,
  type UpdateProductRequest,
} from "@/lib/validations/product.schema";
import { Prisma } from "@/prisma/generated/prisma/client";
import { revalidatePath } from "next/cache";

type ActionResult = {
  success: boolean;
  error?: string | Record<string, string[]>;
  message?: string;
};

export async function createProduct(data: CreateProductRequest): Promise<ActionResult> {
  await requireAdmin();

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const { name, sku, categoryId, unitId, cost, reorderPoint } = parsed.data;

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { isActive: true },
    });
    if (!category?.isActive) {
      return { success: false, error: { categoryId: ["Selected category is not active or does not exist"] } };
    }

    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      select: { isActive: true },
    });
    if (!unit?.isActive) {
      return { success: false, error: { unitId: ["Selected unit is not active or does not exist"] } };
    }

    const existingName = await prisma.product.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        isActive: true,
      },
      select: { id: true },
    });
    if (existingName) {
      return { success: false, error: { name: ["A product with this name already exists"] } };
    }

    if (sku) {
      const existingSku = await prisma.product.findUnique({ where: { sku }, select: { id: true } });
      if (existingSku) {
        return { success: false, error: { sku: ["A product with this SKU already exists"] } };
      }
    }

    await prisma.product.create({
      data: {
        name,
        sku: sku || null,
        categoryId,
        unitId,
        cost: new Prisma.Decimal(cost),
        reorderPoint: new Prisma.Decimal(reorderPoint),
        currentStock: new Prisma.Decimal(0),
        isActive: true,
      },
    });

    revalidatePath("/products");
    revalidatePath("/dashboard");

    return { success: true, message: "Product created successfully" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to create product. Please try again." };
  }
}

export async function updateProduct(
  productId: string,
  data: UpdateProductRequest
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const { name, sku, categoryId, unitId, cost, reorderPoint } = parsed.data;

  try {
    const existing = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!existing || !existing.isActive) {
      return { success: false, error: "Product not found or has been deactivated." };
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { isActive: true },
    });
    if (!category?.isActive) {
      return { success: false, error: { categoryId: ["Selected category is not active or does not exist"] } };
    }

    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      select: { isActive: true },
    });
    if (!unit?.isActive) {
      return { success: false, error: { unitId: ["Selected unit is not active or does not exist"] } };
    }

    const existingName = await prisma.product.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        isActive: true,
        id: { not: productId },
      },
      select: { id: true },
    });
    if (existingName) {
      return { success: false, error: { name: ["A product with this name already exists"] } };
    }

    if (sku) {
      const existingSku = await prisma.product.findUnique({ where: { sku }, select: { id: true } });
      if (existingSku && existingSku.id !== productId) {
        return { success: false, error: { sku: ["A product with this SKU already exists"] } };
      }
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        sku: sku || null,
        categoryId,
        unitId,
        cost: new Prisma.Decimal(cost),
        reorderPoint: new Prisma.Decimal(reorderPoint),
      },
    });

    revalidatePath("/products");
    revalidatePath(`/products/${productId}`);
    revalidatePath("/dashboard");

    return { success: true, message: "Product updated successfully" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to update product. Please try again." };
  }
}

export async function toggleProductStatus(productId: string) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId
    },
    select: {
      id: true,
      isActive: true
    }
  })
  if (!product) {
    return { success: true, error: "Product not found" }
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      isActive: !product.isActive
    },
    select: {
      id: true,
      isActive: true
    }
  })

  if (!updatedProduct) {
    return { success: false, error: "Failed to toggle product status" }
  }

  revalidatePath("/products")
  revalidatePath("/dashboard")
  return { success: true, message: "Product status toggled successfully" }
}