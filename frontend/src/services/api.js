// Mock data layer for LeftoverLab.
// Every read/write goes through these functions, so swapping in a real
// backend later means changing this file only.

import { format, subDays, parseISO, startOfISOWeek } from "date-fns";

const STORAGE_KEY = "leftoverlab_data_v1";

export const SHOPS = [
  { id: "amul", name: "Amul Shop", short: "Amul", icon: "Milk", color: "#2A9D8F", tagline: "Dairy, ice cream & cold treats" },
  { id: "zaiqa", name: "Campus Zaiqa", short: "Zaiqa", icon: "UtensilsCrossed", color: "#E85D04", tagline: "Thalis, biryani & desi meals" },
  { id: "nescafe", name: "Nescafe", short: "Nescafe", icon: "Coffee", color: "#9C6644", tagline: "Coffee, maggi & quick bites" },
  { id: "hungrys", name: "Hungrys", short: "Hungrys", icon: "Sandwich", color: "#D62828", tagline: "Burgers, fries & fast food" },
  { id: "juice", name: "Friend's Juice Corner", short: "Juice Corner", icon: "CupSoda", color: "#E9C46A", tagline: "Fresh juices & shakes" },
  { id: "snacks", name: "Snacks Point", short: "Snacks", icon: "Cookie", color: "#F4A261", tagline: "Bakery & evening snacks" },
];

const SHOP_ITEMS = {
  amul: ["Milk Packets", "Ice Cream Tubs", "Butter", "Lassi", "Paneer"],
  zaiqa: ["Veg Thali", "Biryani", "Chapati", "Chicken Curry", "Jeera Rice"],
  nescafe: ["Cold Coffee", "Hot Coffee", "Maggi", "Cookies", "Grilled Sandwich"],
  hungrys: ["Veg Burger", "French Fries", "Pizza Slice", "Momos", "Pasta"],
  juice: ["Orange Juice", "Banana Shake", "Watermelon Juice", "Fruit Salad", "Mosambi Juice"],
  snacks: ["Samosa", "Veg Patties", "Pastry", "Chips Packets", "Pakora"],
};

const MESS_ITEMS = {
  breakfast: ["Poha", "Upma", "Aloo Paratha", "Bread & Butter", "Tea"],
  lunch: ["Steamed Rice", "Roti", "Dal Fry", "Mix Sabzi", "Salad", "Curd"],
  dinner: ["Steamed Rice", "Roti", "Dal Tadka", "Paneer Sabzi", "Kheer"],
  brunch: ["Chole Bhature", "Poha", "Jalebi", "Lassi", "Sandwich"],
};

const REPORT_COMMENTS = [
  "Dal was watery again today.",
  "Loved the paneer sabzi, please make it more often!",
  "Rotis were cold by 8:30 pm.",
  "Cold coffee was way too sweet.",
  "Samosa was stale, tasted like yesterday's batch.",
  "Great lunch today, salad was fresh.",
  "Juice tasted diluted. Not worth the price.",
  "Biryani portion was smaller than usual.",
  "Kheer on Wednesday was the highlight of my week.",
  "Maggi was undercooked and bland.",
  "Breakfast poha was genuinely good today.",
  "Too much oil in the sabzi lately.",
];

