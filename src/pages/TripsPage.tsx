import { useState, useMemo } from 'react';
import { Plus, Search, Route, Filter, X, MapPin, Truck, Users, Package, Check, Play, CheckCircle2, XCircle, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Layout, PageHeader } from '../components/layout/Layout';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Drawer } from '../components/ui/Drawer';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { StatusBadge, Badge } from '../components/ui/Badge';
import { Stepper } from '../components/ui/Stepper';
import { Timeline } from '../components/ui/Timeline';
import { EmptyState } from '../components/ui/EmptyState';
import { useData } from '../contexts/DataContext';
import { formatCurrency, formatNumber, formatDate } from '../utils';
import { canAssignVehicle, canAssignDriver } from '../utils/businessRules';
import type { Trip } from '../types';

export function TripsPage() {
  const { trips, vehicles, drivers, createTrip, dispatchTrip, completeTrip, cancelTrip } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [detailTrip, setDetailTrip] = useState<Trip | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<Trip | null>(null);
  const [wizardError, setWizardError] = useState('');

  // Wizard state
  const [step, setStep] = useState(0);
  const [wSource, setWSource] = useState('');
  const [wDestination, setWDestination] = useState('');
  const [wVehicleId, setWVehicleId] = useState('');
  const [wDriverId, setWDriverId] = useState('');
  const [wCargoDesc, setWCargoDesc] = useState('');
  const [wCargoWeight, setWCargoWeight] = useState(0);
  const [wDistance, setWDistance] = useState(0);
  const [wRevenue, setWRevenue] = useState(0);

  const filtered = useMemo(() => {
    return trips.filter((t) => {
      const matchSearch = !search || t.code.toLowerCase().includes(search.toLowerCase()) || t.source.toLowerCase().includes(search.toLowerCase()) || t.destination.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [trips, search, statusFilter]);

  const availableVehicles = vehicles.filter((v) => {
    const check = canAssignVehicle(v, trips);
    return check.valid;
  });
  const availableDrivers = drivers.filter((d) => {
    const check = canAssignDriver(d, trips);
    return check.valid;
  });

  const resetWizard = () => {
    setStep(0); setWSource(''); setWDestination(''); setWVehicleId(''); setWDriverId('');
    setWCargoDesc(''); setWCargoWeight(0); setWDistance(0); setWRevenue(0); setWizardError('');
  };

  const openWizard = () => { resetWizard(); setWizardOpen(true); };

  const nextStep = () => {
    setWizardError('');
    if (step === 0 && (!wSource || !wDestination)) { setWizardError('Source and destination are required.'); return; }
    if (step === 1 && !wVehicleId) { setWizardError('Please select a vehicle.'); return; }
    if (step === 2 && !wDriverId) { setWizardError('Please select a driver.'); return; }
    if (step === 3 && (wCargoWeight <= 0 || !wCargoDesc)) { setWizardError('Cargo description and weight are required.'); return; }
    setStep((s) => Math.min(s + 1, 4));
  };

  const handleCreate = () => {
    setWizardError('');
    const result = createTrip({
      source: wSource, destination: wDestination, vehicleId: wVehicleId, driverId: wDriverId,
      cargoDescription: wCargoDesc, cargoWeightKg: wCargoWeight, distanceKm: wDistance, estimatedRevenue: wRevenue,
    });
    if (!result.success) { setWizardError(result.error ?? 'Failed to create trip.'); return; }
    setWizardOpen(false);
    resetWizard();
  };

  const handleDispatch = (trip: Trip) => {
    const result = dispatchTrip(trip.id);
    if (!result.success) return;
    setDetailTrip(null);
  };

  const handleComplete = (trip: Trip) => {
    completeTrip(trip.id);
    setDetailTrip(null);
  };

  const selectedVehicle = vehicles.find((v) => v.id === wVehicleId);
  const selectedDriver = drivers.find((d) => d.id === wDriverId);

  const wizardSteps = [
    { id: 'route', label: 'Route', icon: <MapPin size={16} /> },
    { id: 'vehicle', label: 'Vehicle', icon: <Truck size={16} /> },
    { id: 'driver', label: 'Driver', icon: <Users size={16} /> },
    { id: 'cargo', label: 'Cargo', icon: <Package size={16} /> },
    { id: 'summary', label: 'Summary', icon: <Check size={16} /> },
  ];

  const columns: Column<Trip>[] = [
    {
      key: 'code', header: 'Trip', sortValue: (t) => t.code,
      render: (t) => (
        <div className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-xl bg-primary-soft flex items-center justify-center flex-shrink-0">
            <Route size={16} className="text-primary" />
          </span>
          <div>
            <p className="font-medium text-fg">{t.code}</p>
            <p className="text-xs text-muted">{t.source} → {t.destination}</p>
          </div>
        </div>
      ),
    },
    { key: 'vehicle', header: 'Vehicle', sortValue: (t) => vehicles.find((v) => v.id === t.vehicleId)?.name ?? '', hideOnMobile: true, render: (t) => <span className="text-muted">{vehicles.find((v) => v.id === t.vehicleId)?.name ?? '—'}</span> },
    { key: 'driver', header: 'Driver', sortValue: (t) => drivers.find((d) => d.id === t.driverId)?.name ?? '', hideOnMobile: true, render: (t) => <span className="text-muted">{drivers.find((d) => d.id === t.driverId)?.name ?? '—'}</span> },
    { key: 'distance', header: 'Distance', sortValue: (t) => t.distanceKm, render: (t) => <span className="text-muted">{formatNumber(t.distanceKm)} km</span> },
    { key: 'revenue', header: 'Revenue', sortValue: (t) => t.estimatedRevenue, hideOnMobile: true, render: (t) => <span className="font-medium">{formatCurrency(t.estimatedRevenue)}</span> },
    { key: 'status', header: 'Status', sortValue: (t) => t.status, render: (t) => <StatusBadge status={t.status} /> },
    { key: 'created', header: 'Created', sortValue: (t) => t.createdAt, hideOnMobile: true, render: (t) => <span className="text-muted">{formatDate(t.createdAt)}</span> },
  ];

  const tripStatuses = ['Draft', 'Dispatched', 'Completed', 'Cancelled'];
  const detailVehicle = detailTrip ? vehicles.find((v) => v.id === detailTrip.vehicleId) : null;
  const detailDriver = detailTrip ? drivers.find((d) => d.id === detailTrip.driverId) : null;

  return (
    <Layout breadcrumb={[{ label: 'Trips' }]}>
      <PageHeader title="Trips" description={`${trips.length} trips · ${trips.filter((t) => t.status === 'Dispatched').length} active`} actions={<Button icon={<Plus size={16} />} onClick={openWizard}>New Trip</Button>} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input placeholder="Search by code, source, or destination..." icon={<Search size={16} />} value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <Button variant="outline" icon={<Filter size={16} />} onClick={() => setShowFilters((v) => !v)}>Filters {statusFilter && <span className="h-2 w-2 rounded-full bg-primary ml-1" />}</Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-end gap-3 mb-4 p-4 bg-surface border border-border rounded-2xl animate-slide-up">
          <Select label="Status" placeholder="All statuses" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={tripStatuses.map((s) => ({ value: s, label: s }))} className="w-40" />
          {statusFilter && <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={() => setStatusFilter('')}>Clear</Button>}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl"><EmptyState icon={Route} title="No trips found" description="Create your first trip to get started." action={<Button icon={<Plus size={16} />} onClick={openWizard}>New Trip</Button>} /></div>
      ) : (
        <DataTable columns={columns} data={filtered} rowKey={(t) => t.id} onRowClick={(t) => setDetailTrip(t)} pageSize={10} />
      )}

      {/* Trip Creation Wizard Modal */}
      <Modal open={wizardOpen} onClose={() => setWizardOpen(false)} title="Create New Trip" description="Follow the steps to dispatch a new trip" size="xl">
        <div className="space-y-6">
          <Stepper steps={wizardSteps} current={step} onStepClick={(i) => i < step && setStep(i)} />

          {wizardError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-danger-soft text-danger text-sm">
              <AlertTriangle size={16} /> {wizardError}
            </div>
          )}

          {/* Step 0: Route */}
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Source Location" value={wSource} onChange={(e) => setWSource(e.target.value)} icon={<MapPin size={16} />} placeholder="New York, NY" />
                <Input label="Destination Location" value={wDestination} onChange={(e) => setWDestination(e.target.value)} icon={<MapPin size={16} />} placeholder="Boston, MA" />
              </div>
              <Input label="Estimated Distance (km)" type="number" value={wDistance || ''} onChange={(e) => setWDistance(+e.target.value)} placeholder="350" />
              <Input label="Estimated Revenue ($)" type="number" value={wRevenue || ''} onChange={(e) => setWRevenue(+e.target.value)} placeholder="4800" />
            </div>
          )}

          {/* Step 1: Vehicle */}
          {step === 1 && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-sm text-muted">Select an available vehicle. Only vehicles that are available and not on a trip can be selected.</p>
              {availableVehicles.length === 0 ? (
                <div className="p-6 text-center bg-warning-soft rounded-xl">
                  <p className="text-sm text-warning font-medium">No vehicles available for assignment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                  {vehicles.map((v) => {
                    const check = canAssignVehicle(v, trips);
                    const isSelected = wVehicleId === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => check.valid && setWVehicleId(v.id)}
                        disabled={!check.valid}
                        className={`text-left p-4 rounded-xl border transition-all ${isSelected ? 'border-primary bg-primary-soft' : check.valid ? 'border-border hover:border-primary/50 hover:bg-surface-2' : 'border-border opacity-50 cursor-not-allowed'}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="h-9 w-9 rounded-xl bg-primary-soft flex items-center justify-center"><Truck size={16} className="text-primary" /></span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-fg">{v.name}</p>
                            <p className="text-xs text-muted">{v.registration}</p>
                          </div>
                          <StatusBadge status={v.status} dot={false} />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted">
                          <span>{v.type}</span>
                          <span>·</span>
                          <span>Cap: {formatNumber(v.maxCapacityKg)} kg</span>
                        </div>
                        {!check.valid && <p className="text-xs text-danger mt-2">{check.error}</p>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Driver */}
          {step === 2 && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-sm text-muted">Select an available driver with a valid license.</p>
              {availableDrivers.length === 0 ? (
                <div className="p-6 text-center bg-warning-soft rounded-xl">
                  <p className="text-sm text-warning font-medium">No drivers available for assignment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                  {drivers.map((d) => {
                    const check = canAssignDriver(d, trips);
                    const isSelected = wDriverId === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => check.valid && setWDriverId(d.id)}
                        disabled={!check.valid}
                        className={`text-left p-4 rounded-xl border transition-all ${isSelected ? 'border-primary bg-primary-soft' : check.valid ? 'border-border hover:border-primary/50 hover:bg-surface-2' : 'border-border opacity-50 cursor-not-allowed'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="h-9 w-9 rounded-full bg-primary-soft flex items-center justify-center text-xs font-bold text-primary">{d.name.split(' ').map((n) => n[0]).join('')}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-fg">{d.name}</p>
                            <p className="text-xs text-muted">{d.licenseNumber} · Safety: {d.safetyScore}</p>
                          </div>
                          <StatusBadge status={d.status} dot={false} />
                        </div>
                        {!check.valid && <p className="text-xs text-danger mt-2">{check.error}</p>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Cargo */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              {selectedVehicle && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-info-soft text-info text-sm">
                  <Package size={16} /> Selected vehicle capacity: {formatNumber(selectedVehicle.maxCapacityKg)} kg
                </div>
              )}
              <Textarea label="Cargo Description" value={wCargoDesc} onChange={(e) => setWCargoDesc(e.target.value)} placeholder="e.g. Electronics pallets, Construction materials..." rows={3} />
              <Input label="Cargo Weight (kg)" type="number" value={wCargoWeight || ''} onChange={(e) => setWCargoWeight(+e.target.value)} placeholder="18500" hint={selectedVehicle && wCargoWeight > 0 ? (wCargoWeight > selectedVehicle.maxCapacityKg ? `Exceeds capacity by ${formatNumber(wCargoWeight - selectedVehicle.maxCapacityKg)} kg` : `${formatNumber(selectedVehicle.maxCapacityKg - wCargoWeight)} kg capacity remaining`) : undefined} />
            </div>
          )}

          {/* Step 4: Summary */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-surface-2">
                <h4 className="text-sm font-semibold text-fg mb-3">Trip Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-xs text-subtle mb-0.5">Route</p><p className="font-medium text-fg">{wSource} → {wDestination}</p></div>
                  <div><p className="text-xs text-subtle mb-0.5">Distance</p><p className="font-medium text-fg">{formatNumber(wDistance)} km</p></div>
                  <div><p className="text-xs text-subtle mb-0.5">Vehicle</p><p className="font-medium text-fg">{selectedVehicle?.name} ({selectedVehicle?.registration})</p></div>
                  <div><p className="text-xs text-subtle mb-0.5">Driver</p><p className="font-medium text-fg">{selectedDriver?.name}</p></div>
                  <div><p className="text-xs text-subtle mb-0.5">Cargo</p><p className="font-medium text-fg">{wCargoDesc}</p></div>
                  <div><p className="text-xs text-subtle mb-0.5">Weight</p><p className="font-medium text-fg">{formatNumber(wCargoWeight)} kg / {formatNumber(selectedVehicle?.maxCapacityKg ?? 0)} kg</p></div>
                  <div><p className="text-xs text-subtle mb-0.5">Est. Revenue</p><p className="font-medium text-fg">{formatCurrency(wRevenue)}</p></div>
                  <div><p className="text-xs text-subtle mb-0.5">Status</p><Badge tone="neutral" dot>Draft</Badge></div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-info-soft text-info text-sm">
                <Check size={16} /> Trip will be created as a Draft. You can dispatch it from the trips list.
              </div>
            </div>
          )}

          {/* Wizard Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border-soft">
            <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={() => step > 0 ? setStep(step - 1) : setWizardOpen(false)}>
              {step > 0 ? 'Back' : 'Cancel'}
            </Button>
            {step < 4 ? (
              <Button icon={<ArrowRight size={16} />} onClick={nextStep}>Continue</Button>
            ) : (
              <Button icon={<Check size={16} />} onClick={handleCreate}>Create Trip</Button>
            )}
          </div>
        </div>
      </Modal>

      {/* Trip Detail Drawer */}
      <Drawer
        open={!!detailTrip}
        onClose={() => setDetailTrip(null)}
        title={detailTrip?.code}
        description={detailTrip ? `${detailTrip.source} → ${detailTrip.destination}` : ''}
        width="max-w-lg"
        footer={
          detailTrip && (
            <div className="flex items-center gap-2">
              {detailTrip.status === 'Draft' && <Button icon={<Play size={16} />} onClick={() => handleDispatch(detailTrip)}>Dispatch Trip</Button>}
              {detailTrip.status === 'Dispatched' && <Button variant="success" icon={<CheckCircle2 size={16} />} onClick={() => handleComplete(detailTrip)}>Mark Complete</Button>}
              {(detailTrip.status === 'Draft' || detailTrip.status === 'Dispatched') && <Button variant="outline" icon={<XCircle size={16} />} onClick={() => setConfirmCancel(detailTrip)}>Cancel Trip</Button>}
            </div>
          )
        }
      >
        {detailTrip && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <StatusBadge status={detailTrip.status} dot />
              <span className="text-sm text-muted">Created {formatDate(detailTrip.createdAt)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-surface-2">
                <p className="text-xs text-subtle mb-1">Distance</p>
                <p className="text-sm font-semibold text-fg">{formatNumber(detailTrip.distanceKm)} km</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-2">
                <p className="text-xs text-subtle mb-1">Revenue</p>
                <p className="text-sm font-semibold text-fg">{formatCurrency(detailTrip.estimatedRevenue)}</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-2">
                <p className="text-xs text-subtle mb-1">Cargo</p>
                <p className="text-sm font-semibold text-fg">{detailTrip.cargoDescription}</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-2">
                <p className="text-xs text-subtle mb-1">Weight</p>
                <p className="text-sm font-semibold text-fg">{formatNumber(detailTrip.cargoWeightKg)} kg</p>
              </div>
            </div>

            {detailVehicle && (
              <div>
                <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-2">Vehicle</p>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2">
                  <span className="h-9 w-9 rounded-xl bg-primary-soft flex items-center justify-center"><Truck size={16} className="text-primary" /></span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-fg">{detailVehicle.name}</p>
                    <p className="text-xs text-muted">{detailVehicle.registration} · {detailVehicle.type}</p>
                  </div>
                  <StatusBadge status={detailVehicle.status} dot={false} />
                </div>
              </div>
            )}

            {detailDriver && (
              <div>
                <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-2">Driver</p>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2">
                  <span className="h-9 w-9 rounded-full bg-primary-soft flex items-center justify-center text-xs font-bold text-primary">{detailDriver.name.split(' ').map((n) => n[0]).join('')}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-fg">{detailDriver.name}</p>
                    <p className="text-xs text-muted">{detailDriver.licenseNumber} · Safety: {detailDriver.safetyScore}</p>
                  </div>
                  <StatusBadge status={detailDriver.status} dot={false} />
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-3">Timeline</p>
              <Timeline items={detailTrip.timeline.map((e) => ({ label: e.label, timestamp: e.timestamp, type: e.type }))} />
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!confirmCancel}
        onClose={() => setConfirmCancel(null)}
        onConfirm={() => { if (confirmCancel) { cancelTrip(confirmCancel.id); setDetailTrip(null); } }}
        title="Cancel Trip"
        message={`Are you sure you want to cancel ${confirmCancel?.code}? The vehicle and driver will be released back to available status.`}
        confirmLabel="Cancel Trip"
        danger
      />
    </Layout>
  );
}
