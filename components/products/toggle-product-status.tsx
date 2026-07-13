"use client"

import { Ban, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { toggleProductStatus } from "@/actions/product";
import { useTransition } from "react";
import { toast } from "sonner"


export default function ToggleProductStatus({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      try {
        await toggleProductStatus(productId)
        toast.success("Product status toggled successfully", {
          action: {
            label: "Undo",
            onClick: () => {
              toggleProductStatus(productId)
            }
          }
        })
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error("Failed to toggle product status")
        }
      }
    })
  }
  return (
    <Button
      variant="outline"
      size="icon-xs"
      className="border-border hover:bg-bg-surface-hover hover:text-text-primary"
      onClick={handleToggle}
    >
      {isPending ? (
        <Loader className="size-3 animate-spin" />
      ) : (
        <Ban className="size-3" />
      )}
    </Button>
  )
}