import Image from "next/image";

/**
 * Image abstraction. Pass a `src` (local /public path or whitelisted remote)
 * and it renders an optimised, dark-treated photo; otherwise it renders the
 * `fallback` visual so the layout never depends on a missing asset.
 */
export function MediaImage({
  src,
  alt,
  fallback,
  priority = false,
  sizes = "100vw",
  className,
}: {
  src: string | null;
  alt: string;
  fallback: React.ReactNode;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  if (!src) return <>{fallback}</>;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className ?? "object-cover"}
    />
  );
}
