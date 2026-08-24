import { Link } from "react-router-dom";
import { ArrowRight, KeyRound, Store } from "lucide-react";
import Layout from "../components/Layout";
import { Card, Pill, PageHeader, ShopIconBadge, usePageLoading, Skeleton } from "../components/Bits";
import { SHOPS, getShopTodayTotal } from "../services/api";

export default function Cafeteria() {
  const loading = usePageLoading();
  return (
    <Layout>
      <PageHeader
        badge={<Pill color="#2A9D8F" data-testid="cafeteria-badge"><Store size={14} strokeWidth={3} /> Cafeteria Shops</Pill>}
        title="Pick a shop, see its footprint"
        subtitle="Each shop logs its own leftovers daily. Tap a card to open its live dashboard."
      />

      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SHOPS.map((s, i) => (
            <Card
              key={s.id}
              data-testid={`shop-card-${s.id}`}
              className="rise group flex flex-col transition-transform duration-200 hover:-translate-y-1.5"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <ShopIconBadge shop={s} />
                <Pill color={s.color} data-testid={`shop-today-${s.id}`}>
                  Today: {getShopTodayTotal(s.id)} kg
                </Pill>
              </div>
              <h2 className="mt-4 font-heading text-xl font-black">{s.name}</h2>
              <p className="mt-1 flex-1 text-sm text-[#5C4F4A]">{s.tagline}</p>
              <div className="mt-5 flex items-center gap-2">
                <Link
                  to={`/cafeteria/${s.id}`}
                  data-testid={`shop-open-${s.id}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 font-heading text-sm font-black text-white transition-transform duration-200 group-hover:-translate-y-0.5"
                  style={{ background: s.color }}
                >
                  Dashboard <ArrowRight size={15} strokeWidth={3} />
                </Link>
                <Link
                  to={`/login/shop/${s.id}`}
                  data-testid={`shop-login-${s.id}`}
                  title="Owner login"
                  className="rounded-full border-2 border-[#FDEEDC] p-2.5 text-[#9C6644] transition-colors duration-200 hover:border-[#E85D04] hover:text-[#E85D04]"
                >
                  <KeyRound size={16} strokeWidth={2.5} />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}
