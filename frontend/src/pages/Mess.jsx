import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { UtensilsCrossed, BarChart3, TrendingUp, ListChecks, CalendarDays, MessageSquareHeart } from "lucide-react";
import Layout from "../components/Layout";
import { Card, Pill, EmptyState, usePageLoading, Skeleton, inputCls } from "../components/Bits";
import { WasteBarChart, TrendChart } from "../components/Charts";
import EntryForm from "../components/EntryForm";
import ReportsPanel from "../components/ReportsPanel";
import {
  getMessSeries,
  getMessWeeks,
  getMessItems,
  mealsForDate,
  MEAL_LABELS,
  MEAL_COLORS,
  todayStr,
  getReports,
  avgRating,
} from "../services/api";
import { getUser } from "../services/auth";

export default function Mess() {
  const user = getUser();
  const isIncharge = user?.role === "mess";

  const [mode, setMode] = useState("day");
  const [meal, setMeal] = useState("all");
  const [date, setDate] = useState(todayStr());
  const [refresh, setRefresh] = useState(0);
  const loading = usePageLoading();

  const mealsToday = mealsForDate(date);
  const barData = useMemo(
    () => (mode === "day" ? getMessSeries(7, meal) : getMessWeeks(6, meal)),
    [mode, meal, refresh]
  );
  const trend = useMemo(() => getMessSeries(30, meal), [meal, refresh]);
  const messReports = useMemo(() => getReports({ targetType: "mess" }), [refresh]);
  const todayTotal = useMemo(() => getMessSeries(1, "all")[0]?.kg ?? 0, [refresh]);
  const weekTotal = useMemo(() => getMessSeries(7, "all").reduce((s, x) => s + x.kg, 0), [refresh]);

  const breakdownMeals = meal === "all" ? mealsToday : [meal];

  return (
    <Layout>
      <div className="rise flex items-center gap-4">
        <span className="rounded-3xl bg-[#E85D04] p-4 shadow-[0_12px_28px_-10px_rgba(232,93,4,0.6)]">
          <UtensilsCrossed size={30} strokeWidth={2.5} className="text-white" />
        </span>
        <div>
          <h1 className="font-heading text-3xl font-black tracking-tight sm:text-4xl">Campus Mess</h1>
          <p className="text-sm text-[#5C4F4A]">
            Breakfast, lunch & dinner — tracked after every service. Sundays run on brunch + dinner.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      ) : (
        <>
          {isIncharge && (
            <div className="rise mt-8" style={{ animationDelay: "60ms" }}>
              <EntryForm scope="mess" onSaved={() => setRefresh((r) => r + 1)} />
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Wasted today", value: `${todayTotal} kg`, color: "#E85D04" },
              { label: "Last 7 days", value: `${Math.round(weekTotal * 10) / 10} kg`, color: "#9C6644" },
              { label: "Student rating", value: messReports.length ? `${avgRating(messReports)} / 5` : "—", color: "#D62828" },
            ].map((s, i) => (
              <Card key={s.label} className="rise" style={{ animationDelay: `${i * 60}ms` }} data-testid={`mess-stat-${i}`}>
                <p className="text-xs font-bold uppercase tracking-widest text-[#B9A594]">{s.label}</p>
                <p className="mt-1 font-heading text-3xl font-black" style={{ color: s.color }}>
                  {s.value}
                </p>
              </Card>
            ))}
          </div>

          <Card className="rise mt-6" style={{ animationDelay: "120ms" }}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BarChart3 size={20} strokeWidth={2.5} className="text-[#E85D04]" />
                <h2 className="font-heading text-lg font-black">Waste totals</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex gap-1.5 rounded-full bg-[#FDEEDC] p-1">
                  {["all", ...mealsToday].map((m) => (
                    <button
                      key={m}
                      data-testid={`meal-filter-${m}`}
                      onClick={() => setMeal(m)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors duration-200 ${
                        meal === m ? "text-white" : "text-[#5C4F4A] hover:bg-white/70"
                      }`}
                      style={meal === m ? { background: MEAL_COLORS[m] } : undefined}
                    >
                      {m === "all" ? "All meals" : MEAL_LABELS[m]}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1.5 rounded-full bg-[#FDEEDC] p-1">
                  {[
                    { k: "day", label: "By day" },
                    { k: "week", label: "By week" },
                  ].map((t) => (
                    <button
                      key={t.k}
                      data-testid={`mode-${t.k}`}
                      onClick={() => setMode(t.k)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors duration-200 ${
                        mode === t.k ? "bg-[#E85D04] text-white" : "text-[#5C4F4A] hover:bg-white/70"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <WasteBarChart data={barData} color="#E85D04" />
          </Card>

          <Card className="rise mt-6" style={{ animationDelay: "180ms" }}>
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp size={20} strokeWidth={2.5} className="text-[#D62828]" />
              <h2 className="font-heading text-lg font-black">30-day trend</h2>
              {meal !== "all" && <Pill color={MEAL_COLORS[meal]}>{MEAL_LABELS[meal]}</Pill>}
            </div>
            <TrendChart data={trend} lines={[{ key: "kg", name: "Waste", color: "#E85D04" }]} />
          </Card>

          <Card className="rise mt-6" style={{ animationDelay: "240ms" }}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ListChecks size={20} strokeWidth={2.5} className="text-[#E85D04]" />
                <h2 className="font-heading text-lg font-black">Item-wise breakdown</h2>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays size={16} strokeWidth={2.5} className="text-[#B9A594]" />
                <input
                  type="date"
                  data-testid="mess-breakdown-date"
                  value={date}
                  max={todayStr()}
                  onChange={(e) => setDate(e.target.value)}
                  className={`${inputCls} w-auto py-1.5`}
                />
              </div>
            </div>
            <div className="space-y-5">
              {breakdownMeals.map((m) => {
                const items = getMessItems(date, m);
                return (
                  <div key={m}>
                    <Pill color={MEAL_COLORS[m]} className="mb-2.5">
                      {MEAL_LABELS[m]}
                    </Pill>
                    {items.length === 0 ? (
                      <p className="text-sm italic text-[#B9A594]">Nothing logged for {MEAL_LABELS[m].toLowerCase()} on this date.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2.5" data-testid={`breakdown-${m}`}>
                        {items.map((x, i) => (
                          <Pill key={`${x.item}-${i}`} color={MEAL_COLORS[m]}>
                            {x.item} · {x.kg} kg
                          </Pill>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {isIncharge && (
            <div className="rise mt-10" style={{ animationDelay: "300ms" }}>
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-2xl bg-[#FDEEDC] p-3">
                  <MessageSquareHeart size={22} strokeWidth={2.5} className="text-[#D62828]" />
                </span>
                <div>
                  <h2 className="font-heading text-xl font-black">Student reports & ratings</h2>
                  <p className="text-xs text-[#5C4F4A]">Anonymous feedback about mess meals — only you and the admin can see this.</p>
                </div>
              </div>
              <ReportsPanel reports={messReports} showTarget={false} />
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
