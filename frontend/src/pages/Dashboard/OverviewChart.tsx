import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { name: "1월", total: Math.floor(Math.random() * 50) + 10 },
  { name: "2월", total: Math.floor(Math.random() * 50) + 10 },
  { name: "3월", total: Math.floor(Math.random() * 50) + 10 },
  { name: "4월", total: Math.floor(Math.random() * 50) + 10 },
  { name: "5월", total: Math.floor(Math.random() * 50) + 10 },
  { name: "6월", total: Math.floor(Math.random() * 50) + 10 },
  { name: "7월", total: Math.floor(Math.random() * 50) + 10 },
  { name: "8월", total: Math.floor(Math.random() * 50) + 10 },
  { name: "9월", total: Math.floor(Math.random() * 50) + 10 },
  { name: "10월", total: Math.floor(Math.random() * 50) + 10 },
  { name: "11월", total: Math.floor(Math.random() * 50) + 10 },
  { name: "12월", total: Math.floor(Math.random() * 50) + 10 },
];

export function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}명`}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Bar
          dataKey="total"
          fill="#2563eb"
          radius={[4, 4, 0, 0]}
          barSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
