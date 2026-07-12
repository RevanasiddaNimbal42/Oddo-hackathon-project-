import { useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar,
} from 'recharts';
import { Truck, DollarSign, Users } from 'lucide-react';
import { Layout, PageHeader } from '../components/layout/Layout';
import { ChartCard } from '../components/ui/ChartCard';
import { KPICard } from '../components/ui/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useData } from '../contexts/DataContext';
import { monthlyTrends } from '../data/seed';
import { formatCurrency, formatNumber } from '../utils';

const PIE_COLORS = ['rgb(var(--color-primary))', 'rgb(var(--color-success))', 'rgb(var(--color-warning))', 'rgb(var(--color-danger))'];

export function AnalyticsPage() {
  const { vehicles, drivers, trips, expenses, fuelLogs, maintenance } = useData();

  const stats = useMemo(() => {
    const totalRevenue = trips.filter((t) => t.status === 'Completed').reduce((s, t) => s + t.estimatedRevenue, 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const totalFuelCost = fuelLogs.reduce((s, f) => s + f.totalCost, 0);
    const totalMaintenanceCost = maintenance.filter((m) => m.actualCost).reduce((s, m) => s + (m.actualCost ?? 0), 0);
    const activeVehicles = vehicles.filter((v) => v.status === 'On Trip').length;
    const utilization = Math.round((activeVehicles / vehicles.filter((v) => v.status !== 'Retired').length) * 100);
    const avgSafety = Math.round(drivers.reduce((s, d) => s + d.safetyScore, 0) / drivers.length);
    return { totalRevenue, totalExpenses, totalFuelCost, totalMaintenanceCost, utilization, avgSafety };
  }, [vehicles, drivers, trips, expenses, fuelLogs, maintenance]);

  const vehicleTypeData = useMemo(() => {
    const types = ['Truck', 'Van', 'Bus', 'Refrigerated', 'Flatbed', 'Tanker', 'Box'];
    return types.map((t) => ({ type: t, count: vehicles.filter((v) => v.type === t).length })).filter((d) => d.count > 0);
  }, [vehicles]);

  const driverStatusData = useMemo(() => [
    { name: 'Available', value: drivers.filter((d) => d.status === 'Available').length },
    { name: 'On Trip', value: drivers.filter((d) => d.status === 'On Trip').length },
    { name: 'Off Duty', value: drivers.filter((d) => d.status === 'Off Duty').length },
    { name: 'Suspended', value: drivers.filter((d) => d.status === 'Suspended').length },
  ], [drivers]);

  const utilizationRadial = [{ name: 'Utilization', value: stats.utilization, fill: 'rgb(var(--color-primary))' }];

  const profitTrend = monthlyTrends.map((m) => ({ month: m.month, profit: m.revenue - m.expenses }));

  return (
    <Layout breadcrumb={[{ label: 'Analytics' }]}>
      <PageHeader title="Analytics" description="Deep insights into your fleet performance" />

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} tone="success" trend={{ value: '14%', up: true }} delay={0} />
        <KPICard label="Total Expenses" value={formatCurrency(stats.totalExpenses)} icon={DollarSign} tone="danger" trend={{ value: '6%', up: false }} delay={0.05} />
        <KPICard label="Fleet Utilization" value={`${stats.utilization}%`} icon={Truck} tone="primary" trend={{ value: '5%', up: true }} delay={0.1} />
        <KPICard label="Avg Safety Score" value={String(stats.avgSafety)} icon={Users} tone="info" delay={0.15} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <ChartCard title="Profit Trend" description="Revenue minus expenses over 12 months" delay={0.2} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={profitTrend}>
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(var(--color-success))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="rgb(var(--color-success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Area type="monotone" dataKey="profit" stroke="rgb(var(--color-success))" strokeWidth={2.5} fill="url(#profitGrad)" name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fleet Utilization" description="Current utilization rate" delay={0.25}>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" barSize={20} data={utilizationRadial} startAngle={90} endAngle={90 - (stats.utilization * 3.6)}>
              <RadialBar background dataKey="value" cornerRadius={10} />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-fg" style={{ fontSize: 28, fontWeight: 700 }}>
                {stats.utilization}%
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Vehicle Types" description="Distribution across the fleet" delay={0.3}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={vehicleTypeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="type" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="count" fill="rgb(var(--color-primary))" radius={[6, 6, 0, 0]} name="Vehicles" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Driver Status" description="Current driver availability" delay={0.35}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={driverStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {driverStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Fuel Cost Trend" description="Monthly fuel expenditure" delay={0.4} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Line type="monotone" dataKey="fuelCost" stroke="rgb(var(--color-warning))" strokeWidth={2.5} dot={{ fill: 'rgb(var(--color-warning))', r: 4 }} name="Fuel Cost" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Maintenance Cost" description="Monthly maintenance spend" delay={0.45}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Bar dataKey="maintenanceCost" fill="rgb(var(--color-info))" radius={[6, 6, 0, 0]} name="Maintenance" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader><CardTitle>Trip Statistics</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Total Trips', value: formatNumber(trips.length) },
              { label: 'Completed', value: formatNumber(trips.filter((t) => t.status === 'Completed').length) },
              { label: 'Active', value: formatNumber(trips.filter((t) => t.status === 'Dispatched').length) },
              { label: 'Draft', value: formatNumber(trips.filter((t) => t.status === 'Draft').length) },
              { label: 'Cancelled', value: formatNumber(trips.filter((t) => t.status === 'Cancelled').length) },
              { label: 'Total Distance', value: `${formatNumber(trips.reduce((s, t) => s + t.distanceKm, 0))} km` },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-sm text-muted">{s.label}</span>
                <span className="text-sm font-semibold text-fg">{s.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Cost Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Fuel', value: stats.totalFuelCost, color: 'bg-warning' },
              { label: 'Maintenance', value: stats.totalMaintenanceCost, color: 'bg-info' },
              { label: 'Other Expenses', value: stats.totalExpenses - stats.totalFuelCost - stats.totalMaintenanceCost, color: 'bg-danger' },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-muted">{s.label}</span>
                  <span className="text-sm font-semibold text-fg">{formatCurrency(s.value)}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${(s.value / stats.totalExpenses) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Fleet Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Total Vehicles', value: formatNumber(vehicles.length) },
              { label: 'Available', value: formatNumber(vehicles.filter((v) => v.status === 'Available').length) },
              { label: 'On Trip', value: formatNumber(vehicles.filter((v) => v.status === 'On Trip').length) },
              { label: 'In Shop', value: formatNumber(vehicles.filter((v) => v.status === 'In Shop').length) },
              { label: 'Retired', value: formatNumber(vehicles.filter((v) => v.status === 'Retired').length) },
              { label: 'Total Drivers', value: formatNumber(drivers.length) },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-sm text-muted">{s.label}</span>
                <span className="text-sm font-semibold text-fg">{s.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
