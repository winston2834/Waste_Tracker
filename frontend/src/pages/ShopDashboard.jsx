import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { KeyRound, CalendarDays, BarChart3, TrendingUp, ListChecks } from "lucide-react";
import Layout from "../components/Layout";
import { Card, Pill, EmptyState, ShopIconBadge, usePageLoading, Skeleton, inputCls } from "../components/Bits";
import { WasteBarChart, TrendChart } from "../components/Charts";
import EntryForm from "../components/EntryForm";
import { getShop, getShopSeries, getShopItems, getShopTodayTotal, todayStr } from "../services/api";
import { getUser } from "../services/auth";

export default function ShopDashboard() {
  const { shopId } = useParams();
  const shop = getShop(shopId);
  const user = getUser();
  const isOwner = user?.role === "shop" && user?.shopId === shopId;

  const [days, setDays] = useState(7);
  const [date, setDate] = useState(todayStr());
  const [refresh, setRefresh] = useState(0);
  const loading = usePageLoading();

  const series = useMemo(() => getShopSeries(shopId, days), [shopId, days, refresh]);
  const trend = useMemo(() => getShopSeries(shopId, 30), [shopId, refresh]);
  const items = useMemo(() => getShopItems(shopId, date), [shopId, date, refresh]);
  const itemsTotal = items.reduce((s, x) => s + x.kg, 0);
  const weekTotal = series.slice(-7).reduce((s, x) => s + x.kg, 0);

  if (!shop) {
    return (
      <Layout>
        <EmptyState title="Shop not found" subtitle="That shop doesn't exist on campus." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="rise flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <ShopIconBadge shop={shop} size={64} />
          <div>
            <h1 className="font-heading text-3xl font-black tracking-tight sm:text-4xl">{shop.name}</h1>
            <p className="text-sm text-[#5C4F4A]">{shop.tagline}</p>
          </div>
        </div>
        {!isOwner && (
          <Link
            to={`/login/shop/${shop.id}`}
            data-testid="owner-login-btn"
            className="flex items-center gap-2 rounded-full bg-[#2D231F] px-5 py-2.5 font-heading text-sm font-black text-[#FFFDF7] transition-transform duration-200 hover:-translate-y-0.5"
          >
            <KeyRound size={15} strokeWidth={2.5} /> Owner login
          </Link>
        )}
      </div>

      {loading ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      ) : (
        <>
          {isOwner && (
            <div className="rise mt-8" style={{ animationDelay: "60ms" }}>
              <EntryForm scope="shop" shopId={shop.id} onSaved={() => setRefresh((r) => r + 1)} />
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Wasted today", value: `${getShopTodayTotal(shop.id)} kg`, color: shop.color },
              { label: "Last 7 days", value: `${Math.round(weekTotal * 10) / 10} kg`, color: "#E85D04" },
              { label: "Daily average", value: `${Math.round((weekTotal / 7) * 10) / 10} kg`, color: "#D62828" },
            ].map((s, i) => (
              <Card key={s.label} className="rise" style={{ animationDelay: `${i * 60}ms` }} data-testid={`shop-stat-${i}`}>
                <p className="text-xs font-bold uppercase tracking-widest text-[#B9A594]">{s.label}</p>
                <p className="mt-1 font-heading text-3xl font-black" style={{ color: s.color }}>
                  {s.value}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card className="rise" style={{ animationDelay: "120ms" }}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BarChart3 size={20} strokeWidth={2.5} style={{ color: shop.color }} />
                  <h2 className="font-heading text-lg font-black">Daily waste</h2>
                </div>
                <div className="flex gap-2">
                  {[7, 30].map((d) => (
                    <button
                      key={d}
                      data-testid={`range-${d}`}
                      onClick={() => setDays(d)}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors duration-200 ${
                        days === d ? "text-white" : "bg-[#FDEEDC] text-[#5C4F4A] hover:bg-[#F9E3C6]"
                      }`}
                      style={days === d ? { background: shop.color } : undefined}
                    >
                      {d} days
                    </button>
                  ))}
                </div>
              </div>
              <WasteBarChart data={series} color={shop.color} />
            </Card>

            <Card className="rise" style={{ animationDelay: "180ms" }}>
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp size={20} strokeWidth={2.5} className="text-[#E85D04]" />
                <h2 className="font-heading text-lg font-black">30-day trend</h2>
              </div>
              <TrendChart data={trend} lines={[{ key: "kg", name: "Waste", color: shop.color }]} />
            </Card>
          </div>

          <Card className="rise mt-6" style={{ animationDelay: "240ms" }}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ListChecks size={20} strokeWidth={2.5} style={{ color: shop.color }} />
                <h2 className="font-heading text-lg font-black">What got wasted</h2>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays size={16} strokeWidth={2.5} className="text-[#B9A594]" />
                <input
                  type="date"
                  data-testid="breakdown-date"
                  value={date}
                  max={todayStr()}
                  onChange={(e) => setDate(e.target.value)}
                  className={`${inputCls} w-auto py-1.5`}
                />
              </div>
            </div>
            {items.length === 0 ? (
              <EmptyState title="No waste data logged for this date yet" subtitle="Either it was a zero-waste day (nice!) or the owner hasn't logged it." />
            ) : (
              <>
                <div className="flex flex-wrap gap-2.5" data-testid="item-breakdown">
                  {items.map((x, i) => (
                    <Pill key={`${x.item}-${i}`} color={shop.color}>
                      {x.item} · {x.kg} kg
                    </Pill>
                  ))}
                </div>
                <p className="mt-4 text-sm font-bold text-[#5C4F4A]">
                  Total on {format(parseISO(date), "d MMM")}:{" "}
                  <span className="font-heading font-black" style={{ color: shop.color }}>
                    {Math.round(itemsTotal * 10) / 10} kg
                  </span>
                </p>
              </>
            )}
          </Card>
        </>
      )}
    </Layout>
  );
}
