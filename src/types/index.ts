export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Retired';
export type DriverStatus = 'Available' | 'On Trip' | 'Off Duty' | 'Suspended';
export type TripStatus = 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled';
export type MaintenanceStatus = 'Open' | 'In Progress' | 'Completed';
export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type ExpenseCategory = 'Maintenance' | 'Toll' | 'Insurance' | 'Repair' | 'Parking' | 'Fuel' | 'Others';
export type Role = 'Fleet Manager' | 'Dispatcher' | 'Safety Officer' | 'Financial Analyst';
export type ThemeName = 'light' | 'dark' | 'purple' | 'emerald' | 'ocean' | 'sunset';

export interface Vehicle {
  id: string;
  registration: string;
  name: string;
  type: 'Truck' | 'Van' | 'Bus' | 'Refrigerated' | 'Flatbed' | 'Tanker' | 'Box';
  maxCapacityKg: number;
  odometer: number;
  acquisitionCost: number;
  status: VehicleStatus;
  fuelType: 'Diesel' | 'Petrol' | 'Electric' | 'Hybrid';
  year: number;
  lastService: string;
  createdAt: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: 'A' | 'B' | 'C' | 'C1' | 'C+E' | 'D' | 'D1';
  licenseExpiry: string;
  phone: string;
  email: string;
  safetyScore: number;
  status: DriverStatus;
  hiredAt: string;
  tripsCompleted: number;
  totalDistanceKm: number;
  avatarHue: number;
}

export interface Trip {
  id: string;
  code: string;
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoDescription: string;
  cargoWeightKg: number;
  distanceKm: number;
  status: TripStatus;
  estimatedRevenue: number;
  dispatchedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  timeline: TripEvent[];
}

export interface TripEvent {
  id: string;
  label: string;
  timestamp: string;
  type: 'created' | 'dispatched' | 'completed' | 'cancelled';
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  issue: string;
  priority: MaintenancePriority;
  mechanic: string;
  estimatedCost: number;
  actualCost: number | null;
  status: MaintenanceStatus;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  notes: string;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  driverId: string;
  date: string;
  quantityLiters: number;
  costPerLiter: number;
  totalCost: number;
  odometerAtFill: number;
  mileageKm: number;
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  vehicleId: string | null;
  date: string;
  vendor: string;
}

export interface AppNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarHue: number;
}

export interface Activity {
  id: string;
  icon: 'truck' | 'user' | 'route' | 'wrench' | 'fuel' | 'dollar' | 'alert' | 'check';
  title: string;
  description: string;
  timestamp: string;
}
