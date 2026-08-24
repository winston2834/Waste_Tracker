import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { UtensilsCrossed, Store, ShieldCheck, Info } from "lucide-react";
import Layout from "../components/Layout";
import { Card, Pill, EmptyState, inputCls } from "../components/Bits";
import { login } from "../services/auth";
import { getShop } from "../services/api";

const ROLE_META = {
  mess: { icon: UtensilsCrossed, color: "#E85D04", title: "Mess Incharge", hint: "mess@leftoverlab.edu · mess123" },
  admin: { icon: ShieldCheck, color: "#2D231F", title: "Admin", hint: "admin@leftoverlab.edu · admin123" },
};

export default function Login() {
  const { role, shopId } = useParams();
  const navigate = useNavigate();
  const shop = role === "shop" ? getShop(shopId) : null;
  const meta = role === "shop" && shop
    ? { icon: Store, color: shop.color, title: `${shop.name} Owner`, hint: `${shop.id}@leftoverlab.edu · shop123` }
    : ROLE_META[role];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!meta) {
    return (
      <Layout>
        <EmptyState title="Unknown login" subtitle="Use the staff login links in the footer." />
      </Layout>
    );
  }

  const Icon = meta.icon;

  const submit = (e) => {
    e.preventDefault();
    const user = login(email, password, role, shopId);
    if (!user) {
      setError("That email and password don't match. Try the demo credentials below.");
      return;
    }
    navigate(role === "admin" ? "/admin" : role === "mess" ? "/mess" : `/cafeteria/${shopId}`);
  };

  return (
    <Layout>
      <div className="rise mx-auto mt-8 max-w-md">
        <Card className="py-8">
          <div className="flex flex-col items-center text-center">
            <span className="rounded-3xl p-4" style={{ background: meta.color + "1f" }}>
              <Icon size={30} strokeWidth={2.5} style={{ color: meta.color }} />
            </span>
            <h1 className="mt-4 font-heading text-2xl font-black" data-testid="login-title">
              {meta.title} login
            </h1>
            <p className="mt-1 text-sm text-[#5C4F4A]">Staff accounts are assigned by the admin — no public signup.</p>
          </div>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5C4F4A]">Email</label>
              <input
                type="email"
                data-testid="email-input"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@leftoverlab.edu"
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5C4F4A]">Password</label>
              <input
                type="password"
                data-testid="password-input"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                className={inputCls}
                required
              />
            </div>

            {error && (
              <p data-testid="login-error" className="rounded-2xl bg-[#FDE8E8] px-4 py-2.5 text-sm font-semibold text-[#D62828]">
                {error}
              </p>
            )}

            <button
              type="submit"
              data-testid="login-submit-btn"
              className="w-full rounded-full py-3 font-heading text-base font-black text-white transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
              style={{ background: meta.color, boxShadow: `0 12px 26px -10px ${meta.color}aa` }}
            >
              Log in
            </button>
          </form>

          <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-[#FFF6EA] px-4 py-3">
            <Info size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#F4A261]" />
            <p className="text-xs leading-relaxed text-[#9C6644]">
              Demo credentials — <span className="font-bold">{meta.hint}</span>
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-[#B9A594]">
            Student? You don't need an account —{" "}
            <Link to="/report" data-testid="login-to-report-link" className="font-bold text-[#D62828] hover:underline">
              rate your food anonymously
            </Link>
            .
          </p>
        </Card>
      </div>
    </Layout>
  );
}
