import { Link } from 'react-router-dom';
import { Mail, Shield, Calendar, MapPin, Bell, Settings as SettingsIcon, Pencil, LogOut } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const { activities, trips } = useData();

  if (!user) return null;

  const myTrips = trips.filter((t) => t.status === 'Completed').length;
  const recentActivities = activities.slice(0, 5);

  const info = [
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Shield, label: 'Role', value: user.role },
    { icon: Calendar, label: 'Member Since', value: 'January 2024' },
    { icon: MapPin, label: 'Location', value: 'San Francisco, CA' },
  ];

  const rolePermissions: Record<string, string[]> = {
    'Fleet Manager': ['Full fleet access', 'Manage vehicles & drivers', 'View all reports', 'Manage expenses', 'Configure settings'],
    'Dispatcher': ['Create & dispatch trips', 'View vehicles & drivers', 'Track active trips', 'View trip reports'],
    'Safety Officer': ['Manage drivers', 'Track maintenance', 'View safety reports', 'License monitoring'],
    'Financial Analyst': ['View expenses', 'Generate financial reports', 'View analytics', 'Export reports'],
  };

  return (
    <Layout breadcrumb={[{ label: 'Profile' }]}>
      {/* Profile Header */}
      <Card className="mb-6 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-accent relative">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, white 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }} />
        </div>
        <CardContent className="relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <Avatar name={user.name} hue={user.avatarHue} size="lg" className="ring-4 ring-surface" />
            <div className="flex-1 sm:pb-2">
              <h1 className="text-xl font-bold text-fg">{user.name}</h1>
              <p className="text-sm text-muted">{user.email}</p>
            </div>
            <div className="flex items-center gap-2 sm:pb-2">
              <Link to="/settings"><Button variant="outline" size="sm" icon={<Pencil size={14} />}>Edit Profile</Button></Link>
              <Link to="/settings"><Button variant="ghost" size="sm" icon={<SettingsIcon size={14} />}>Settings</Button></Link>
              <Button variant="ghost" size="sm" icon={<LogOut size={14} />} onClick={logout}>Sign Out</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column: Info + Permissions */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Information</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {info.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0">
                    <item.icon size={15} className="text-muted" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-subtle">{item.label}</p>
                    <p className="text-sm font-medium text-fg truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Role & Permissions</CardTitle></CardHeader>
            <CardContent>
              <Badge tone="primary" dot className="mb-3">{user.role}</Badge>
              <div className="space-y-2">
                {(rolePermissions[user.role] ?? []).map((perm) => (
                  <div key={perm} className="flex items-center gap-2 text-sm text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" /> {perm}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Stats + Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Trips Managed', value: String(myTrips) },
              { label: 'Activities', value: String(activities.length) },
              { label: 'Role', value: user.role.split(' ')[0] },
            ].map((s) => (
              <Card key={s.label} className="p-4 text-center">
                <p className="text-2xl font-bold text-fg">{s.value}</p>
                <p className="text-xs text-muted mt-1">{s.label}</p>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-primary" />
                <CardTitle>Recent Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 py-2 border-b border-border-soft last:border-0">
                    <span className="h-8 w-8 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">●</span>
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-fg">{act.title}</p>
                      <p className="text-xs text-muted">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
