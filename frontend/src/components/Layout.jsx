import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { UtensilsCrossed, Star, LogOut, UserRound } from "lucide-react";
import { getUser, logout } from "../services/auth";

const navCls = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-bold transition-colors duration-200 ${
    isActive ? "bg-[#E85D04] text-white" : "text-[#5C4F4A] hover:bg-[#FDEEDC] hover:text-[#2D231F]"
  }`;

export default function Layout({ children }) {
  const user = getUser();
  const location = useLocation();
  const navigate = useNavigate();
  const hideFab = location.pathname.startsWith("/report") || location.pathname.startsWith("/login");

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-body text-[#2D231F]">
      <div className="grain-overlay" />

      <header className="sticky top-0 z-40 border-b border-[#FDEEDC] bg-[#FFFDF7]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" data-testid="nav-logo" className="flex items-center gap-2.5">
            <span className="rounded-2xl bg-[#E85D04] p-2 shadow-[0_8px_20px_-6px_rgba(232,93,4,0.6)]">
              <UtensilsCrossed size={20} strokeWidth={2.5} className="text-white" />
            </span>
            <span className="font-heading text-xl font-black tracking-tight">
              Leftover<span className="text-[#E85D04]">Lab</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink to="/mess" data-testid="nav-mess" className={navCls}>
              Mess
            </NavLink>
            <NavLink to="/cafeteria" data-testid="nav-cafeteria" className={navCls}>
              Cafeteria
            </NavLink>
            {user?.role === "admin" && (
              <NavLink to="/admin" data-testid="nav-admin" className={navCls}>
                Admin
              </NavLink>
            )}
            {user ? (
              <button
                data-testid="logout-btn"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="ml-1 flex items-center gap-1.5 rounded-full bg-[#2D231F] px-3.5 py-2 text-xs font-bold text-[#FFFDF7] transition-transform duration-200 hover:-translate-y-0.5 sm:text-sm"
              >
                <LogOut size={14} strokeWidth={2.5} />
                <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
              </button>
            ) : (
              <span className="ml-1 hidden items-center gap-1.5 rounded-full bg-[#FDEEDC] px-3.5 py-2 text-xs font-bold text-[#9C6644] md:flex">
                <UserRound size={14} strokeWidth={2.5} /> Guest
              </span>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6">{children}</main>

      {!hideFab && (
        <Link
          to="/report"
          data-testid="report-food-fab"
          className="floaty fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#D62828] px-5 py-3.5 font-heading text-sm font-black text-white shadow-[0_16px_36px_-10px_rgba(214,40,40,0.55)] transition-transform duration-200 hover:-translate-y-1 hover:scale-105 active:scale-95"
        >
          <Star size={18} strokeWidth={2.5} className="fill-white" />
          Report / Rate Food
        </Link>
      )}

      <footer className="bg-[#2D231F] text-[#FFFDF7]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3 sm:px-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="rounded-2xl bg-[#E85D04] p-2">
                <UtensilsCrossed size={18} strokeWidth={2.5} className="text-white" />
              </span>
              <span className="font-heading text-lg font-black">LeftoverLab</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-[#CBB8A8]">
              Track it. Cut it. Save it. A student-driven push to shrink food waste on campus.
            </p>
          </div>
          <div>
            <p className="font-heading text-sm font-black uppercase tracking-widest text-[#F4A261]">Staff logins</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link data-testid="footer-login-mess" to="/login/mess" className="w-fit text-[#CBB8A8] transition-colors duration-200 hover:text-white">
                Mess Incharge
              </Link>
              <Link data-testid="footer-login-cafeteria" to="/cafeteria" className="w-fit text-[#CBB8A8] transition-colors duration-200 hover:text-white">
                Cafeteria Owners
              </Link>
              <Link data-testid="footer-login-admin" to="/login/admin" className="w-fit text-[#CBB8A8] transition-colors duration-200 hover:text-white">
                Admin
              </Link>
            </div>
          </div>
          <div>
            <p className="font-heading text-sm font-black uppercase tracking-widest text-[#F4A261]">Students</p>
            <p className="mt-3 max-w-xs text-sm text-[#CBB8A8]">
              No login needed. Hit the red button, rate your meal, and help the kitchen do better tomorrow.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-[#8F7B6C]">
          Made for a greener campus · LeftoverLab {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