const hashStr = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const rng = (seed) => {
  let a = hashStr(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const kg = (x) => Math.round(x * 10) / 10;

export const todayStr = () => format(new Date(), "yyyy-MM-dd");

export const MEAL_LABELS = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  brunch: "Brunch",
};

export const MEAL_COLORS = {
  all: "#D62828",
  breakfast: "#E9C46A",
  lunch: "#E85D04",
  dinner: "#9C6644",
  brunch: "#2A9D8F",
};

export function mealsForDate(dateStr) {
  const day = parseISO(dateStr).getDay();
  return day === 0 ? ["brunch", "dinner"] : ["breakfast", "lunch", "dinner"];
}

export function getShop(id) {
  return SHOPS.find((s) => s.id === id);
}

function seedReports() {
  const reports = [];
  const targets = [{ type: "mess", id: "mess" }, ...SHOPS.map((s) => ({ type: "shop", id: s.id }))];
  for (let i = 0; i < 18; i++) {
    const r = rng(`report-${i}`);
    const t = targets[Math.floor(r() * targets.length)];
    const d = subDays(new Date(), Math.floor(r() * 10));
    d.setHours(8 + Math.floor(r() * 12), Math.floor(r() * 60));
    const meals = t.type === "mess" ? mealsForDate(format(d, "yyyy-MM-dd")) : [null];
    reports.push({
      id: `r-seed-${i}`,
      targetType: t.type,
      targetId: t.id,
      meal: t.type === "mess" ? meals[Math.floor(r() * meals.length)] : null,
      rating: 2 + Math.floor(r() * 4),
      comment: r() > 0.35 ? REPORT_COMMENTS[Math.floor(r() * REPORT_COMMENTS.length)] : "",
      ts: d.toISOString(),
    });
  }
  return reports.sort((a, b) => b.ts.localeCompare(a.ts));
}

function seedData() {
  const waste = { mess: {}, shops: {} };
  SHOPS.forEach((s) => {
    waste.shops[s.id] = {};
  });
  for (let i = 29; i >= 0; i--) {
    const d = format(subDays(new Date(), i), "yyyy-MM-dd");
    waste.mess[d] = {};
    mealsForDate(d).forEach((m) => {
      const r = rng(`mess-${d}-${m}`);
      waste.mess[d][m] = MESS_ITEMS[m]
        .filter(() => r() > 0.25)
        .map((item) => ({ item, kg: kg(0.5 + r() * 5.5) }));
    });
    SHOPS.forEach((s) => {
      const r = rng(`shop-${s.id}-${d}`);
      waste.shops[s.id][d] = SHOP_ITEMS[s.id]
        .filter(() => r() > 0.45)
        .map((item) => ({ item, kg: kg(0.3 + r() * 4) }));
    });
  }
  return { waste, reports: seedReports() };
}

let cache = null;

export function loadData() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      cache = JSON.parse(raw);
      return cache;
    }
  } catch (e) {
    // fall through to reseed
  }
  cache = seedData();
  save();
  return cache;
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (e) {
    // storage full/blocked — session data still works via cache
  }
}

const sumItems = (items) => kg((items || []).reduce((s, x) => s + x.kg, 0));

// ---------- Shops ----------

export function getShopSeries(shopId, days = 7) {
  const data = loadData();
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = format(subDays(new Date(), i), "yyyy-MM-dd");
    out.push({
      date: d,
      label: format(parseISO(d), "EEE d"),
      kg: sumItems(data.waste.shops[shopId]?.[d]),
    });
  }
  return out;
}

export function getShopItems(shopId, date) {
  return loadData().waste.shops[shopId]?.[date] || [];
}

export function getShopTodayTotal(shopId) {
  return sumItems(getShopItems(shopId, todayStr()));
}

// ---------- Mess ----------

export function getMessSeries(days = 7, meal = "all") {
  const data = loadData();
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = format(subDays(new Date(), i), "yyyy-MM-dd");
    const byMeal = data.waste.mess[d] || {};
    let total = 0;
    Object.entries(byMeal).forEach(([m, items]) => {
      if (meal === "all" || m === meal) total += items.reduce((s, x) => s + x.kg, 0);
    });
    out.push({ date: d, label: format(parseISO(d), "EEE d"), kg: kg(total) });
  }
  return out;
}

export function getMessWeeks(weeks = 6, meal = "all") {
  const data = loadData();
  const map = {};
  Object.entries(data.waste.mess).forEach(([d, byMeal]) => {
    const wk = format(startOfISOWeek(parseISO(d)), "yyyy-MM-dd");
    let total = 0;
    Object.entries(byMeal).forEach(([m, items]) => {
      if (meal === "all" || m === meal) total += items.reduce((s, x) => s + x.kg, 0);
    });
    map[wk] = (map[wk] || 0) + total;
  });
  return Object.entries(map)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-weeks)
    .map(([wk, total]) => ({ date: wk, label: "Wk " + format(parseISO(wk), "d MMM"), kg: kg(total) }));
}

