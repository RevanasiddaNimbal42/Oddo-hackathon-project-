import { useState, useMemo } from 'react';
import { Plus, Search, Fuel, Filter, X } from 'lucide-react';
import { Layout, PageHeader } from '../components/layout/Layout';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { KPICard } from '../components/ui/KPICard';
import { useData } from '../contexts/DataContext';
import { formatCurrency, formatNumber, formatDate } from '../utils';
import type { FuelLog } from '../types';

const emptyForm = { vehicleId: '', driverId: '', date: new Date().toISOString().split('T')[0], quantityLiters: 0, costPerLiter: 0, odometerAtFill: 0, mileageKm: 0 };

export function FuelLogsPage() {
  const { fuelLogs, vehicles, drivers, addFuelLog } = useData();
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const filtered = useMemo(() => {
    return fuelLogs.filter((f) => {
      const vehicle = vehicles.find((v) => v.id === f.vehicleId);
      const driver = drivers.find((d) => d.id === f.driverId);
      const matchSearch = !search || vehicle?.name.toLowerCase().includes(search.toLowerCase()) || driver?.name.toLowerCase().includes(search.toLowerCase());
      const matchVehicle = !vehicleFilter || f.vehicleId === vehicleFilter;
      return matchSearch && matchVehicle;
    });
  }, [fuelLogs, vehicles, drivers, search, vehicleFilter]);

  const stats = useMemo(() => ({
    totalCost: fuelLogs.reduce((s, f) => s + f.totalCost, 0),
    totalLiters: fuelLogs.reduce((s, f) => s + f.quantityLiters, 0),
    avgEfficiency: fuelLogs.length > 0 ? (fuelLogs.reduce((s, f) => s + f.mileageKm, 0) / fuelLogs.filter((f) => f.mileageKm > 0).length || 0).toFixed(1) : '0',
    entries: fuelLogs.length,
  }), [fuelLogs]);

  const openAdd = () => { setForm(emptyForm); setFormError(''); setModalOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.vehicleId) { setFormError('Please select a vehicle.'); return; }
    if (!form.driverId) { setFormError('Please select a driver.'); return; }
    addFuelLog({ ...form, date: new Date(form.date).toISOString() });
    setModalOpen(false);
  };

  const columns: Column<FuelLog>[] = [
    {
      key: 'vehicle', header: 'Vehicle', sortValue: (f) => vehicles.find((v) => v.id === f.vehicleId)?.name ?? '',
      render: (f) => {
        const v = vehicles.find((v) => v.id === f.vehicleId);
        return (
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-xl bg-warning-soft flex items-center justify-center flex-shrink-0">
              <Fuel size={16} className="text-warning" />
            </span>
            <div><p className="font-medium text-fg">{v?.name ?? 'Unknown'}</p><p className="text-xs text-muted">{v?.registration}</p></div>
          </div>
        );
      },
    },
    { key: 'driver', header: 'Driver', sortValue: (f) => drivers.find((d) => d.id === f.driverId)?.name ?? '', hideOnMobile: true, render: (f) => <span className="text-muted">{drivers.find((d) => d.id === f.driverId)?.name ?? '—'}</span> },
    { key: 'date', header: 'Date', sortValue: (f) => f.date, render: (f) => <span className="text-muted">{formatDate(f.date)}</span> },
    { key: 'quantity', header: 'Quantity', sortValue: (f) => f.quantityLiters, render: (f) => <span>{f.quantityLiters > 0 ? `${f.quantityLiters} L` : 'EV'}</span> },
    { key: 'cost', header: 'Total Cost', sortValue: (f) => f.totalCost, render: (f) => <span className="font-medium">{formatCurrency(f.totalCost)}</span> },
    { key: 'mileage', header: 'Efficiency', sortValue: (f) => f.mileageKm, hideOnMobile: true, render: (f) => <span className="text-muted">{f.mileageKm > 0 ? `${f.mileageKm} km/L` : '—'}</span> },
  ];

  return (
    <Layout breadcrumb={[{ label: 'Fuel Logs' }]}>
      <PageHeader title="Fuel Logs" description={`${fuelLogs.length} fuel entries`} actions={<Button icon={<Plus size={16} />} onClick={openAdd}>Add Entry</Button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard label="Total Fuel Cost" value={formatCurrency(stats.totalCost)} icon={Fuel} tone="warning" delay={0} />
        <KPICard label="Total Liters" value={`${formatNumber(Math.round(stats.totalLiters))} L`} icon={Fuel} tone="info" delay={0.05} />
        <KPICard label="Avg Efficiency" value={`${stats.avgEfficiency} km/L`} icon={Fuel} tone="success" delay={0.1} />
        <KPICard label="Total Entries" value={String(stats.entries)} icon={Fuel} tone="primary" delay={0.15} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input placeholder="Search by vehicle or driver..." icon={<Search size={16} />} value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <Button variant="outline" icon={<Filter size={16} />} onClick={() => setShowFilters((v) => !v)}>Filters {vehicleFilter && <span className="h-2 w-2 rounded-full bg-primary ml-1" />}</Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-end gap-3 mb-4 p-4 bg-surface border border-border rounded-2xl animate-slide-up">
          <Select label="Vehicle" placeholder="All vehicles" value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} options={vehicles.map((v) => ({ value: v.id, label: `${v.name} (${v.registration})` }))} className="w-52" />
          {vehicleFilter && <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={() => setVehicleFilter('')}>Clear</Button>}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl"><EmptyState icon={Fuel} title="No fuel logs" description="Add a fuel entry to start tracking consumption." action={<Button icon={<Plus size={16} />} onClick={openAdd}>Add Entry</Button>} /></div>
      ) : (
        <DataTable columns={columns} data={filtered} rowKey={(f) => f.id} pageSize={10} />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Fuel Entry" description="Record a fuel refueling or charging event" size="lg"
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit as unknown as () => void}>Add Entry</Button></>}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <div className="bg-danger-soft text-danger text-sm px-3 py-2 rounded-lg">{formError}</div>}
          <div className="grid grid-cols-2 gap-4">
            <Select label="Vehicle" placeholder="Select vehicle" value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} options={vehicles.map((v) => ({ value: v.id, label: `${v.name} (${v.registration})` }))} />
            <Select label="Driver" placeholder="Select driver" value={form.driverId} onChange={(e) => setForm({ ...form, driverId: e.target.value })} options={drivers.map((d) => ({ value: d.id, label: d.name }))} />
            <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Input label="Odometer at Fill (km)" type="number" value={form.odometerAtFill || ''} onChange={(e) => setForm({ ...form, odometerAtFill: +e.target.value })} placeholder="184250" />
            <Input label="Quantity (Liters)" type="number" value={form.quantityLiters || ''} onChange={(e) => setForm({ ...form, quantityLiters: +e.target.value })} placeholder="320" hint="Enter 0 for EV charging" />
            <Input label="Cost per Liter ($)" type="number" step="0.01" value={form.costPerLiter || ''} onChange={(e) => setForm({ ...form, costPerLiter: +e.target.value })} placeholder="1.45" />
            <Input label="Mileage / Efficiency (km/L)" type="number" step="0.1" value={form.mileageKm || ''} onChange={(e) => setForm({ ...form, mileageKm: +e.target.value })} placeholder="5.8" />
          </div>
          <button type="submit" className="hidden" />
        </form>
      </Modal>
    </Layout>
  );
}
