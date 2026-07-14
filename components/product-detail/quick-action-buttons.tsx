import { Button } from "../ui/button";
import Link from "next/link";

export function QuickActionButtons({ productId }: { productId: string }) {
  return (
    <div className="w-full flex justify-center flex-wrap gap-2 items-center">
      <Button className="flex-1 bg-blue-800 px-4 py-2 text-whtie" asChild>
        <Link href={`/stock-in?productId=${productId}`}>Stock In</Link>
      </Button>
      <Button className="flex-1 bg-red-800 px-4 py-2 text-whtie" asChild>
        <Link href={`/stock-out?productId=${productId}`}>Stock Out</Link>
      </Button>
    </div>
  );
}