export function getMessItems(date, meal) {
  return loadData().waste.mess[date]?.[meal] || [];
}

// ---------- Writes ----------

export function addWasteEntry({ scope, shopId, date, meal, items }) {
  const data = loadData();
  const clean = items
    .filter((i) => i.item.trim() && Number(i.kg) > 0)
    .map((i) => ({ item: i.item.trim(), kg: kg(Number(i.kg)) }));
  if (!clean.length) return false;
  if (scope === "mess") {
    if (!data.waste.mess[date]) data.waste.mess[date] = {};
    data.waste.mess[date][meal] = [...(data.waste.mess[date][meal] || []), ...clean];
  } else {
    if (!data.waste.shops[shopId]) data.waste.shops[shopId] = {};
    data.waste.shops[shopId][date] = [...(data.waste.shops[shopId][date] || []), ...clean];
  }
  save();
  return true;
}

// ---------- Reports ----------

export function getReports({ targetType, targetId, date } = {}) {
  let reps = [...loadData().reports];
  if (targetType && targetType !== "all") reps = reps.filter((r) => r.targetType === targetType);
  if (targetId && targetId !== "all") reps = reps.filter((r) => r.targetId === targetId);
  if (date) reps = reps.filter((r) => r.ts.slice(0, 10) === date);
  return reps.sort((a, b) => b.ts.localeCompare(a.ts));
}

export function addReport({ targetType, targetId, meal, rating, comment }) {
  const data = loadData();
  data.reports.unshift({
    id: `r-${Date.now()}`,
    targetType,
    targetId,
    meal: meal || null,
    rating,
    comment: (comment || "").trim(),
    ts: new Date().toISOString(),
  });
  save();
}

export function targetName(report) {
  if (report.targetType === "mess") return "Mess";
  return getShop(report.targetId)?.name || report.targetId;
}

export function avgRating(reps) {
  if (!reps.length) return 0;
  return Math.round((reps.reduce((s, r) => s + r.rating, 0) / reps.length) * 10) / 10;
}

// ---------- Campus-wide ----------

export function getOutletTotals(days = 7) {
  const data = loadData();
  const since = format(subDays(new Date(), days - 1), "yyyy-MM-dd");
  let messTotal = 0;
  Object.entries(data.waste.mess).forEach(([d, byMeal]) => {
    if (d >= since) Object.values(byMeal).forEach((items) => (messTotal += items.reduce((s, x) => s + x.kg, 0)));
  });
  const totals = [{ id: "mess", name: "Mess", color: "#E85D04", kg: kg(messTotal) }];
  SHOPS.forEach((s) => {
    let t = 0;
    Object.entries(data.waste.shops[s.id] || {}).forEach(([d, items]) => {
      if (d >= since) t += items.reduce((sum, x) => sum + x.kg, 0);
    });
    totals.push({ id: s.id, name: s.short, color: s.color, kg: kg(t) });
  });
  return totals;
}

export function getCampusTrend(days = 14) {
  const data = loadData();
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = format(subDays(new Date(), i), "yyyy-MM-dd");
    const mess = Object.values(data.waste.mess[d] || {}).flat().reduce((s, x) => s + x.kg, 0);
    let shops = 0;
    SHOPS.forEach((s) => (data.waste.shops[s.id]?.[d] || []).forEach((x) => (shops += x.kg)));
    out.push({ date: d, label: format(parseISO(d), "d MMM"), mess: kg(mess), cafeterias: kg(shops), total: kg(mess + shops) });
  }
  return out;
}

export function todayTotals() {
  const data = loadData();
  const d = todayStr();
  const mess = sumItems(Object.values(data.waste.mess[d] || {}).flat());
  const perShop = SHOPS.map((s) => ({ shop: s, kg: sumItems(data.waste.shops[s.id]?.[d]) }));
  const shopsTotal = kg(perShop.reduce((s, x) => s + x.kg, 0));
  return { mess, perShop, shopsTotal, total: kg(mess + shopsTotal) };
}
