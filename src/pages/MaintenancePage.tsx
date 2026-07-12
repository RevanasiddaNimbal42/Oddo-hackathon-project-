import { useState, useMemo } from 'react';
import { Plus, Search, Wrench, Filter, X, Play, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Layout, PageHeader } from '../components/layout/Layout';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { StatusBadge, Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { KPICard } from '../components/ui/KPICard';
import { useData } from '../contexts/DataContext';
import { formatCurrency } from '../utils';
import type { MaintenanceRecord, MaintenanceStatus, MaintenancePriority } from '../types';

const priorities: MaintenancePriority[] = ['Low', 'Medium', 'High', 'Critical'];
const statuses: MaintenanceStatus[] = ['Open', 'In Progress', 'Completed'];
const mechanics = ['Tom Bradley', 'Sarah Lin', 'Mike Davis', 'Lisa Garcia'];

const emptyForm = {
  vehicleId: '', issue: '', priority: 'Medium' as MaintenancePriority,
  mechanic: mechanics[0], estimatedCost: 0, notes: '',
};

export function MaintenancePage() {
  const { maintenance, vehicles, addMaintenance, startMaintenance, completeMaintenance } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [completeTarget, setCompleteTarget] = useState<MaintenanceRecord | null>(null);
  const [actualCost, setActualCost] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const filtered = useMemo(() => {
    return maintenance.filter((m) => {
      const vehicle = vehicles.find((v) => v.id === m.vehicleId);
      const matchSearch = !search || m.issue.toLowerCase().includes(search.toLowerCase()) || vehicle?.name.toLowerCase().includes(search.toLowerCase()) || m.mechanic.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || m.status === statusFilter;
      const matchPriority = !priorityFilter || m.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [maintenance, vehicles, search, statusFilter, priorityFilter]);

  const stats = useMemo(() => ({
    open: maintenance.filter((m) => m.status === 'Open').length,
    inProgress: maintenance.filter((m) => m.status === 'In Progress').length,
    completed: maintenance.filter((m) => m.status === 'Completed').length,
    totalCost: maintenance.filter((m) => m.actualCost).reduce((s, m) => s + (m.actualCost ?? 0), 0),
    estimatedTotal: maintenance.reduce((s, m) => s + m.estimatedCost, 0),
  }), [maintenance]);

  const openAdd = () => { setForm(emptyForm); setFormError(''); setModalOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.vehicleId) { setFormError('Please select a vehicle.'); return; }
    if (!form.issue) { setFormError('Issue description is required.'); return; }
    const result = addMaintenance(form);
    if (!result.success) { setFormError(result.error ?? 'Failed to create record.'); return; }
    setModalOpen(false);
  };

  const handleStart = (m: MaintenanceRecord) => startMaintenance(m.id);
  const handleComplete = () => {
    if (completeTarget) { completeMaintenance(completeTarget.id, actualCost); setCompleteTarget(null); setActualCost(0); }
  };

  const columns: Column<MaintenanceRecord>[] = [
    {
      key: 'vehicle', header: 'Vehicle', sortValue: (m) => vehicles.find((v) => v.id === m.vehicleId)?.name ?? '',
      render: (m) => {
        const v = vehicles.find((v) => v.id === m.vehicleId);
        return (
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-xl bg-warning-soft flex items-center justify-center flex-shrink-0">
              <Wrench size={16} className="text-warning" />
            </span>
            <div>
              <p className="font-medium text-fg">{v?.name ?? 'Unknown'}</p>
              <p className="text-xs text-muted">{v?.registration}</p>
            </div>
          </div>
        );
      },
    },
    { key: 'issue', header: 'Issue', sortValue: (m) => m.issue, render: (m) => <span className="text-fg max-w-xs truncate block">{m.issue}</span> },
    { key: 'priority', header: 'Priority', sortValue: (m) => m.priority, render: (m) => <Badge tone={m.priority === 'Critical' ? 'danger' : m.priority === 'High' ? 'warning' : m.priority === 'Medium' ? 'info' : 'neutral'} dot>{m.priority}</Badge> },
    { key: 'mechanic', header: 'Mechanic', sortValue: (m) => m.mechanic, hideOnMobile: true, render: (m) => <span className="text-muted">{m.mechanic}</span> },
    { key: 'cost', header: 'Cost', sortValue: (m) => m.actualCost ?? m.estimatedCost, render: (m) => <span className="font-medium">{m.actualCost ? formatCurrency(m.actualCost) : `~${formatCurrency(m.estimatedCost)}`}</span> },
    { key: 'status', header: 'Status', sortValue: (m) => m.status, render: (m) => <StatusBadge status={m.status} /> },
    {
      key: 'actions', header: '', className: 'text-right',
      render: (m) => (
        <div className="flex items-center justify-end gap-1">
          {m.status === 'Open' && <Button size="xs" variant="secondary" icon={<Play size={12} />} onClick={(e) => { e.stopPropagation(); handleStart(m); }}>Start</Button>}
          {m.status === 'In Progress' && <Button size="xs" variant="success" icon={<CheckCircle2 size={12} />} onClick={(e) => { e.stopPropagation(); setCompleteTarget(m); setActualCost(m.estimatedCost); }}>Complete</Button>}
        </div>
      ),
    },
  ];

  return (
    <Layout breadcrumb={[{ label: 'Maintenance' }]}>
      <PageHeader title="Maintenance" description={`${maintenance.length} records · ${stats.inProgress} in progress`} actions={<Button icon={<Plus size={16} />} onClick={openAdd}>New Record</Button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard label="Open" value={String(stats.open)} icon={AlertTriangle} tone="warning" delay={0} />
        <KPICard label="In Progress" value={String(stats.inProgress)} icon={Wrench} tone="info" delay={0.05} />
        <KPICard label="Completed" value={String(stats.completed)} icon={CheckCircle2} tone="success" delay={0.1} />
        <KPICard label="Total Cost" value={formatCurrency(stats.totalCost)} icon={Wrench} tone="primary" delay={0.15} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input placeholder="Search by issue, vehicle, or mechanic..." icon={<Search size={16} />} value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <Button variant="outline" icon={<Filter size={16} />} onClick={() => setShowFilters((v) => !v)}>Filters {(statusFilter || priorityFilter) && <span className="h-2 w-2 rounded-full bg-primary ml-1" />}</Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-end gap-3 mb-4 p-4 bg-surface border border-border rounded-2xl animate-slide-up">
          <Select label="Status" placeholder="All statuses" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={statuses.map((s) => ({ value: s, label: s }))} className="w-40" />
          <Select label="Priority" placeholder="All priorities" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} options={priorities.map((p) => ({ value: p, label: p }))} className="w-40" />
          {(statusFilter || priorityFilter) && <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={() => { setStatusFilter(''); setPriorityFilter(''); }}>Clear</Button>}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl"><EmptyState icon={Wrench} title="No maintenance records" description="Create a maintenance record to track vehicle repairs." action={<Button icon={<Plus size={16} />} onClick={openAdd}>New Record</Button>} /></div>
      ) : (
        <DataTable columns={columns} data={filtered} rowKey={(m) => m.id} pageSize={10} />
      )}

      {/* Add Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Maintenance Record" description="Log a maintenance issue for a vehicle" size="lg"
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit as unknown as () => void}>Create Record</Button></>}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <div className="bg-danger-soft text-danger text-sm px-3 py-2 rounded-lg">{formError}</div>}
          <Select label="Vehicle" placeholder="Select a vehicle" value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} options={vehicles.map((v) => ({ value: v.id, label: `${v.name} (${v.registration})` }))} />
          <Textarea label="Issue Description" value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })} placeholder="Describe the maintenance issue..." rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as MaintenancePriority })} options={priorities.map((p) => ({ value: p, label: p }))} />
            <Select label="Mechanic" value={form.mechanic} onChange={(e) => setForm({ ...form, mechanic: e.target.value })} options={mechanics.map((m) => ({ value: m, label: m }))} />
          </div>
          <Input label="Estimated Cost ($)" type="number" value={form.estimatedCost || ''} onChange={(e) => setForm({ ...form, estimatedCost: +e.target.value })} placeholder="2200" />
          <Textarea label="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes..." rows={2} />
          <button type="submit" className="hidden" />
        </form>
      </Modal>

      {/* Complete Modal */}
      <Modal open={!!completeTarget} onClose={() => setCompleteTarget(null)} title="Complete Maintenance" description={`Mark maintenance for ${vehicles.find((v) => v.id === completeTarget?.vehicleId)?.name} as complete`}
        footer={<><Button variant="outline" onClick={() => setCompleteTarget(null)}>Cancel</Button><Button variant="success" onClick={handleComplete}>Mark Complete</Button></>}>
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-surface-2">
            <p className="text-sm font-medium text-fg">{completeTarget?.issue}</p>
            <p className="text-xs text-muted mt-1">Estimated: {formatCurrency(completeTarget?.estimatedCost ?? 0)}</p>
          </div>
          <Input label="Actual Cost ($)" type="number" value={actualCost || ''} onChange={(e) => setActualCost(+e.target.value)} placeholder="Enter actual cost" />
          <div className="flex items-center gap-2 p-3 rounded-xl bg-success-soft text-success text-sm">
            <CheckCircle2 size={16} /> The vehicle will be set back to Available status.
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
