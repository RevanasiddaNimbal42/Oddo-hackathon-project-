import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Plus, Search, Receipt, Filter, X, Trash2, DollarSign } from 'lucide-react';
import { Layout, PageHeader } from '../components/layout/Layout';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Badge } from '../components/ui/Badge';
import { ChartCard } from '../components/ui/ChartCard';
import { EmptyState } from '../components/ui/EmptyState';
import { KPICard } from '../components/ui/KPICard';
import { useData } from '../contexts/DataContext';
import { formatCurrency, formatDate } from '../utils';
import type { Expense, ExpenseCategory } from '../types';

const categories: ExpenseCategory[] = ['Maintenance', 'Toll', 'Insurance', 'Repair', 'Parking', 'Fuel', 'Others'];
const categoryColors: Record<ExpenseCategory, string> = {
  Maintenance: 'rgb(var(--color-warning))', Toll: 'rgb(var(--color-info))', Insurance: 'rgb(var(--color-primary))',
  Repair: 'rgb(var(--color-danger))', Parking: 'rgb(var(--color-accent))', Fuel: 'rgb(var(--color-success))', Others: 'rgb(var(--color-subtle))',
};
const categoryTones: Record<ExpenseCategory, 'warning' | 'info' | 'primary' | 'danger' | 'neutral' | 'success'> = {
  Maintenance: 'warning', Toll: 'info', Insurance: 'primary', Repair: 'danger', Parking: 'neutral', Fuel: 'success', Others: 'neutral',
};

const emptyForm = { category: 'Maintenance' as ExpenseCategory, description: '', amount: 0, vehicleId: '', date: new Date().toISOString().split('T')[0], vendor: '' };

export function ExpensesPage() {
  const { expenses, vehicles, addExpense, deleteExpense } = useData();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const matchSearch = !search || e.description.toLowerCase().includes(search.toLowerCase()) || e.vendor.toLowerCase().includes(search.toLowerCase());
      const matchCat = !catFilter || e.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [expenses, search, catFilter]);

  const stats = useMemo(() => ({
    total: expenses.reduce((s, e) => s + e.amount, 0),
    byCategory: categories.map((cat) => ({ category: cat, amount: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0) })).filter((c) => c.amount > 0),
    count: expenses.length,
    avg: expenses.length > 0 ? expenses.reduce((s, e) => s + e.amount, 0) / expenses.length : 0,
  }), [expenses]);

  const openAdd = () => { setForm(emptyForm); setFormError(''); setModalOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.description) { setFormError('Description is required.'); return; }
    if (form.amount <= 0) { setFormError('Amount must be greater than zero.'); return; }
    addExpense({ ...form, vehicleId: form.vehicleId || null, date: new Date(form.date).toISOString() });
    setModalOpen(false);
  };

  const columns: Column<Expense>[] = [
    {
      key: 'description', header: 'Description', sortValue: (e) => e.description,
      render: (e) => (
        <div className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0">
            <Receipt size={16} className="text-muted" />
          </span>
          <div><p className="font-medium text-fg">{e.description}</p><p className="text-xs text-muted">{e.vendor}</p></div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', sortValue: (e) => e.category, render: (e) => <Badge tone={categoryTones[e.category]} dot>{e.category}</Badge> },
    { key: 'vehicle', header: 'Vehicle', sortValue: (e) => vehicles.find((v) => v.id === e.vehicleId)?.name ?? '', hideOnMobile: true, render: (e) => <span className="text-muted">{e.vehicleId ? vehicles.find((v) => v.id === e.vehicleId)?.name ?? '—' : 'Fleet-wide'}</span> },
    { key: 'date', header: 'Date', sortValue: (e) => e.date, hideOnMobile: true, render: (e) => <span className="text-muted">{formatDate(e.date)}</span> },
    { key: 'amount', header: 'Amount', sortValue: (e) => e.amount, render: (e) => <span className="font-semibold">{formatCurrency(e.amount)}</span> },
    {
      key: 'actions', header: '', className: 'text-right',
      render: (e) => <button onClick={(ev) => { ev.stopPropagation(); setDeleteTarget(e); }} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-danger-soft transition-colors ml-auto"><Trash2 size={16} /></button>,
    },
  ];

  return (
    <Layout breadcrumb={[{ label: 'Expenses' }]}>
      <PageHeader title="Expenses" description={`${expenses.length} expense records`} actions={<Button icon={<Plus size={16} />} onClick={openAdd}>Add Expense</Button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard label="Total Expenses" value={formatCurrency(stats.total)} icon={DollarSign} tone="danger" delay={0} />
        <KPICard label="Records" value={String(stats.count)} icon={Receipt} tone="info" delay={0.05} />
        <KPICard label="Average" value={formatCurrency(stats.avg)} icon={DollarSign} tone="warning" delay={0.1} />
        <KPICard label="Categories" value={String(stats.byCategory.length)} icon={Receipt} tone="primary" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <ChartCard title="Expenses by Category" description="Current period breakdown" className="lg:col-span-2" delay={0.2}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.byCategory} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} width={80} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                {stats.byCategory.map((entry, i) => <Cell key={i} fill={categoryColors[entry.category as ExpenseCategory]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Split" description="Proportion of spend" delay={0.25}>
          <div className="space-y-3">
            {stats.byCategory.sort((a, b) => b.amount - a.amount).map((cat) => {
              const pct = (cat.amount / stats.total) * 100;
              return (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-fg flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: categoryColors[cat.category as ExpenseCategory] }} />
                      {cat.category}
                    </span>
                    <span className="text-sm font-medium text-fg">{formatCurrency(cat.amount)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: categoryColors[cat.category as ExpenseCategory] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input placeholder="Search by description or vendor..." icon={<Search size={16} />} value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <Button variant="outline" icon={<Filter size={16} />} onClick={() => setShowFilters((v) => !v)}>Filters {catFilter && <span className="h-2 w-2 rounded-full bg-primary ml-1" />}</Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-end gap-3 mb-4 p-4 bg-surface border border-border rounded-2xl animate-slide-up">
          <Select label="Category" placeholder="All categories" value={catFilter} onChange={(e) => setCatFilter(e.target.value)} options={categories.map((c) => ({ value: c, label: c }))} className="w-44" />
          {catFilter && <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={() => setCatFilter('')}>Clear</Button>}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl"><EmptyState icon={Receipt} title="No expenses found" description="Record an expense to start tracking costs." action={<Button icon={<Plus size={16} />} onClick={openAdd}>Add Expense</Button>} /></div>
      ) : (
        <DataTable columns={columns} data={filtered} rowKey={(e) => e.id} pageSize={10} />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Expense" description="Record a new expense" size="lg"
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit as unknown as () => void}>Add Expense</Button></>}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <div className="bg-danger-soft text-danger text-sm px-3 py-2 rounded-lg">{formError}</div>}
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ExpenseCategory })} options={categories.map((c) => ({ value: c, label: c }))} />
            <Input label="Amount ($)" type="number" value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: +e.target.value })} placeholder="1200" />
            <Input label="Vendor" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} placeholder="Supplier name" />
            <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Select label="Vehicle (optional)" placeholder="Fleet-wide" value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} options={vehicles.map((v) => ({ value: v.id, label: `${v.name} (${v.registration})` }))} />
          </div>
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the expense..." rows={2} />
          <button type="submit" className="hidden" />
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteTarget && deleteExpense(deleteTarget.id)} title="Delete Expense" message={`Delete "${deleteTarget?.description}"? This cannot be undone.`} confirmLabel="Delete" danger />
    </Layout>
  );
}
