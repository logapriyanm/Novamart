"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/client/components/ui/Loader";

export default function InventoryRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/seller/products");
  }, [router]);

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader />
    </div>
  );
}
