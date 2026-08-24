import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
} from "recharts";

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-[#FDEEDC] bg-white px-4 py-3 shadow-[0_10px_30px_-10px_rgba(232,93,4,0.35)]">
      <p className="font-heading text-sm font-bold text-[#2D231F]">{label}</p>
      {payload.map((p) => (
        <p key={String(p.dataKey)} className="text-sm font-semibold" style={{ color: p.color || p.fill }}>
          {p.name}: {p.value} kg
        </p>
      ))}
    </div>
  );
}

const axisTick = { fill: "#5C4F4A", fontSize: 12, fontWeight: 600 };

export function WasteBarChart({ data, color = "#E85D04", barKey = "kg", name = "Waste", perBarColors = false }) {
  const interval = data.length > 12 ? Math.floor(data.length / 8) : 0;
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#FDEEDC" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={axisTick} interval={interval} />
        <YAxis tickLine={false} axisLine={false} tick={axisTick} />
        <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(244,162,97,0.14)" }} />
        <Bar dataKey={barKey} name={name} fill={color} radius={[10, 10, 0, 0]} maxBarSize={46}>
          {perBarColors && data.map((d) => <Cell key={d.id || d.label} fill={d.color || color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendChart({ data, lines }) {
  const interval = data.length > 12 ? Math.floor(data.length / 8) : 0;
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#FDEEDC" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={axisTick} interval={interval} />
        <YAxis tickLine={false} axisLine={false} tick={axisTick} />
        <Tooltip content={<ChartTip />} />
        {lines.length > 1 && <Legend iconType="circle" wrapperStyle={{ fontSize: 13, fontWeight: 700 }} />}
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.name}
            stroke={l.color}
            strokeWidth={3}
            dot={{ r: 3, fill: l.color, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
