import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

function DashboardCharts({ stats }) {
  const chartData = [
    { name: "Applied", value: stats?.applied || 0 },
    { name: "Assessment", value: stats?.assessment || 0 },
    { name: "Interview", value: stats?.interview || 0 },
    { name: "Offer", value: stats?.offer || 0 },
    { name: "Rejected", value: stats?.rejected || 0 },
  ];

  const colors = ["#3b82f6", "#eab308", "#8b5cf6", "#22c55e", "#ef4444"];

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <h2 className="font-bold text-slate-900 mb-4">
          Applications by Status
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" outerRadius={90} label>
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border shadow-sm">
        <h2 className="font-bold text-slate-900 mb-4">
          Status Overview
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value"
              fill="#0f172a"
               radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashboardCharts;