'use client';

import Image from 'next/image';
import { useState } from 'react';
import { UserPersonalInfo } from '@/Backend/lib/Types/generalTypes.module';
import { Product } from '@/Backend/models/product.model';

/* ---------------------------------- Types --------------------------------- */

export interface OrderReceiptProps {
  logoSrc?: string;
  logoAlt?: string;
  cartData: Product[];
  cookiesData: {username: string, email:string};
  userPersonalInfo: UserPersonalInfo;
  currency?: string; // e.g. "$", "USD", "៛"
}

/* ------------------------------- Main component ---------------------------- */

export default function OrderReceipt({
  logoSrc = '/assets/Logo/logo.svg',
  logoAlt = 'Store logo',
  cartData,
  cookiesData,
  userPersonalInfo,
  currency = '$',
}: OrderReceiptProps) {
  const [items, setItems] = useState<Required<Product>[]>(
    cartData.map((item) => ({ ...item, quantity: item.quantity ?? 1 }))
  );

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-10 bg-white p-8 text-neutral-900">
      {/* Section 1 — Logo */}
      <section className="flex justify-center">
        <Image src={logoSrc} alt={logoAlt} width={140} height={48} />
      </section>

      {/* Section 2 — Customer info */}
      <section className="flex flex-col gap-3 border-b border-neutral-200 pb-8">
        <h2 className="text-sm font-medium text-neutral-500">Delivery details</h2>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
          <InfoRow label="Username" value={cookiesData.username} />
          <InfoRow
            label="Full name"
            value={`${userPersonalInfo.firstname} ${userPersonalInfo.lastname}`}
          />
          <InfoRow label="Email" value={cookiesData.email} />
          <InfoRow label="Phone" value={userPersonalInfo.telephone} />
          <InfoRow label="City / Province" value={userPersonalInfo.cityNprovince} />
          <InfoRow label="District" value={userPersonalInfo.district} />
          <InfoRow label="Commune" value={userPersonalInfo.commune} />
          <InfoRow label="Street" value={userPersonalInfo.street} />
        </dl>
      </section>

      {/* Section 3 — Products */}
      <section className="flex flex-col gap-5 border-b border-neutral-200 pb-8">
        <h2 className="text-sm font-medium text-neutral-500">Order items</h2>
        <ul className="flex flex-col gap-5">
          {items.map((item) => (
            <li key={item.slug} className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
                <span className="text-sm text-neutral-500">
                  {item.color}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="w-20 text-right font-mono tabular-nums">
                  {currency}
                  {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Section 4 — Total */}
      <section className="flex items-baseline justify-between">
        <span className="text-base font-medium">Total</span>
        <span className="font-mono text-xl font-semibold tabular-nums">
          {currency}
          {total.toFixed(2)}
        </span>
      </section>
    </div>
  );
}

/* ------------------------------ Sub-components ----------------------------- */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-neutral-900">{value}</dd>
    </>
  );
}
