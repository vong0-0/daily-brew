"use client";

import { useForm, type SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FieldError, FieldLabel, InputField, SelectField } from "@/components/shared/form-fields";
import { applyActionErrorsToForm, applyZodIssuesToForm } from "@/lib/utils/form-errors";
import { createProduct, updateProduct } from "@/actions/product";
import {
  productSchema,
  type CreateProductRequest,
  type UpdateProductRequest,
} from "@/lib/validations/product.schema";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CategoryOption = { id: string; name: string };
export type UnitOption = { id: string; name: string };

type CreateMode = {
  mode: "create";
  defaultValues?: Partial<CreateProductRequest>;
  onSuccess?: () => void;
};

type UpdateMode = {
  mode: "update";
  productId: string;
  defaultValues: UpdateProductRequest;
  onSuccess?: () => void;
};

type ProductFormProps = {
  categories: CategoryOption[];
  units: UnitOption[];
} & (CreateMode | UpdateMode);

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProductForm({ categories, units, ...modeProps }: ProductFormProps) {
  const isUpdate = modeProps.mode === "update";

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProductRequest>({
    defaultValues: isUpdate
      ? modeProps.defaultValues
      : {
        name: "",
        sku: "",
        categoryId: "",
        unitId: "",
        cost: 0,
        reorderPoint: 0,
        ...modeProps.defaultValues,
      },
  });

  const onSubmit: SubmitHandler<UpdateProductRequest> = async (values) => {
    clearErrors();

    // Manual safeParse (zodResolver not compatible with Zod v4)
    const parsed = productSchema.safeParse(values);
    if (!parsed.success) {
      applyZodIssuesToForm(parsed.error.issues, setError);
      return;
    }

    const result = isUpdate
      ? await updateProduct(modeProps.productId, parsed.data)
      : await createProduct(parsed.data);

    if (!result.success) {
      applyActionErrorsToForm(result.error, setError);
      return;
    }

    modeProps.onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      {/* Root-level error */}
      {errors.root?.message && (
        <div className="rounded-sm border border-status-warning/40 bg-status-warning/10 px-3 py-2 text-xs text-text-primary">
          {errors.root.message}
        </div>
      )}

      {/* ── Row 1: Name & SKU ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="name">Product Name</FieldLabel>
          <InputField
            id="name"
            type="text"
            hasError={Boolean(errors.name)}
            placeholder="e.g. Fresh Milk"
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="sku" optional>
            SKU / Code
          </FieldLabel>
          <InputField
            id="sku"
            type="text"
            hasError={Boolean(errors.sku)}
            placeholder="e.g. MILK-001"
            {...register("sku")}
          />
          <FieldError message={errors.sku?.message} />
        </div>
      </div>

      {/* ── Row 2: Category & Unit ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="categoryId">Category</FieldLabel>
          <SelectField
            id="categoryId"
            hasError={Boolean(errors.categoryId)}
            {...register("categoryId")}
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </SelectField>
          <FieldError message={errors.categoryId?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="unitId">Measurement Unit</FieldLabel>
          <SelectField
            id="unitId"
            hasError={Boolean(errors.unitId)}
            {...register("unitId")}
          >
            <option value="" disabled>
              Select unit
            </option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </SelectField>
          <FieldError message={errors.unitId?.message} />
        </div>
      </div>

      {/* ── Row 3: Cost & Reorder Point ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="cost">Unit Cost</FieldLabel>
          <InputField
            id="cost"
            type="number"
            step="0.01"
            min="0"
            hasError={Boolean(errors.cost)}
            placeholder="0.00"
            {...register("cost")}
          />
          <FieldError message={errors.cost?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="reorderPoint">Reorder Point</FieldLabel>
          <InputField
            id="reorderPoint"
            type="number"
            step="0.01"
            min="0"
            hasError={Boolean(errors.reorderPoint)}
            placeholder="0.00"
            {...register("reorderPoint")}
          />
          <FieldError message={errors.reorderPoint?.message} />
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button type="submit" className="py-1 px-2" disabled={isSubmitting}>
          {isSubmitting
            ? isUpdate ? "Saving..." : "Adding..."
            : isUpdate ? "Save Changes" : "Add Product"}
        </Button>
      </div>
    </form>
  );
}
