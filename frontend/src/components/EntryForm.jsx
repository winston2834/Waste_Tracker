import { useState } from "react";
import { Plus, X, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { addWasteEntry, mealsForDate, MEAL_LABELS, MEAL_COLORS, todayStr } from "../services/api";
import { Card, inputCls } from "./Bits";

export default function EntryForm({ scope, shopId, onSaved }) {
  const [date, setDate] = useState(todayStr());
  const meals = scope === "mess" ? mealsForDate(date) : null;
  const [meal, setMeal] = useState(meals ? meals[0] : null);
  const [rows, setRows] = useState([{ item: "", kg: "" }]);

  const activeMeal = meals && !meals.includes(meal) ? meals[0] : meal;

  const setRow = (i, field, val) => {
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)));
  };

  const submit = (e) => {
    e.preventDefault();
    const ok = addWasteEntry({ scope, shopId, date, meal: activeMeal, items: rows });
    if (!ok) {
      toast.error("Add at least one item with a quantity in kg.");
      return;
    }
    toast.success("Waste logged — every gram counts!");
    setRows([{ item: "", kg: "" }]);
    onSaved?.();
  };

  return (
    <Card data-testid="waste-entry-form" className="border-2 border-[#FDEEDC]">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-[#FDEEDC] p-3">
          <ClipboardList size={22} strokeWidth={2.5} className="text-[#E85D04]" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-black text-[#2D231F]">Log today's waste</h2>
          <p className="text-xs text-[#5C4F4A]">Fill this in right after service ends.</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#5C4F4A]">Date</label>
            <input
              type="date"
              data-testid="waste-date-input"
              value={date}
              max={todayStr()}
              onChange={(e) => setDate(e.target.value)}
              className={`${inputCls} w-auto`}
            />
          </div>
          {meals && (
            <div>
              <label className="mb-1 block text-xs font-bold text-[#5C4F4A]">Meal</label>
              <div className="flex gap-2">
                {meals.map((m) => (
                  <button
                    key={m}
                    type="button"
                    data-testid={`entry-meal-${m}`}
                    onClick={() => setMeal(m)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition-colors duration-200 ${
                      activeMeal === m ? "text-white" : "bg-[#FDEEDC] text-[#5C4F4A] hover:bg-[#F9E3C6]"
                    }`}
                    style={activeMeal === m ? { background: MEAL_COLORS[m] } : undefined}
                  >
                    {MEAL_LABELS[m]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                data-testid={`item-name-${i}`}
                value={r.item}
                onChange={(e) => setRow(i, "item", e.target.value)}
                placeholder={scope === "mess" ? "e.g. Rice" : "e.g. Samosa"}
                className={inputCls}
              />
              <div className="relative w-28 shrink-0">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  data-testid={`item-kg-${i}`}
                  value={r.kg}
                  onChange={(e) => setRow(i, "kg", e.target.value)}
                  placeholder="0.0"
                  className={`${inputCls} pr-9`}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#B9A594]">
                  kg
                </span>
              </div>
              {rows.length > 1 && (
                <button
                  type="button"
                  data-testid={`remove-item-${i}`}
                  onClick={() => setRows((rs) => rs.filter((_, idx) => idx !== i))}
                  className="rounded-full p-2 text-[#B9A594] transition-colors duration-200 hover:bg-[#FDEEDC] hover:text-[#D62828]"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          data-testid="add-item-btn"
          onClick={() => setRows((rs) => [...rs, { item: "", kg: "" }])}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#F0DFC8] py-2.5 text-sm font-bold text-[#E85D04] transition-colors duration-200 hover:border-[#E85D04] hover:bg-[#FFF6EA]"
        >
          <Plus size={16} strokeWidth={3} /> Add another item
        </button>

        <button
          type="submit"
          data-testid="submit-waste-btn"
          className="w-full rounded-full bg-[#E85D04] py-3 font-heading text-base font-black text-white shadow-[0_10px_24px_-8px_rgba(232,93,4,0.5)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#DC2F02] active:scale-95"
        >
          Submit waste log
        </button>
      </form>
    </Card>
  );
}
