import type { Role } from '../types';
import {
  LayoutDashboard, Truck, Users, Route, Wrench, Fuel, Receipt, FileText, BarChart3,
  Settings, User, type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  roles: Role[] | 'all';
  badge?: 'trips' | 'maintenance';
}

export const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: 'all' },
  { path: '/vehicles', label: 'Vehicles', icon: Truck, roles: 'all' },
  { path: '/drivers', label: 'Drivers', icon: Users, roles: 'all' },
  { path: '/trips', label: 'Trips', icon: Route, roles: 'all', badge: 'trips' },
  { path: '/maintenance', label: 'Maintenance', icon: Wrench, roles: ['Fleet Manager', 'Safety Officer', 'Dispatcher'], badge: 'maintenance' },
  { path: '/fuel', label: 'Fuel Logs', icon: Fuel, roles: 'all' },
  { path: '/expenses', label: 'Expenses', icon: Receipt, roles: ['Fleet Manager', 'Financial Analyst'] },
  { path: '/reports', label: 'Reports', icon: FileText, roles: ['Fleet Manager', 'Financial Analyst', 'Safety Officer'] },
  { path: '/analytics', label: 'Analytics', icon: BarChart3, roles: ['Fleet Manager', 'Financial Analyst'] },
  { path: '/settings', label: 'Settings', icon: Settings, roles: 'all' },
  { path: '/profile', label: 'Profile', icon: User, roles: 'all' },
];

export function getNavItemsForRole(role: Role): NavItem[] {
  return navItems.filter((item) => item.roles === 'all' || item.roles.includes(role));
}
