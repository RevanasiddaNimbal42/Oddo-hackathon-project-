import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Truck, Filter, Pencil, Trash2, Eye, X } from 'lucide-react';
import { Layout, PageHeader } from '../components/layout/Layout';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { StatusBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useData } from '../contexts/DataContext';
import { formatCurrency, formatNumber } from '../utils';
import type { Vehicle, VehicleStatus } from '../types';

const vehicleTypes = ['Truck', 'Van', 'Bus', 'Refrigerated', 'Flatbed', 'Tanker', 'Box'];
const fuelTypes = ['Diesel', 'Petrol', 'Electric', 'Hybrid'];
const statuses: VehicleStatus[] = ['Available', 'On Trip', 'In Shop', 'Retired'];

const emptyForm = {
  registration: '', name: '', type: 'Truck' as Vehicle['type'], maxCapacityKg: 0,
  odometer: 0, acquisitionCost: 0, status: 'Available' as VehicleStatus,
  fuelType: 'Diesel' as Vehicle['fuelType'], year: new Date().getFullYear(), lastService: new Date().toISOString(),
};

export function VehiclesPage() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.registration.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || v.status === statusFilter;
      const matchType = !typeFilter || v.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [vehicles, search, statusFilter, typeFilter]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setFormError(''); setModalOpen(true); };
  const openEdit = (v: Vehicle) => {
    setEditing(v);
    setForm({ registration: v.registration, name: v.name, type: v.type, maxCapacityKg: v.maxCapacityKg, odometer: v.odometer, acquisitionCost: v.acquisitionCost, status: v.status, fuelType: v.fuelType, year: v.year, lastService: v.lastService });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.registration || !form.name) { setFormError('Registration and name are required.'); return; }
    if (form.maxCapacityKg <= 0) { setFormError('Maximum capacity must be greater than zero.'); return; }
    if (editing) {
      updateVehicle(editing.id, form);
    } else {
      const result = addVehicle(form);
      if (!result.success) { setFormError(result.error ?? 'Failed to add vehicle.'); return; }
    }
    setModalOpen(false);
  };

  const columns: Column<Vehicle>[] = [
    {
      key: 'name', header: 'Vehicle', sortValue: (v) => v.name,
      render: (v) => (
        <div className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-xl bg-primary-soft flex items-center justify-center flex-shrink-0">
            <Truck size={16} className="text-primary" />
          </span>
          <div>
            <p className="font-medium text-fg">{v.name}</p>
            <p className="text-xs text-muted">{v.registration}</p>
          </div>
        </div>
      ),
    },
    { key: 'type', header: 'Type', sortValue: (v) => v.type, hideOnMobile: true, render: (v) => <span className="text-muted">{v.type}</span> },
    { key: 'capacity', header: 'Capacity', sortValue: (v) => v.maxCapacityKg, hideOnMobile: true, render: (v) => <span>{formatNumber(v.maxCapacityKg)} kg</span> },
    { key: 'odometer', header: 'Odometer', sortValue: (v) => v.odometer, render: (v) => <span className="text-muted">{formatNumber(v.odometer)} km</span> },
    { key: 'cost', header: 'Acquisition', sortValue: (v) => v.acquisitionCost, hideOnMobile: true, render: (v) => <span>{formatCurrency(v.acquisitionCost)}</span> },
    { key: 'status', header: 'Status', sortValue: (v) => v.status, render: (v) => <StatusBadge status={v.status} /> },
    {
      key: 'actions', header: '', className: 'text-right',
      render: (v) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={(e) => { e.stopPropagation(); navigate(`/vehicles/${v.id}`); }} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-primary-soft transition-colors" title="View">
            <Eye size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); openEdit(v); }} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-fg hover:bg-surface-2 transition-colors" title="Edit">
            <Pencil size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(v); }} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-danger-soft transition-colors" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const hasFilters = statusFilter || typeFilter;

  return (
    <Layout breadcrumb={[{ label: 'Vehicles' }]}>
      <PageHeader
        title="Vehicles"
        description={`${vehicles.length} vehicles in your fleet`}
        actions={<Button icon={<Plus size={16} />} onClick={openAdd}>Add Vehicle</Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input placeholder="Search by name or registration..." icon={<Search size={16} />} value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <Button variant="outline" icon={<Filter size={16} />} onClick={() => setShowFilters((v) => !v)}>
          Filters {hasFilters && <span className="h-2 w-2 rounded-full bg-primary ml-1" />}
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-end gap-3 mb-4 p-4 bg-surface border border-border rounded-2xl animate-slide-up">
          <Select label="Status" placeholder="All statuses" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={statuses.map((s) => ({ value: s, label: s }))} className="w-40" />
          <Select label="Type" placeholder="All types" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} options={vehicleTypes.map((t) => ({ value: t, label: t }))} className="w-40" />
          {hasFilters && (
            <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={() => { setStatusFilter(''); setTypeFilter(''); }}>
              Clear
            </Button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl">
          <EmptyState icon={Truck} title="No vehicles found" description={hasFilters ? "Try adjusting your filters." : "Add your first vehicle to get started."} action={<Button icon={<Plus size={16} />} onClick={openAdd}>Add Vehicle</Button>} />
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} rowKey={(v) => v.id} onRowClick={(v) => navigate(`/vehicles/${v.id}`)} pageSize={10} />
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Vehicle' : 'Add New Vehicle'}
        description={editing ? 'Update vehicle information' : 'Register a new vehicle in your fleet'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit as unknown as () => void} type="submit">{editing ? 'Save Changes' : 'Add Vehicle'}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <div className="bg-danger-soft text-danger text-sm px-3 py-2 rounded-lg">{formError}</div>}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Registration Number" value={form.registration} onChange={(e) => setForm({ ...form, registration: e.target.value })} placeholder="TRK-1234" required />
            <Input label="Vehicle Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Falcon Heavy" required />
            <Select label="Vehicle Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Vehicle['type'] })} options={vehicleTypes.map((t) => ({ value: t, label: t }))} />
            <Select label="Fuel Type" value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value as Vehicle['fuelType'] })} options={fuelTypes.map((f) => ({ value: f, label: f }))} />
            <Input label="Max Capacity (kg)" type="number" value={form.maxCapacityKg || ''} onChange={(e) => setForm({ ...form, maxCapacityKg: +e.target.value })} placeholder="24000" />
            <Input label="Current Odometer (km)" type="number" value={form.odometer || ''} onChange={(e) => setForm({ ...form, odometer: +e.target.value })} placeholder="150000" />
            <Input label="Acquisition Cost ($)" type="number" value={form.acquisitionCost || ''} onChange={(e) => setForm({ ...form, acquisitionCost: +e.target.value })} placeholder="185000" />
            <Input label="Year" type="number" value={form.year || ''} onChange={(e) => setForm({ ...form, year: +e.target.value })} placeholder="2023" />
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as VehicleStatus })} options={statuses.map((s) => ({ value: s, label: s }))} />
          </div>
          <button type="submit" className="hidden" />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteVehicle(deleteTarget.id)}
        title="Delete Vehicle"
        message={`Are you sure you want to delete ${deleteTarget?.name} (${deleteTarget?.registration})? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </Layout>
  );
}
