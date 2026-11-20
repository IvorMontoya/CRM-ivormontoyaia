import Image from "next/image";
import { cn } from "@/lib/utils";

// Logo con fondo transparente (PNG RGBA). Se escala por altura y mantiene su proporción.
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-im.webp"
      alt="iM.es"
      width={768}
      height={513}
      priority
      className={cn("h-8 w-auto", className)}
    />
  );
}
