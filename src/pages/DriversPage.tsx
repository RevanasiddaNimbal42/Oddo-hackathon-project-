import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Users, Filter, Pencil, Trash2, Eye, X } from 'lucide-react';
import { Layout, PageHeader } from '../components/layout/Layout';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { StatusBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/ui/EmptyState';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useData } from '../contexts/DataContext';
import { formatDate, daysUntil } from '../utils';
import type { Driver, DriverStatus } from '../types';

const statuses: DriverStatus[] = ['Available', 'On Trip', 'Off Duty', 'Suspended'];
const licenseCats = ['A', 'B', 'C', 'C1', 'C+E', 'D', 'D1'];

const emptyForm = {
  name: '', licenseNumber: '', licenseCategory: 'C' as Driver['licenseCategory'],
  licenseExpiry: '', phone: '', email: '', safetyScore: 80, status: 'Available' as DriverStatus,
  avatarHue: Math.floor(Math.random() * 360),
};

export function DriversPage() {
  const { drivers, addDriver, updateDriver, deleteDriver } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Driver | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Driver | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    return drivers.filter((d) => {
      const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.licenseNumber.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [drivers, search, statusFilter]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (d: Driver) => {
    setEditing(d);
    setForm({ name: d.name, licenseNumber: d.licenseNumber, licenseCategory: d.licenseCategory, licenseExpiry: d.licenseExpiry.split('T')[0], phone: d.phone, email: d.email, safetyScore: d.safetyScore, status: d.status, avatarHue: d.avatarHue });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, licenseExpiry: new Date(form.licenseExpiry).toISOString() };
    if (editing) {
      updateDriver(editing.id, payload);
    } else {
      addDriver(payload);
    }
    setModalOpen(false);
  };

  const columns: Column<Driver>[] = [
    {
      key: 'name', header: 'Driver', sortValue: (d) => d.name,
      render: (d) => (
        <div className="flex items-center gap-3">
          <Avatar name={d.name} hue={d.avatarHue} size="sm" />
          <div>
            <p className="font-medium text-fg">{d.name}</p>
            <p className="text-xs text-muted">{d.licenseNumber} · Cat {d.licenseCategory}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Contact', hideOnMobile: true, render: (d) => <span className="text-muted">{d.phone}</span> },
    {
      key: 'license', header: 'License Expiry', sortValue: (d) => d.licenseExpiry, hideOnMobile: true,
      render: (d) => {
        const days = daysUntil(d.licenseExpiry);
        const expired = days < 0;
        return <span className={expired ? 'text-danger font-medium' : days <= 30 ? 'text-warning font-medium' : 'text-muted'}>{formatDate(d.licenseExpiry)}</span>;
      },
    },
    {
      key: 'safety', header: 'Safety Score', sortValue: (d) => d.safetyScore,
      render: (d) => (
        <div className="w-28">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-fg">{d.safetyScore}</span>
            <span className="text-xs text-muted">{d.safetyScore >= 90 ? 'Excellent' : d.safetyScore >= 80 ? 'Good' : 'Needs improvement'}</span>
          </div>
          <ProgressBar value={d.safetyScore} tone={d.safetyScore >= 90 ? 'success' : d.safetyScore >= 75 ? 'primary' : 'warning'} />
        </div>
      ),
    },
    { key: 'status', header: 'Status', sortValue: (d) => d.status, render: (d) => <StatusBadge status={d.status} /> },
    {
      key: 'actions', header: '', className: 'text-right',
      render: (d) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={(e) => { e.stopPropagation(); navigate(`/drivers/${d.id}`); }} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-primary-soft transition-colors"><Eye size={16} /></button>
          <button onClick={(e) => { e.stopPropagation(); openEdit(d); }} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-fg hover:bg-surface-2 transition-colors"><Pencil size={16} /></button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(d); }} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-danger-soft transition-colors"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <Layout breadcrumb={[{ label: 'Drivers' }]}>
      <PageHeader title="Drivers" description={`${drivers.length} drivers in your team`} actions={<Button icon={<Plus size={16} />} onClick={openAdd}>Add Driver</Button>} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input placeholder="Search by name or license number..." icon={<Search size={16} />} value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <Button variant="outline" icon={<Filter size={16} />} onClick={() => setShowFilters((v) => !v)}>Filters {statusFilter && <span className="h-2 w-2 rounded-full bg-primary ml-1" />}</Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-end gap-3 mb-4 p-4 bg-surface border border-border rounded-2xl animate-slide-up">
          <Select label="Status" placeholder="All statuses" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={statuses.map((s) => ({ value: s, label: s }))} className="w-40" />
          {statusFilter && <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={() => setStatusFilter('')}>Clear</Button>}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl"><EmptyState icon={Users} title="No drivers found" description="Add your first driver to get started." action={<Button icon={<Plus size={16} />} onClick={openAdd}>Add Driver</Button>} /></div>
      ) : (
        <DataTable columns={columns} data={filtered} rowKey={(d) => d.id} onRowClick={(d) => navigate(`/drivers/${d.id}`)} pageSize={10} />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Driver' : 'Add New Driver'} description={editing ? 'Update driver information' : 'Register a new driver'} size="lg"
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit as unknown as () => void}>{editing ? 'Save Changes' : 'Add Driver'}</Button></>}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required />
            <Input label="License Number" value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} placeholder="DL-123456" required />
            <Select label="License Category" value={form.licenseCategory} onChange={(e) => setForm({ ...form, licenseCategory: e.target.value as Driver['licenseCategory'] })} options={licenseCats.map((c) => ({ value: c, label: c }))} />
            <Input label="License Expiry" type="date" value={form.licenseExpiry} onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })} required />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555-0100" />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="driver@company.com" />
            <Input label="Safety Score (0-100)" type="number" min="0" max="100" value={form.safetyScore} onChange={(e) => setForm({ ...form, safetyScore: +e.target.value })} />
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as DriverStatus })} options={statuses.map((s) => ({ value: s, label: s }))} />
          </div>
          <button type="submit" className="hidden" />
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteTarget && deleteDriver(deleteTarget.id)} title="Delete Driver" message={`Are you sure you want to remove ${deleteTarget?.name} from your team?`} confirmLabel="Delete" danger />
    </Layout>
  );
}
