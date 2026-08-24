import { format } from "date-fns";
import { MessageSquareHeart } from "lucide-react";
import { MEAL_LABELS, targetName, getShop } from "../services/api";
import StarRating from "./StarRating";
import { Pill, EmptyState } from "./Bits";

export default function ReportsPanel({ reports, showTarget = true }) {
  if (!reports.length) {
    return (
      <EmptyState
        icon={MessageSquareHeart}
        title="No student reports yet"
        subtitle="Anonymous ratings and comments from students will show up here."
      />
    );
  }
  return (
    <div className="space-y-4" data-testid="reports-panel">
      {reports.map((r) => {
        const shop = r.targetType === "shop" ? getShop(r.targetId) : null;
        const color = r.targetType === "mess" ? "#E85D04" : shop?.color || "#F4A261";
        return (
          <div
            key={r.id}
            data-testid={`report-${r.id}`}
            className="rounded-3xl border border-[#FDEEDC] bg-white p-5 shadow-[0_10px_30px_-16px_rgba(232,93,4,0.25)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {showTarget && <Pill color={color}>{targetName(r)}</Pill>}
                {r.meal && <Pill color="#9C6644">{MEAL_LABELS[r.meal]}</Pill>}
              </div>
              <div className="flex items-center gap-3">
                <StarRating value={r.rating} readOnly size={18} />
                <span className="text-xs font-semibold text-[#B9A594]">
                  {format(new Date(r.ts), "d MMM, h:mm a")}
                </span>
              </div>
            </div>
            {r.comment && <p className="mt-3 text-sm leading-relaxed text-[#5C4F4A]">“{r.comment}”</p>}
          </div>
        );
      })}
    </div>
  );
}
