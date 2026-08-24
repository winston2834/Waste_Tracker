import { useEffect, useState } from "react";
import { Milk, UtensilsCrossed, Coffee, Sandwich, CupSoda, Cookie, Trash2 } from "lucide-react";

export const SHOP_ICONS = { Milk, UtensilsCrossed, Coffee, Sandwich, CupSoda, Cookie };

export const inputCls =
  "w-full rounded-2xl border border-[#F0DFC8] bg-white px-4 py-2.5 text-sm text-[#2D231F] placeholder-[#B9A594] focus:outline-none focus:ring-2 focus:ring-[#E85D04] focus:border-transparent transition-shadow";

export function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`rounded-3xl border border-[#FDEEDC] bg-white p-6 shadow-[0_14px_40px_-16px_rgba(232,93,4,0.18)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Pill({ children, color = "#E85D04", className = "", ...props }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold sm:text-sm ${className}`}
      style={{ background: color + "1f", color }}
      {...props}
    >
      {children}
    </span>
  );
}

export function PageHeader({ badge, title, subtitle }) {
  return (
    <div className="rise">
      {badge}
      <h1 className="font-heading text-3xl font-black tracking-tight text-[#2D231F] sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-xl text-sm text-[#5C4F4A] sm:text-base">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({ icon: Icon = Trash2, title, subtitle }) {
  return (
    <div
      data-testid="empty-state"
      className="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-[#F0DFC8] bg-[#FFFBF2] px-6 py-12 text-center"
    >
      <div className="rounded-full bg-[#FDEEDC] p-4">
        <Icon size={28} strokeWidth={2.5} className="text-[#E85D04]" />
      </div>
      <p className="font-heading text-base font-bold text-[#2D231F]">{title}</p>
      {subtitle && <p className="max-w-xs text-sm text-[#5C4F4A]">{subtitle}</p>}
    </div>
  );
}

export function usePageLoading(ms = 350) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
}

export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-3xl bg-[#F7EBD9] ${className}`} />;
}

export function ShopIconBadge({ shop, size = 52 }) {
  const Icon = SHOP_ICONS[shop.icon] || Coffee;
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-2xl"
      style={{ background: shop.color + "22", width: size, height: size }}
    >
      <Icon size={size * 0.5} strokeWidth={2.5} style={{ color: shop.color }} />
    </div>
  );
}
