import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ShieldCheck, Scale, Store, MessageSquareHeart, ArrowRight, Lock, X, UtensilsCrossed } from "lucide-react";
import Layout from "../components/Layout";
import { Card, Pill, EmptyState, usePageLoading, Skeleton, inputCls, ShopIconBadge } from "../components/Bits";
import { WasteBarChart, TrendChart } from "../components/Charts";
import StarRating from "../components/StarRating";
import {
  SHOPS,
  getOutletTotals,
  getCampusTrend,
  todayTotals,
  getReports,
  targetName,
  MEAL_LABELS,
} from "../services/api";
import { getUser } from "../services/auth";

export default function Admin() {
  const user = getUser();
  const loading = usePageLoading();
  const [target, setTarget] = useState("all");
  const [date, setDate] = useState("");

  const totals = todayTotals();
  const outletTotals = useMemo(() => getOutletTotals(7), []);
  const trend = useMemo(() => getCampusTrend(14), []);
  const reports = useMemo(() => {
    const filter = { date: date || undefined };
    if (target === "mess") filter.targetType = "mess";
    else if (target !== "all") {
      filter.targetType = "shop";
      filter.targetId = target;
    }
    return getReports(filter);
  }, [target, date]);

  if (user?.role !== "admin") {
    return (
      <Layout>
        <div className="rise mx-auto mt-10 max-w-md">
          <Card className="flex flex-col items-center gap-4 py-12 text-center">
            <span className="rounded-full bg-[#FDEEDC] p-5">
              <Lock size={36} strokeWidth={2.5} className="text-[#E85D04]" />
            </span>
            <h1 className="font-heading text-2xl font-black" data-testid="admin-locked">
              Admins only past this point
            </h1>
            <p className="max-w-xs text-sm text-[#5C4F4A]">Log in with the campus admin account to see the full picture.</p>
            <Link
              to="/login/admin"
              data-testid="admin-login-link"
              className="rounded-full bg-[#2D231F] px-6 py-2.5 font-heading text-sm font-black text-[#FFFDF7] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Go to admin login
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  const statCards = [
    { icon: Scale, color: "#E85D04", label: "Campus waste today", value: `${totals.total} kg` },
    { icon: UtensilsCrossed, color: "#9C6644", label: "Mess today", value: `${totals.mess} kg` },
    { icon: Store, color: "#2A9D8F", label: "All shops today", value: `${totals.shopsTotal} kg` },
    { icon: MessageSquareHeart, color: "#D62828", label: "Student reports", value: `${getReports().length}` },
  ];

  return (
    <Layout>
      <div className="rise flex items-center gap-4">
        <span className="rounded-3xl bg-[#2D231F] p-4">
          <ShieldCheck size={30} strokeWidth={2.5} className="text-[#F4A261]" />
        </span>
        <div>
          <h1 className="font-heading text-3xl font-black tracking-tight sm:text-4xl">Admin overview</h1>
          <p className="text-sm text-[#5C4F4A]">Every outlet, every meal, every report — one screen.</p>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((s, i) => (
              <Card key={s.label} className="rise flex items-center gap-4" style={{ animationDelay: `${i * 60}ms` }} data-testid={`admin-stat-${i}`}>
                <span className="rounded-2xl p-3" style={{ background: s.color + "22" }}>
                  <s.icon size={22} strokeWidth={2.5} style={{ color: s.color }} />
                </span>
                <div>
                  <p className="font-heading text-2xl font-black">{s.value}</p>
                  <p className="text-xs font-semibold text-[#5C4F4A]">{s.label}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card className="rise" style={{ animationDelay: "120ms" }}>
              <h2 className="mb-4 font-heading text-lg font-black">Last 7 days · by outlet</h2>
              <WasteBarChart data={outletTotals.map((o) => ({ label: o.name, kg: o.kg, ...o }))} perBarColors />
            </Card>
            <Card className="rise" style={{ animationDelay: "180ms" }}>
              <h2 className="mb-4 font-heading text-lg font-black">14-day trend · mess vs cafeterias</h2>
              <TrendChart
                data={trend}
                lines={[
                  { key: "mess", name: "Mess", color: "#E85D04" },
                  { key: "cafeterias", name: "Cafeterias", color: "#2A9D8F" },
                ]}
              />
            </Card>
          </div>

          <Card className="rise mt-6" style={{ animationDelay: "240ms" }}>
            <h2 className="mb-4 font-heading text-lg font-black">Drill into an outlet</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                to="/mess"
                data-testid="drill-mess"
                className="flex items-center justify-between gap-2 rounded-2xl bg-[#FFF1E6] px-4 py-3 font-heading text-sm font-black text-[#E85D04] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2">
                  <UtensilsCrossed size={16} strokeWidth={2.5} /> Mess
                </span>
                <ArrowRight size={15} strokeWidth={3} />
              </Link>
              {SHOPS.map((s) => (
                <Link
                  key={s.id}
                  to={`/cafeteria/${s.id}`}
                  data-testid={`drill-${s.id}`}
                  className="flex items-center justify-between gap-2 rounded-2xl px-4 py-3 font-heading text-sm font-black transition-transform duration-200 hover:-translate-y-0.5"
                  style={{ background: s.color + "14", color: s.color }}
                >
                  <span className="flex items-center gap-2">
                    <ShopIconBadge shop={s} size={28} /> {s.short}
                  </span>
                  <ArrowRight size={15} strokeWidth={3} />
                </Link>
              ))}
            </div>
          </Card>

          <div className="rise mt-10" style={{ animationDelay: "300ms" }}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-heading text-xl font-black">All student reports & ratings</h2>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  data-testid="report-filter-target"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className={`${inputCls} w-auto py-1.5`}
                >
                  <option value="all">All outlets</option>
                  <option value="mess">Mess</option>
                  {SHOPS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  data-testid="report-filter-date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`${inputCls} w-auto py-1.5`}
                />
                {date && (
                  <button
                    data-testid="report-filter-clear"
                    onClick={() => setDate("")}
                    className="rounded-full bg-[#FDEEDC] p-2 text-[#9C6644] transition-colors duration-200 hover:bg-[#F9E3C6]"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                )}
              </div>
            </div>

            {reports.length === 0 ? (
              <EmptyState
                icon={MessageSquareHeart}
                title="No reports match these filters"
                subtitle="Try a different outlet or clear the date."
              />
            ) : (
              <Card className="overflow-x-auto p-0" data-testid="reports-table">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#FDEEDC] text-xs uppercase tracking-widest text-[#B9A594]">
                      <th className="px-6 py-4">When</th>
                      <th className="px-4 py-4">Outlet</th>
                      <th className="px-4 py-4">Meal</th>
                      <th className="px-4 py-4">Rating</th>
                      <th className="px-6 py-4">Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r.id} data-testid={`report-row-${r.id}`} className="border-b border-[#FDF4E7] last:border-0 hover:bg-[#FFFBF2]">
                        <td className="whitespace-nowrap px-6 py-3.5 font-semibold text-[#5C4F4A]">
                          {format(new Date(r.ts), "d MMM, h:mm a")}
                        </td>
                        <td className="px-4 py-3.5">
                          <Pill color={r.targetType === "mess" ? "#E85D04" : SHOPS.find((s) => s.id === r.targetId)?.color || "#F4A261"}>
                            {targetName(r)}
                          </Pill>
                        </td>
                        <td className="px-4 py-3.5 text-[#5C4F4A]">{r.meal ? MEAL_LABELS[r.meal] : "—"}</td>
                        <td className="px-4 py-3.5">
                          <StarRating value={r.rating} readOnly size={15} />
                        </td>
                        <td className="max-w-xs px-6 py-3.5 text-[#5C4F4A]">{r.comment || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
