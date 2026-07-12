import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Truck, Wrench, Fuel, Route, DollarSign, Pencil } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { EmptyState } from '../components/ui/EmptyState';
import { useData } from '../contexts/DataContext';
import { formatCurrency, formatNumber, formatDate } from '../utils';

export function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, trips, maintenance, fuelLogs } = useData();
  const vehicle = vehicles.find((v) => v.id === id);

  if (!vehicle) {
    return (
      <Layout breadcrumb={[{ label: 'Vehicles', path: '/vehicles' }, { label: 'Not Found' }]}>
        <EmptyState icon={Truck} title="Vehicle not found" description="This vehicle may have been removed." action={<Link to="/vehicles"><Button variant="outline">Back to Vehicles</Button></Link>} />
      </Layout>
    );
  }

  const vehicleTrips = trips.filter((t) => t.vehicleId === vehicle.id);
  const vehicleMaintenance = maintenance.filter((m) => m.vehicleId === vehicle.id);
  const vehicleFuel = fuelLogs.filter((f) => f.vehicleId === vehicle.id);
  const totalFuelCost = vehicleFuel.reduce((s, f) => s + f.totalCost, 0);
  const totalMaintenanceCost = vehicleMaintenance.filter((m) => m.actualCost).reduce((s, m) => s + (m.actualCost ?? 0), 0);
  const totalTripRevenue = vehicleTrips.filter((t) => t.status === 'Completed').reduce((s, t) => s + t.estimatedRevenue, 0);
  const utilization = Math.round((vehicleTrips.filter((t) => t.status === 'Dispatched').length / Math.max(vehicleTrips.length, 1)) * 100);

  const stats = [
    { label: 'Total Trips', value: formatNumber(vehicleTrips.length), icon: Route },
    { label: 'Total Revenue', value: formatCurrency(totalTripRevenue), icon: DollarSign },
    { label: 'Fuel Cost (Total)', value: formatCurrency(totalFuelCost), icon: Fuel },
    { label: 'Maintenance Cost', value: formatCurrency(totalMaintenanceCost), icon: Wrench },
  ];

  const info = [
    { label: 'Registration', value: vehicle.registration },
    { label: 'Type', value: vehicle.type },
    { label: 'Fuel Type', value: vehicle.fuelType },
    { label: 'Year', value: String(vehicle.year) },
    { label: 'Max Capacity', value: `${formatNumber(vehicle.maxCapacityKg)} kg` },
    { label: 'Odometer', value: `${formatNumber(vehicle.odometer)} km` },
    { label: 'Acquisition Cost', value: formatCurrency(vehicle.acquisitionCost) },
    { label: 'Last Service', value: formatDate(vehicle.lastService) },
  ];

  return (
    <Layout breadcrumb={[{ label: 'Vehicles', path: '/vehicles' }, { label: vehicle.name }]}>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/vehicles')}>Back</Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="h-16 w-16 rounded-2xl bg-primary-soft flex items-center justify-center">
            <Truck size={28} className="text-primary" />
          </span>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-fg tracking-tight">{vehicle.name}</h1>
              <StatusBadge status={vehicle.status} />
            </div>
            <p className="text-sm text-muted mt-1">{vehicle.registration} · {vehicle.type} · {vehicle.year}</p>
          </div>
        </div>
        <Button variant="outline" icon={<Pencil size={16} />} onClick={() => navigate('/vehicles')}>Edit Vehicle</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <Card key={i} className="p-5">
            <span className="h-9 w-9 rounded-xl bg-surface-2 flex items-center justify-center mb-3">
              <s.icon size={18} className="text-primary" />
            </span>
            <p className="text-xl font-bold text-fg">{s.value}</p>
            <p className="text-sm text-muted mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      <Tabs
        tabs={[
          {
            id: 'overview', label: 'Overview',
            content: (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader><CardTitle>Vehicle Information</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {info.map((item) => (
                        <div key={item.label}>
                          <p className="text-xs text-subtle uppercase tracking-wider mb-1">{item.label}</p>
                          <p className="text-sm font-medium text-fg">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Performance</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted">Fleet Utilization</span>
                        <span className="text-sm font-semibold text-fg">{utilization}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${utilization}%` }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-3 rounded-xl bg-surface-2">
                        <p className="text-xs text-muted">Avg. Fuel Efficiency</p>
                        <p className="text-lg font-bold text-fg mt-1">
                          {vehicleFuel.length > 0 ? (vehicleFuel.reduce((s, f) => s + f.mileageKm, 0) / vehicleFuel.length).toFixed(1) : '—'} km/L
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-2">
                        <p className="text-xs text-muted">Cost per Km</p>
                        <p className="text-lg font-bold text-fg mt-1">
                          {vehicle.odometer > 0 ? formatCurrency((totalFuelCost + totalMaintenanceCost) / vehicle.odometer) : '—'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ),
          },
          {
            id: 'trips', label: `Trips (${vehicleTrips.length})`,
            content: (
              <Card>
                {vehicleTrips.length === 0 ? (
                  <EmptyState icon={Route} title="No trips yet" description="This vehicle hasn't been assigned to any trips." />
                ) : (
                  <div className="divide-y divide-border-soft">
                    {vehicleTrips.map((t) => (
                      <div key={t.id} className="flex items-center gap-4 px-5 py-3.5">
                        <span className="h-9 w-9 rounded-xl bg-primary-soft flex items-center justify-center flex-shrink-0">
                          <Route size={16} className="text-primary" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-fg">{t.source} → {t.destination}</p>
                          <p className="text-xs text-muted">{t.code} · {formatDate(t.createdAt)}</p>
                        </div>
                        <span className="text-sm font-medium text-fg hidden sm:block">{formatCurrency(t.estimatedRevenue)}</span>
                        <StatusBadge status={t.status} />
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ),
          },
          {
            id: 'maintenance', label: `Maintenance (${vehicleMaintenance.length})`,
            content: (
              <Card>
                {vehicleMaintenance.length === 0 ? (
                  <EmptyState icon={Wrench} title="No maintenance records" description="This vehicle has no maintenance history." />
                ) : (
                  <div className="divide-y divide-border-soft">
                    {vehicleMaintenance.map((m) => (
                      <div key={m.id} className="px-5 py-4">
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <p className="text-sm font-medium text-fg">{m.issue}</p>
                          <StatusBadge status={m.status} />
                        </div>
                        <p className="text-xs text-muted">{m.mechanic} · {formatDate(m.createdAt)} · Est: {formatCurrency(m.estimatedCost)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ),
          },
          {
            id: 'fuel', label: `Fuel Logs (${vehicleFuel.length})`,
            content: (
              <Card>
                {vehicleFuel.length === 0 ? (
                  <EmptyState icon={Fuel} title="No fuel logs" description="No fuel entries for this vehicle." />
                ) : (
                  <div className="divide-y divide-border-soft">
                    {vehicleFuel.map((f) => (
                      <div key={f.id} className="flex items-center gap-4 px-5 py-3.5">
                        <span className="h-9 w-9 rounded-xl bg-warning-soft flex items-center justify-center flex-shrink-0">
                          <Fuel size={16} className="text-warning" />
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-fg">{f.quantityLiters > 0 ? `${f.quantityLiters}L` : 'EV Charge'}</p>
                          <p className="text-xs text-muted">{formatDate(f.date)} · {f.mileageKm} km/L</p>
                        </div>
                        <span className="text-sm font-medium text-fg">{formatCurrency(f.totalCost)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ),
          },
        ]}
      />
    </Layout>
  );
}
