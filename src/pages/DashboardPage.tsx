import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  Truck, Route, Users, DollarSign, Fuel, Wrench, TrendingUp,
  AlertTriangle, Calendar, ArrowRight, Activity as ActivityIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout, PageHeader } from '../components/layout/Layout';
import { KPICard } from '../components/ui/KPICard';
import { ChartCard } from '../components/ui/ChartCard';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { monthlyTrends } from '../data/seed';
import { formatCurrency, formatNumber, timeAgo, daysUntil } from '../utils';

const activityIcons = {
  truck: Truck, user: Users, route: Route, wrench: Wrench, fuel: Fuel,
  dollar: DollarSign, alert: AlertTriangle, check: TrendingUp,
};

const PIE_COLORS = ['rgb(var(--color-primary))', 'rgb(var(--color-success))', 'rgb(var(--color-warning))', 'rgb(var(--color-danger))', 'rgb(var(--color-info))'];

export function DashboardPage() {
  const { vehicles, drivers, trips, expenses, fuelLogs, maintenance, activities } = useData();
  const { user } = useAuth();

  const stats = useMemo(() => {
    const activeVehicles = vehicles.filter((v) => v.status === 'On Trip').length;
    const availableVehicles = vehicles.filter((v) => v.status === 'Available').length;
    const inMaintenance = vehicles.filter((v) => v.status === 'In Shop').length;
    const activeTrips = trips.filter((t) => t.status === 'Dispatched').length;
    const pendingTrips = trips.filter((t) => t.status === 'Draft').length;
    const driversOnDuty = drivers.filter((d) => d.status === 'On Trip').length;
    const utilization = Math.round((activeVehicles / vehicles.filter((v) => v.status !== 'Retired').length) * 100);
    const monthlyExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const revenue = trips.filter((t) => t.status === 'Completed').reduce((s, t) => s + t.estimatedRevenue, 0);
    const fuelCost = fuelLogs.reduce((s, f) => s + f.totalCost, 0);
    const maintenanceCost = maintenance.filter((m) => m.actualCost).reduce((s, m) => s + (m.actualCost ?? 0), 0);
    const profit = revenue - monthlyExpenses;
    return { activeVehicles, availableVehicles, inMaintenance, activeTrips, pendingTrips, driversOnDuty, utilization, monthlyExpenses, revenue, fuelCost, maintenanceCost, profit };
  }, [vehicles, drivers, trips, expenses, fuelLogs, maintenance]);

  const vehicleStatusData = [
    { name: 'Available', value: stats.availableVehicles },
    { name: 'On Trip', value: stats.activeVehicles },
    { name: 'In Shop', value: stats.inMaintenance },
    { name: 'Retired', value: vehicles.filter((v) => v.status === 'Retired').length },
  ];

  const recentTrips = trips.slice(0, 5);
  const upcomingExpiry = drivers
    .filter((d) => daysUntil(d.licenseExpiry) <= 60)
    .sort((a, b) => daysUntil(a.licenseExpiry) - daysUntil(b.licenseExpiry))
    .slice(0, 4);

  const alerts = [
    ...drivers.filter((d) => daysUntil(d.licenseExpiry) <= 15).map((d) => ({ id: d.id, text: `${d.name}'s license expires in ${daysUntil(d.licenseExpiry)} days`, tone: 'warning' as const })),
    ...maintenance.filter((m) => m.status === 'In Progress').map((m) => ({ id: m.id, text: `${vehicles.find((v) => v.id === m.vehicleId)?.name} in maintenance`, tone: 'info' as const })),
    ...trips.filter((t) => t.status === 'Draft').map((t) => ({ id: t.id, text: `${t.code} awaiting dispatch`, tone: 'warning' as const })),
  ].slice(0, 5);

  return (
    <Layout breadcrumb={[{ label: 'Dashboard' }]}>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0]}`}
        description="Here's what's happening across your fleet today."
        actions={
          <Link to="/trips">
            <button className="h-10 px-4 rounded-xl bg-primary text-primary-fg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
              <Route size={16} /> New Trip
            </button>
          </Link>
        }
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KPICard label="Active Vehicles" value={String(stats.activeVehicles)} icon={Truck} tone="info" trend={{ value: '12%', up: true }} delay={0} />
        <KPICard label="Available" value={String(stats.availableVehicles)} icon={Truck} tone="success" delay={0.05} />
        <KPICard label="In Maintenance" value={String(stats.inMaintenance)} icon={Wrench} tone="warning" delay={0.1} />
        <KPICard label="Active Trips" value={String(stats.activeTrips)} icon={Route} tone="primary" trend={{ value: '8%', up: true }} delay={0.15} />
        <KPICard label="Drivers On Duty" value={String(stats.driversOnDuty)} icon={Users} tone="info" delay={0.2} />
        <KPICard label="Fleet Utilization" value={`${stats.utilization}%`} icon={TrendingUp} tone="success" trend={{ value: '5%', up: true }} delay={0.25}>
          <div className="mt-3 h-1.5 rounded-full bg-surface-2 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${stats.utilization}%` }} transition={{ delay: 0.4, duration: 0.6 }} className="h-full bg-success rounded-full" />
          </div>
        </KPICard>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard label="Revenue (MTD)" value={formatCurrency(stats.revenue)} icon={DollarSign} tone="success" trend={{ value: '14%', up: true }} delay={0.3} />
        <KPICard label="Monthly Expenses" value={formatCurrency(stats.monthlyExpenses)} icon={DollarSign} tone="danger" trend={{ value: '6%', up: false }} delay={0.35} />
        <KPICard label="Profit" value={formatCurrency(stats.profit)} icon={TrendingUp} tone="primary" trend={{ value: '22%', up: true }} delay={0.4} />
        <KPICard label="Fuel Cost" value={formatCurrency(stats.fuelCost)} icon={Fuel} tone="warning" delay={0.45} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <ChartCard title="Revenue vs Expenses" description="Last 12 months" delay={0.5} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyTrends}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(var(--color-primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="rgb(var(--color-primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(var(--color-danger))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="rgb(var(--color-danger))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Area type="monotone" dataKey="revenue" stroke="rgb(var(--color-primary))" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="rgb(var(--color-danger))" strokeWidth={2.5} fill="url(#expGrad)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Vehicle Status" description="Current fleet distribution" delay={0.55}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={vehicleStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {vehicleStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <ChartCard title="Fuel & Maintenance Cost" description="Monthly breakdown" delay={0.6} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyTrends} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="fuelCost" fill="rgb(var(--color-warning))" radius={[6, 6, 0, 0]} name="Fuel" />
              <Bar dataKey="maintenanceCost" fill="rgb(var(--color-info))" radius={[6, 6, 0, 0]} name="Maintenance" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Trip Volume" description="Completed vs dispatched" delay={0.65}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyTrends.map((m, i) => ({ month: m.month, trips: 30 + Math.round(Math.sin(i) * 8 + i * 1.5) }))}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="trips" stroke="rgb(var(--color-primary))" strokeWidth={2.5} dot={{ fill: 'rgb(var(--color-primary))', r: 4 }} activeDot={{ r: 6 }} name="Trips" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bottom Row: Recent Trips, Activities, Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Trips */}
        <Card className="lg:col-span-2">
          <div className="px-5 py-4 border-b border-border-soft flex items-center justify-between">
            <h3 className="text-base font-semibold text-fg">Recent Trips</h3>
            <Link to="/trips" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-border-soft">
            {recentTrips.map((trip) => {
              const vehicle = vehicles.find((v) => v.id === trip.vehicleId);
              const driver = drivers.find((d) => d.id === trip.driverId);
              return (
                <div key={trip.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-2 transition-colors">
                  <span className="h-9 w-9 rounded-xl bg-primary-soft flex items-center justify-center flex-shrink-0">
                    <Route size={16} className="text-primary" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-fg truncate">{trip.source} → {trip.destination}</p>
                    <p className="text-xs text-muted">{trip.code} · {vehicle?.name} · {driver?.name}</p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-fg">{formatCurrency(trip.estimatedRevenue)}</p>
                    <p className="text-xs text-muted">{formatNumber(trip.distanceKm)} km</p>
                  </div>
                  <StatusBadge status={trip.status} />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Today's Alerts */}
        <Card>
          <div className="px-5 py-4 border-b border-border-soft flex items-center gap-2">
            <AlertTriangle size={18} className="text-warning" />
            <h3 className="text-base font-semibold text-fg">Today's Alerts</h3>
          </div>
          <div className="divide-y divide-border-soft">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 px-5 py-3.5">
                <span className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${alert.tone === 'warning' ? 'bg-warning' : 'bg-info'}`} />
                <p className="text-sm text-muted">{alert.text}</p>
              </div>
            ))}
            {alerts.length === 0 && <p className="px-5 py-8 text-sm text-muted text-center">No alerts. All clear!</p>}
          </div>
        </Card>
      </div>

      {/* Activities & License Expiry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card>
          <div className="px-5 py-4 border-b border-border-soft flex items-center gap-2">
            <ActivityIcon size={18} className="text-primary" />
            <h3 className="text-base font-semibold text-fg">Recent Activity</h3>
          </div>
          <div className="divide-y divide-border-soft max-h-[320px] overflow-y-auto">
            {activities.slice(0, 8).map((act) => {
              const Icon = activityIcons[act.icon];
              return (
                <div key={act.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="h-8 w-8 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-muted" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-fg">{act.title}</p>
                    <p className="text-xs text-muted truncate">{act.description}</p>
                  </div>
                  <span className="text-xs text-subtle flex-shrink-0">{timeAgo(act.timestamp)}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="px-5 py-4 border-b border-border-soft flex items-center gap-2">
            <Calendar size={18} className="text-warning" />
            <h3 className="text-base font-semibold text-fg">Upcoming License Expiry</h3>
          </div>
          <div className="divide-y divide-border-soft">
            {upcomingExpiry.map((d) => {
              const days = daysUntil(d.licenseExpiry);
              const tone = days < 0 ? 'danger' : days <= 15 ? 'warning' : 'info';
              return (
                <div key={d.id} className="flex items-center gap-3 px-5 py-3.5">
                  <Avatar name={d.name} hue={d.avatarHue} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-fg">{d.name}</p>
                    <p className="text-xs text-muted">License: {d.licenseNumber}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${tone === 'danger' ? 'bg-danger-soft text-danger' : tone === 'warning' ? 'bg-warning-soft text-warning' : 'bg-info-soft text-info'}`}>
                    {days < 0 ? 'Expired' : `${days} days`}
                  </span>
                </div>
              );
            })}
            {upcomingExpiry.length === 0 && <p className="px-5 py-8 text-sm text-muted text-center">No upcoming expiries.</p>}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
