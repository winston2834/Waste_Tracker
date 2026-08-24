import { useState } from "react";
import { Link } from "react-router-dom";
import { UtensilsCrossed, Store, CheckCircle2, Send } from "lucide-react";
import Layout from "../components/Layout";
import { Card, Pill, inputCls } from "../components/Bits";
import StarRating from "../components/StarRating";
import { SHOPS, MEAL_LABELS, mealsForDate, todayStr, addReport } from "../services/api";
import { toast } from "sonner";

export default function Report() {
  const [targetType, setTargetType] = useState("mess");
  const [shopId, setShopId] = useState(SHOPS[0].id);
  const [meal, setMeal] = useState(mealsForDate(todayStr())[0]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);

  const messMeals = mealsForDate(todayStr());

  const submit = (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Pick a star rating first — 1 to 5.");
      return;
    }
    addReport({
      targetType,
      targetId: targetType === "mess" ? "mess" : shopId,
      meal: targetType === "mess" ? meal : null,
      rating,
      comment,
    });
    setDone(true);
  };

  if (done) {
    return (
      <Layout>
        <div className="rise mx-auto mt-10 max-w-md">
          <Card className="flex flex-col items-center gap-4 py-12 text-center">
            <span className="rounded-full bg-[#E4F4F2] p-5">
              <CheckCircle2 size={44} strokeWidth={2.5} className="text-[#2A9D8F]" />
            </span>
            <h1 className="font-heading text-2xl font-black" data-testid="feedback-confirmation">
              Thanks for your feedback!
            </h1>
            <p className="max-w-xs text-sm text-[#5C4F4A]">
              Your anonymous rating goes straight to the people who plan tomorrow's menu.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <button
                data-testid="rate-another-btn"
                onClick={() => {
                  setDone(false);
                  setRating(0);
                  setComment("");
                }}
                className="rounded-full bg-[#E85D04] px-6 py-2.5 font-heading text-sm font-black text-white transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                Rate something else
              </button>
              <Link
                to="/"
                data-testid="back-home-btn"
                className="rounded-full bg-[#FDEEDC] px-6 py-2.5 font-heading text-sm font-black text-[#9C6644] transition-colors duration-200 hover:bg-[#F9E3C6]"
              >
                Back home
              </Link>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-xl">
        <div className="rise text-center">
          <Pill color="#D62828" className="mx-auto" data-testid="report-badge">
            100% anonymous · no login needed
          </Pill>
          <h1 className="mt-4 font-heading text-3xl font-black tracking-tight sm:text-4xl">Report / Rate Food</h1>
          <p className="mt-2 text-sm text-[#5C4F4A] sm:text-base">
            Tasted something great — or something that belonged in the bin? Say it here.
          </p>
        </div>

        <Card className="rise mt-8" style={{ animationDelay: "100ms" }}>
          <form onSubmit={submit} className="space-y-6">
            <div>
              <p className="mb-2.5 text-sm font-bold text-[#2D231F]">What are you rating?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  data-testid="target-mess"
                  onClick={() => setTargetType("mess")}
                  className={`flex items-center justify-center gap-2 rounded-2xl border-2 py-3.5 font-heading text-sm font-black transition-colors duration-200 ${
                    targetType === "mess"
                      ? "border-[#E85D04] bg-[#FFF1E6] text-[#E85D04]"
                      : "border-[#FDEEDC] text-[#5C4F4A] hover:border-[#F4A261]"
                  }`}
                >
                  <UtensilsCrossed size={17} strokeWidth={2.5} /> Mess
                </button>
                <button
                  type="button"
                  data-testid="target-shop"
                  onClick={() => setTargetType("shop")}
                  className={`flex items-center justify-center gap-2 rounded-2xl border-2 py-3.5 font-heading text-sm font-black transition-colors duration-200 ${
                    targetType === "shop"
                      ? "border-[#2A9D8F] bg-[#E4F4F2] text-[#2A9D8F]"
                      : "border-[#FDEEDC] text-[#5C4F4A] hover:border-[#F4A261]"
                  }`}
                >
                  <Store size={17} strokeWidth={2.5} /> Cafeteria shop
                </button>
              </div>
            </div>

            {targetType === "shop" && (
              <div>
                <label className="mb-2 block text-sm font-bold text-[#2D231F]">Which shop?</label>
                <select
                  data-testid="shop-select"
                  value={shopId}
                  onChange={(e) => setShopId(e.target.value)}
                  className={inputCls}
                >
                  {SHOPS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {targetType === "mess" && (
              <div>
                <p className="mb-2.5 text-sm font-bold text-[#2D231F]">Which meal?</p>
                <div className="flex flex-wrap gap-2">
                  {messMeals.map((m) => (
                    <button
                      key={m}
                      type="button"
                      data-testid={`report-meal-${m}`}
                      onClick={() => setMeal(m)}
                      className={`rounded-full px-5 py-2 text-sm font-bold transition-colors duration-200 ${
                        meal === m ? "bg-[#E85D04] text-white" : "bg-[#FDEEDC] text-[#5C4F4A] hover:bg-[#F9E3C6]"
                      }`}
                    >
                      {MEAL_LABELS[m]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2.5 text-sm font-bold text-[#2D231F]">Food quality</p>
              <StarRating value={rating} onChange={setRating} size={36} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#2D231F]">
                Anything to add? <span className="font-semibold text-[#B9A594]">(optional)</span>
              </label>
              <textarea
                data-testid="comment-input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                maxLength={280}
                placeholder="e.g. The dal was great but the rotis were cold…"
                className={`${inputCls} resize-none`}
              />
            </div>

            <button
              type="submit"
              data-testid="feedback-submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#D62828] py-3.5 font-heading text-base font-black text-white shadow-[0_12px_28px_-8px_rgba(214,40,40,0.5)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <Send size={17} strokeWidth={2.5} /> Submit anonymously
            </button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
