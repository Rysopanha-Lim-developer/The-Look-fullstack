import React from "react";

/**
 * Skeleton loading state for a product detail page
 * (image + labeled spec list + action buttons).
 */

const shimmer =
  "relative overflow-hidden bg-neutral-200 before:absolute before:inset-0 " +
  "before:-translate-x-full before:animate-[shimmer_1.6s_infinite] " +
  "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

function Block({ className = "" }: { className?: string }) {
  return <div className={`${shimmer} rounded-md ${className}`} />;
}

function FieldSkeleton({
  labelWidth,
  valueWidth,
}: {
  labelWidth: string;
  valueWidth: string;
}) {
  return (
    <div className="space-y-2">
      <Block className={`h-6 ${labelWidth}`} />
      <Block className={`h-5 ${valueWidth}`} />
    </div>
  );
}

export default function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl p-8">
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[420px_1fr]">
        {/* Product image */}
        <Block className="aspect-3/4 w-full" />

        {/* Product details */}
        <div className="space-y-6">
          <FieldSkeleton labelWidth="w-20" valueWidth="w-32" />
          <FieldSkeleton labelWidth="w-16" valueWidth="w-72" />
          <FieldSkeleton labelWidth="w-16" valueWidth="w-14" />
          <FieldSkeleton labelWidth="w-36" valueWidth="w-28" />
          <FieldSkeleton labelWidth="w-24" valueWidth="w-96" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex gap-4">
        <Block className="h-12 w-36" />
        <Block className="h-12 w-40" />
      </div>
    </div>
  );
}
