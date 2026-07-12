import { useState } from 'react';
import { Palette, Bell, Globe, Clock, Shield, User, Check, Moon, Sun } from 'lucide-react';
import { Layout, PageHeader } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../utils';

export function SettingsPage() {
  const { theme, setTheme, themes } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({ email: true, push: true, tripUpdates: true, maintenanceAlerts: true, licenseExpiry: true, weeklyReport: false });
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('America/New_York');

  return (
    <Layout breadcrumb={[{ label: 'Settings' }]}>
      <PageHeader title="Settings" description="Manage your account preferences and system configuration" />

      <Tabs tabs={[
        {
          id: 'appearance', label: 'Appearance', icon: <Palette size={16} />,
          content: (
            <Card>
              <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted mb-4">Choose your preferred color theme. Changes apply instantly across the entire application.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {themes.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => setTheme(t.name)}
                      className={cn(
                        'relative p-4 rounded-xl border-2 transition-all text-left',
                        theme === t.name ? 'border-primary shadow-glow' : 'border-border hover:border-border-soft',
                      )}
                    >
                      <span className="flex items-center gap-3 mb-3">
                        <span className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: t.color }}>
                          {t.name === 'dark' ? <Moon size={18} className="text-white" /> : <Sun size={18} className="text-white" />}
                        </span>
                        <span className="text-sm font-medium text-fg">{t.label}</span>
                      </span>
                      <div className="flex gap-1.5">
                        <span className="h-6 w-6 rounded-md" style={{ backgroundColor: t.color }} />
                        <span className="h-6 w-6 rounded-md bg-surface-2 border border-border" />
                        <span className="h-6 w-6 rounded-md bg-surface border border-border" />
                      </div>
                      {theme === t.name && (
                        <span className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check size={12} className="text-primary-fg" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ),
        },
        {
          id: 'notifications', label: 'Notifications', icon: <Bell size={16} />,
          content: (
            <Card>
              <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'push', label: 'Push Notifications', desc: 'Receive real-time browser notifications' },
                  { key: 'tripUpdates', label: 'Trip Updates', desc: 'Get notified when trips are dispatched or completed' },
                  { key: 'maintenanceAlerts', label: 'Maintenance Alerts', desc: 'Alerts for vehicle maintenance status changes' },
                  { key: 'licenseExpiry', label: 'License Expiry Reminders', desc: 'Warnings before driver licenses expire' },
                  { key: 'weeklyReport', label: 'Weekly Summary Report', desc: 'A weekly digest of fleet performance' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-fg">{item.label}</p>
                      <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      className={cn(
                        'relative h-6 w-11 rounded-full transition-colors',
                        notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-border',
                      )}
                    >
                      <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform', notifications[item.key as keyof typeof notifications] ? 'left-[22px]' : 'left-0.5')} />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ),
        },
        {
          id: 'localization', label: 'Localization', icon: <Globe size={16} />,
          content: (
            <Card>
              <CardHeader><CardTitle>Language & Timezone</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select label="Language" value={language} onChange={(e) => setLanguage(e.target.value)} options={[
                    { value: 'en', label: 'English' }, { value: 'es', label: 'Spanish' }, { value: 'fr', label: 'French' }, { value: 'de', label: 'German' }, { value: 'zh', label: 'Chinese' },
                  ]} />
                  <Select label="Timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} options={[
                    { value: 'America/New_York', label: 'Eastern (EST)' }, { value: 'America/Chicago', label: 'Central (CST)' }, { value: 'America/Denver', label: 'Mountain (MST)' }, { value: 'America/Los_Angeles', label: 'Pacific (PST)' }, { value: 'Europe/London', label: 'London (GMT)' }, { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
                  ]} />
                </div>
                <div className="mt-4 p-3 rounded-xl bg-surface-2 flex items-center gap-2 text-sm text-muted">
                  <Clock size={16} /> Current time: {new Date().toLocaleString(language, { timeZone: timezone })}
                </div>
              </CardContent>
            </Card>
          ),
        },
        {
          id: 'security', label: 'Security', icon: <Shield size={16} />,
          content: (
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4 max-w-md">
                    <Input label="Current Password" type="password" placeholder="Enter current password" />
                    <Input label="New Password" type="password" placeholder="Enter new password" />
                    <Input label="Confirm New Password" type="password" placeholder="Re-enter new password" />
                    <Button>Update Password</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Two-Factor Authentication</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-fg">2FA Status</p>
                      <p className="text-xs text-muted mt-0.5">Add an extra layer of security to your account</p>
                    </div>
                    <Badge tone="warning" dot>Not Enabled</Badge>
                  </div>
                  <Button variant="outline" className="mt-4">Enable 2FA</Button>
                </CardContent>
              </Card>
            </div>
          ),
        },
        {
          id: 'account', label: 'Account', icon: <User size={16} />,
          content: (
            <Card>
              <CardHeader><CardTitle>Account Information</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                  <Input label="Full Name" defaultValue={user?.name} />
                  <Input label="Email" defaultValue={user?.email} />
                  <Input label="Role" defaultValue={user?.role} disabled />
                  <Input label="Member Since" defaultValue="Jan 2024" disabled />
                </div>
                <div className="mt-6">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          ),
        },
      ]} />
    </Layout>
  );
}
