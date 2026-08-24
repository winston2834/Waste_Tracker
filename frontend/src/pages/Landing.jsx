import { Link } from "react-router-dom";
import { ArrowRight, UtensilsCrossed, Store, Scale, TrendingDown, MessageSquareHeart } from "lucide-react";
import Layout from "../components/Layout";
import { Card, Pill, usePageLoading, Skeleton } from "../components/Bits";
import { todayTotals, getReports } from "../services/api";

const MESS_IMG =
  "https://images.unsplash.com/photo-1775748265132-a5575dea2994?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZGluaW5nJTIwaGFsbCUyMGZvb2R8ZW58MHx8fHwxNzg3NjAyMDgwfDA&ixlib=rb-4.1.0&q=85";
const CAFE_IMG =
  "https://images.unsplash.com/photo-1709380146558-bbc94b0f05f8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHwxfHxjYWZldGVyaWElMjBmb29kJTIwY291bnRlcnxlbnwwfHx8fDE3ODc2MDIwODB8MA&ixlib=rb-4.1.0&q=85";

export default function Landing() {
  const loading = usePageLoading();
  const totals = todayTotals();
  const reportCount = getReports().length;

  return (
    <Layout>
      <section className="rise pb-12 pt-6 text-center">
        <Pill color="#2A9D8F" className="mx-auto" data-testid="hero-badge">
          <TrendingDown size={14} strokeWidth={3} /> Campus Food Waste Tracker
        </Pill>
        <h1 className="mx-auto mt-5 max-w-2xl font-heading text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Track it. <span className="text-[#E85D04]">Cut it.</span> Save it.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-[#5C4F4A] sm:text-lg">
          LeftoverLab measures what gets thrown away in the mess and every cafeteria shop — so together we waste less,
          one plate at a time.
        </p>
      </section>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      ) : (
        <>
          <section className="grid gap-6 sm:grid-cols-2">
            <Link
              to="/mess"
              data-testid="landing-mess-card"
              className="group rise overflow-hidden rounded-3xl border border-[#FDEEDC] bg-white shadow-[0_18px_50px_-18px_rgba(232,93,4,0.35)] transition-transform duration-200 hover:-translate-y-1.5"
              style={{ animationDelay: "80ms" }}
            >
              <div className="relative h-44 overflow-hidden">
                <img src={MESS_IMG} alt="College dining hall" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-[#E85D04] px-4 py-1.5 font-heading text-xs font-black text-white">
                  DINING HALL
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 p-6">
                <div>
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed size={22} strokeWidth={2.5} className="text-[#E85D04]" />
                    <h2 className="font-heading text-2xl font-black">Mess</h2>
                  </div>
                  <p className="mt-1 text-sm text-[#5C4F4A]">Breakfast, lunch & dinner waste, meal by meal.</p>
                  <Pill color="#E85D04" className="mt-3" data-testid="mess-today-pill">
                    Today: {totals.mess} kg wasted
                  </Pill>
                </div>
                <span className="rounded-full bg-[#FDEEDC] p-3 transition-colors duration-200 group-hover:bg-[#E85D04] group-hover:text-white">
                  <ArrowRight size={20} strokeWidth={2.5} />
                </span>
              </div>
            </Link>

            <Link
              to="/cafeteria"
              data-testid="landing-cafeteria-card"
              className="group rise overflow-hidden rounded-3xl border border-[#FDEEDC] bg-white shadow-[0_18px_50px_-18px_rgba(232,93,4,0.35)] transition-transform duration-200 hover:-translate-y-1.5"
              style={{ animationDelay: "160ms" }}
            >
              <div className="relative h-44 overflow-hidden">
                <img src={CAFE_IMG} alt="Cafeteria counter" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-[#2A9D8F] px-4 py-1.5 font-heading text-xs font-black text-white">
                  6 SHOPS
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 p-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Store size={22} strokeWidth={2.5} className="text-[#2A9D8F]" />
                    <h2 className="font-heading text-2xl font-black">Cafeteria</h2>
                  </div>
                  <p className="mt-1 text-sm text-[#5C4F4A]">Amul, Zaiqa, Nescafe, Hungrys, Juice Corner & Snacks Point.</p>
                  <Pill color="#2A9D8F" className="mt-3" data-testid="cafeteria-today-pill">
                    Today: {totals.shopsTotal} kg wasted
                  </Pill>
                </div>
                <span className="rounded-full bg-[#E3F2F0] p-3 transition-colors duration-200 group-hover:bg-[#2A9D8F] group-hover:text-white">
                  <ArrowRight size={20} strokeWidth={2.5} />
                </span>
              </div>
            </Link>
          </section>

          <section className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Scale, color: "#E85D04", label: "Total waste today", value: `${totals.total} kg` },
              { icon: Store, color: "#2A9D8F", label: "Outlets tracked", value: "6 shops + mess" },
              { icon: MessageSquareHeart, color: "#D62828", label: "Student reports", value: `${reportCount} so far` },
            ].map((s, i) => (
              <Card key={s.label} className="rise flex items-center gap-4" style={{ animationDelay: `${220 + i * 60}ms` }} data-testid={`stat-${i}`}>
                <span className="rounded-2xl p-3" style={{ background: s.color + "22" }}>
                  <s.icon size={24} strokeWidth={2.5} style={{ color: s.color }} />
                </span>
                <div>
                  <p className="font-heading text-xl font-black">{s.value}</p>
                  <p className="text-xs font-semibold text-[#5C4F4A]">{s.label}</p>
                </div>
              </Card>
            ))}
          </section>
        </>
      )}
    </Layout>
  );
}
