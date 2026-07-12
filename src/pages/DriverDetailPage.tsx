import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Users, Route, Phone, Mail, Shield, Calendar, TrendingUp, Pencil } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { StatusBadge, Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Tabs } from '../components/ui/Tabs';
import { Timeline } from '../components/ui/Timeline';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { useData } from '../contexts/DataContext';
import { formatDate, formatNumber, daysUntil } from '../utils';

export function DriverDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { drivers, trips, vehicles } = useData();
  const driver = drivers.find((d) => d.id === id);

  if (!driver) {
    return (
      <Layout breadcrumb={[{ label: 'Drivers', path: '/drivers' }, { label: 'Not Found' }]}>
        <EmptyState icon={Users} title="Driver not found" description="This driver may have been removed." action={<Link to="/drivers"><Button variant="outline">Back to Drivers</Button></Link>} />
      </Layout>
    );
  }

  const driverTrips = trips.filter((t) => t.driverId === driver.id);
  const completedTrips = driverTrips.filter((t) => t.status === 'Completed');
  const activeTrips = driverTrips.filter((t) => t.status === 'Dispatched');
  const licenseDays = daysUntil(driver.licenseExpiry);
  const licenseExpired = licenseDays < 0;

  const stats = [
    { label: 'Trips Completed', value: formatNumber(driver.tripsCompleted), icon: Route },
    { label: 'Total Distance', value: `${formatNumber(driver.totalDistanceKm)} km`, icon: TrendingUp },
    { label: 'Safety Score', value: String(driver.safetyScore), icon: Shield },
    { label: 'Years Active', value: String(Math.floor((Date.now() - new Date(driver.hiredAt).getTime()) / (365 * 86400000))) + ' yr', icon: Calendar },
  ];

  const tripTimeline = driverTrips
    .flatMap((t) => t.timeline)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)
    .map((e) => ({ label: e.label, timestamp: e.timestamp, type: (e.type === 'cancelled' ? 'cancelled' : e.type === 'completed' ? 'completed' : e.type === 'dispatched' ? 'dispatched' : 'created') as 'created' | 'dispatched' | 'completed' | 'cancelled' }));

  return (
    <Layout breadcrumb={[{ label: 'Drivers', path: '/drivers' }, { label: driver.name }]}>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/drivers')}>Back</Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar name={driver.name} hue={driver.avatarHue} size="lg" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-fg tracking-tight">{driver.name}</h1>
              <StatusBadge status={driver.status} />
            </div>
            <p className="text-sm text-muted mt-1">{driver.licenseNumber} · Category {driver.licenseCategory} · Hired {formatDate(driver.hiredAt)}</p>
          </div>
        </div>
        <Button variant="outline" icon={<Pencil size={16} />} onClick={() => navigate('/drivers')}>Edit Driver</Button>
      </div>

      {/* License Alert */}
      {licenseExpired && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-danger-soft border border-danger/30">
          <Shield size={20} className="text-danger" />
          <p className="text-sm text-danger font-medium">This driver's license has expired and cannot be assigned to trips.</p>
        </div>
      )}
      {!licenseExpired && licenseDays <= 30 && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-warning-soft border border-warning/30">
          <Calendar size={20} className="text-warning" />
          <p className="text-sm text-warning font-medium">License expires in {licenseDays} days. Please schedule renewal.</p>
        </div>
      )}

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
                  <CardHeader><CardTitle>Driver Information</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Phone size={16} className="text-subtle" /> <span className="text-fg">{driver.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail size={16} className="text-subtle" /> <span className="text-fg">{driver.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Shield size={16} className="text-subtle" /> <span className="text-fg">License {driver.licenseNumber} · Cat {driver.licenseCategory}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar size={16} className="text-subtle" /> <span className={licenseExpired ? 'text-danger font-medium' : 'text-fg'}>Expires {formatDate(driver.licenseExpiry)}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Safety & Performance</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted flex items-center gap-2"><Shield size={14} /> Safety Score</span>
                        <span className="text-sm font-semibold text-fg">{driver.safetyScore}/100</span>
                      </div>
                      <ProgressBar value={driver.safetyScore} tone={driver.safetyScore >= 90 ? 'success' : driver.safetyScore >= 75 ? 'primary' : 'warning'} />
                      <div className="mt-2">
                        {driver.safetyScore >= 90 ? <Badge tone="success" dot>Excellent safety record</Badge> : driver.safetyScore >= 75 ? <Badge tone="info" dot>Good standing</Badge> : <Badge tone="warning" dot>Needs improvement</Badge>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-surface-2">
                        <p className="text-xs text-muted">Active Trips</p>
                        <p className="text-lg font-bold text-fg mt-1">{activeTrips.length}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-2">
                        <p className="text-xs text-muted">Completed</p>
                        <p className="text-lg font-bold text-fg mt-1">{completedTrips.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ),
          },
          {
            id: 'trips', label: `Trips (${driverTrips.length})`,
            content: (
              <Card>
                {driverTrips.length === 0 ? (
                  <EmptyState icon={Route} title="No trips yet" description="This driver hasn't been assigned to any trips." />
                ) : (
                  <div className="divide-y divide-border-soft">
                    {driverTrips.map((t) => {
                      const vehicle = vehicles.find((v) => v.id === t.vehicleId);
                      return (
                        <div key={t.id} className="flex items-center gap-4 px-5 py-3.5">
                          <span className="h-9 w-9 rounded-xl bg-primary-soft flex items-center justify-center flex-shrink-0">
                            <Route size={16} className="text-primary" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-fg">{t.source} → {t.destination}</p>
                            <p className="text-xs text-muted">{t.code} · {vehicle?.name} · {formatDate(t.createdAt)}</p>
                          </div>
                          <StatusBadge status={t.status} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            ),
          },
          {
            id: 'timeline', label: 'Timeline',
            content: (
              <Card>
                <CardContent>
                  {tripTimeline.length === 0 ? (
                    <EmptyState icon={Calendar} title="No activity yet" description="Timeline will populate as trips are created." />
                  ) : (
                    <Timeline items={tripTimeline} />
                  )}
                </CardContent>
              </Card>
            ),
          },
        ]}
      />
    </Layout>
  );
}
