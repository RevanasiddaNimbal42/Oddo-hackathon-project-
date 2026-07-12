import { useState } from 'react';
import { Download, FileSpreadsheet, FileImage, Truck, Users, Route, Receipt, Fuel, BarChart3, Check } from 'lucide-react';
import { Layout, PageHeader } from '../components/layout/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { Tabs } from '../components/ui/Tabs';
import { useData } from '../contexts/DataContext';
import { formatCurrency, formatNumber, formatDate } from '../utils';

const reportTypes = [
  { id: 'vehicle', label: 'Vehicle Report', icon: Truck, description: 'Fleet inventory, status, and performance per vehicle' },
  { id: 'driver', label: 'Driver Report', icon: Users, description: 'Driver performance, safety scores, and trip history' },
  { id: 'trip', label: 'Trip Report', icon: Route, description: 'All trips with routes, distances, and revenues' },
  { id: 'expense', label: 'Expense Report', icon: Receipt, description: 'Categorized expenses with monthly breakdown' },
  { id: 'fuel', label: 'Fuel Report', icon: Fuel, description: 'Fuel consumption and efficiency analysis' },
  { id: 'utilization', label: 'Fleet Utilization', icon: BarChart3, description: 'Vehicle utilization rates and availability metrics' },
];

export function ReportsPage() {
  const { vehicles, drivers, trips, expenses, fuelLogs, pushToast } = useData();
  const [period, setPeriod] = useState('this-month');
  const [generated, setGenerated] = useState<string | null>(null);

  const handleGenerate = (reportId: string) => {
    setGenerated(reportId);
    pushToast('success', 'Report generated successfully');
    setTimeout(() => setGenerated(null), 2000);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    pushToast('success', `Report exported as ${format.toUpperCase()}`);
  };

  const vehicleReport = (
    <Card>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-soft text-xs text-muted uppercase tracking-wider">
              <th className="text-left py-2 px-3">Vehicle</th><th className="text-left py-2 px-3">Type</th><th className="text-left py-2 px-3">Status</th><th className="text-right py-2 px-3">Odometer</th><th className="text-right py-2 px-3">Trips</th><th className="text-right py-2 px-3">Revenue</th>
            </tr></thead>
            <tbody className="divide-y divide-border-soft">
              {vehicles.map((v) => {
                const vTrips = trips.filter((t) => t.vehicleId === v.id);
                const revenue = vTrips.filter((t) => t.status === 'Completed').reduce((s, t) => s + t.estimatedRevenue, 0);
                return (
                  <tr key={v.id} className="hover:bg-surface-2">
                    <td className="py-2.5 px-3 font-medium text-fg">{v.name} <span className="text-muted">({v.registration})</span></td>
                    <td className="py-2.5 px-3 text-muted">{v.type}</td>
                    <td className="py-2.5 px-3 text-muted">{v.status}</td>
                    <td className="py-2.5 px-3 text-right text-muted">{formatNumber(v.odometer)} km</td>
                    <td className="py-2.5 px-3 text-right">{vTrips.length}</td>
                    <td className="py-2.5 px-3 text-right font-medium">{formatCurrency(revenue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const driverReport = (
    <Card>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-soft text-xs text-muted uppercase tracking-wider">
              <th className="text-left py-2 px-3">Driver</th><th className="text-left py-2 px-3">License</th><th className="text-right py-2 px-3">Safety</th><th className="text-right py-2 px-3">Trips</th><th className="text-right py-2 px-3">Distance</th><th className="text-left py-2 px-3">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-border-soft">
              {drivers.map((d) => (
                <tr key={d.id} className="hover:bg-surface-2">
                  <td className="py-2.5 px-3 font-medium text-fg">{d.name}</td>
                  <td className="py-2.5 px-3 text-muted">{d.licenseNumber}</td>
                  <td className="py-2.5 px-3 text-right">{d.safetyScore}</td>
                  <td className="py-2.5 px-3 text-right">{d.tripsCompleted}</td>
                  <td className="py-2.5 px-3 text-right text-muted">{formatNumber(d.totalDistanceKm)} km</td>
                  <td className="py-2.5 px-3 text-muted">{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const tripReport = (
    <Card>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-soft text-xs text-muted uppercase tracking-wider">
              <th className="text-left py-2 px-3">Code</th><th className="text-left py-2 px-3">Route</th><th className="text-left py-2 px-3">Vehicle</th><th className="text-right py-2 px-3">Distance</th><th className="text-right py-2 px-3">Revenue</th><th className="text-left py-2 px-3">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-border-soft">
              {trips.map((t) => (
                <tr key={t.id} className="hover:bg-surface-2">
                  <td className="py-2.5 px-3 font-medium text-fg">{t.code}</td>
                  <td className="py-2.5 px-3 text-muted">{t.source} → {t.destination}</td>
                  <td className="py-2.5 px-3 text-muted">{vehicles.find((v) => v.id === t.vehicleId)?.name}</td>
                  <td className="py-2.5 px-3 text-right text-muted">{formatNumber(t.distanceKm)} km</td>
                  <td className="py-2.5 px-3 text-right font-medium">{formatCurrency(t.estimatedRevenue)}</td>
                  <td className="py-2.5 px-3 text-muted">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const expenseReport = (
    <Card>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-soft text-xs text-muted uppercase tracking-wider">
              <th className="text-left py-2 px-3">Description</th><th className="text-left py-2 px-3">Category</th><th className="text-left py-2 px-3">Vendor</th><th className="text-right py-2 px-3">Amount</th>
            </tr></thead>
            <tbody className="divide-y divide-border-soft">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-surface-2">
                  <td className="py-2.5 px-3 font-medium text-fg">{e.description}</td>
                  <td className="py-2.5 px-3 text-muted">{e.category}</td>
                  <td className="py-2.5 px-3 text-muted">{e.vendor}</td>
                  <td className="py-2.5 px-3 text-right font-medium">{formatCurrency(e.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const fuelReport = (
    <Card>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-soft text-xs text-muted uppercase tracking-wider">
              <th className="text-left py-2 px-3">Vehicle</th><th className="text-left py-2 px-3">Date</th><th className="text-right py-2 px-3">Liters</th><th className="text-right py-2 px-3">Cost</th><th className="text-right py-2 px-3">Efficiency</th>
            </tr></thead>
            <tbody className="divide-y divide-border-soft">
              {fuelLogs.map((f) => (
                <tr key={f.id} className="hover:bg-surface-2">
                  <td className="py-2.5 px-3 font-medium text-fg">{vehicles.find((v) => v.id === f.vehicleId)?.name}</td>
                  <td className="py-2.5 px-3 text-muted">{formatDate(f.date)}</td>
                  <td className="py-2.5 px-3 text-right text-muted">{f.quantityLiters > 0 ? `${f.quantityLiters} L` : 'EV'}</td>
                  <td className="py-2.5 px-3 text-right font-medium">{formatCurrency(f.totalCost)}</td>
                  <td className="py-2.5 px-3 text-right text-muted">{f.mileageKm > 0 ? `${f.mileageKm} km/L` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const utilizationReport = (
    <Card>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-soft text-xs text-muted uppercase tracking-wider">
              <th className="text-left py-2 px-3">Vehicle</th><th className="text-right py-2 px-3">Total Trips</th><th className="text-right py-2 px-3">Active</th><th className="text-right py-2 px-3">Completed</th><th className="text-right py-2 px-3">Utilization</th>
            </tr></thead>
            <tbody className="divide-y divide-border-soft">
              {vehicles.map((v) => {
                const vTrips = trips.filter((t) => t.vehicleId === v.id);
                const active = vTrips.filter((t) => t.status === 'Dispatched').length;
                const completed = vTrips.filter((t) => t.status === 'Completed').length;
                const util = vTrips.length > 0 ? Math.round(((active + completed) / vTrips.length) * 100) : 0;
                return (
                  <tr key={v.id} className="hover:bg-surface-2">
                    <td className="py-2.5 px-3 font-medium text-fg">{v.name}</td>
                    <td className="py-2.5 px-3 text-right">{vTrips.length}</td>
                    <td className="py-2.5 px-3 text-right">{active}</td>
                    <td className="py-2.5 px-3 text-right">{completed}</td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-2 rounded-full bg-surface-2 overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${util}%` }} /></div>
                        <span className="font-medium w-10 text-right">{util}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout breadcrumb={[{ label: 'Reports' }]}>
      <PageHeader
        title="Reports"
        description="Generate and export detailed reports across your fleet"
        actions={
          <div className="flex items-center gap-2">
            <Select value={period} onChange={(e) => setPeriod(e.target.value)} options={[
              { value: 'this-week', label: 'This Week' }, { value: 'this-month', label: 'This Month' },
              { value: 'this-quarter', label: 'This Quarter' }, { value: 'this-year', label: 'This Year' }, { value: 'all', label: 'All Time' },
            ]} className="w-40" />
            <Button variant="outline" icon={<FileSpreadsheet size={16} />} onClick={() => handleExport('csv')}>CSV</Button>
            <Button variant="outline" icon={<FileImage size={16} />} onClick={() => handleExport('pdf')}>PDF</Button>
          </div>
        }
      />

      {/* Report Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {reportTypes.map((rt) => {
          const Icon = rt.icon;
          const isGenerated = generated === rt.id;
          return (
            <Card key={rt.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <span className="h-11 w-11 rounded-xl bg-primary-soft flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-primary" />
                </span>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-fg">{rt.label}</h3>
                  <p className="text-xs text-muted mt-0.5">{rt.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant={isGenerated ? 'success' : 'primary'} icon={isGenerated ? <Check size={14} /> : <Download size={14} />} onClick={() => handleGenerate(rt.id)} className="flex-1">
                  {isGenerated ? 'Generated' : 'Generate'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detailed Reports */}
      <Tabs tabs={[
        { id: 'vehicle', label: 'Vehicles', content: vehicleReport },
        { id: 'driver', label: 'Drivers', content: driverReport },
        { id: 'trip', label: 'Trips', content: tripReport },
        { id: 'expense', label: 'Expenses', content: expenseReport },
        { id: 'fuel', label: 'Fuel', content: fuelReport },
        { id: 'utilization', label: 'Utilization', content: utilizationReport },
      ]} />
    </Layout>
  );
}
