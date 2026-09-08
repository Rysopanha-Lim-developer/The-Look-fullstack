export default function OrderReceiptSkeleton({ itemCount = 3 }: { itemCount?: number }) {
  return (
    <div className="mx-auto flex w-full max-w-xl animate-pulse flex-col gap-10 bg-white p-8">
      {/* Section 1 — Logo */}
      <section className="flex justify-center">
        <div className="h-12 w-36 rounded bg-neutral-200" />
      </section>

      {/* Section 2 — Customer info */}
      <section className="flex flex-col gap-3 border-b border-neutral-200 pb-8">
        <div className="h-3 w-28 rounded bg-neutral-200" />
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonInfoRow key={i} />
          ))}
        </div>
      </section>

      {/* Section 3 — Products */}
      <section className="flex flex-col gap-5 border-b border-neutral-200 pb-8">
        <div className="h-3 w-24 rounded bg-neutral-200" />
        <ul className="flex flex-col gap-5">
          {Array.from({ length: itemCount }).map((_, i) => (
            <li key={i} className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="h-4 w-32 rounded bg-neutral-200" />
                <div className="h-3 w-20 rounded bg-neutral-200" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-7 w-20 rounded bg-neutral-200" />
                <div className="h-4 w-14 rounded bg-neutral-200" />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Section 4 — Total */}
      <section className="flex items-baseline justify-between">
        <div className="h-4 w-14 rounded bg-neutral-200" />
        <div className="h-6 w-20 rounded bg-neutral-200" />
      </section>
    </div>
  );
}

function SkeletonInfoRow() {
  return (
    <>
      <div className="h-3 w-20 rounded bg-neutral-200" />
      <div className="h-3 w-32 rounded bg-neutral-200" />
    </>
  );
}
