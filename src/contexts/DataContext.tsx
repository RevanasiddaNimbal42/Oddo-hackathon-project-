import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Vehicle, Driver, Trip, MaintenanceRecord, FuelLog, Expense, AppNotification, Activity } from '../types';
import {
  seedVehicles, seedDrivers, seedTrips, seedMaintenance, seedFuelLogs, seedExpenses,
  seedNotifications, seedActivities,
} from '../data/seed';
import {
  canAssignVehicle, canAssignDriver, canCarryCargo, dispatchTripSideEffects,
  completeTripSideEffects, cancelTripSideEffects, startMaintenanceSideEffects,
  completeMaintenanceSideEffects, canStartMaintenance, isRegistrationUnique,
} from '../utils/businessRules';
import { generateId } from '../utils';

type ToastType = 'success' | 'warning' | 'error' | 'info';
interface Toast { id: string; type: ToastType; message: string; }

interface DataContextValue {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  maintenance: MaintenanceRecord[];
  fuelLogs: FuelLog[];
  expenses: Expense[];
  notifications: AppNotification[];
  activities: Activity[];
  toasts: Toast[];
  addVehicle: (v: Omit<Vehicle, 'id' | 'createdAt'>) => { success: boolean; error?: string };
  updateVehicle: (id: string, patch: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addDriver: (d: Omit<Driver, 'id' | 'hiredAt' | 'tripsCompleted' | 'totalDistanceKm'>) => void;
  updateDriver: (id: string, patch: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  createTrip: (t: Omit<Trip, 'id' | 'code' | 'status' | 'dispatchedAt' | 'completedAt' | 'createdAt' | 'timeline'>) => { success: boolean; error?: string; trip?: Trip };
  dispatchTrip: (tripId: string) => { success: boolean; error?: string };
  completeTrip: (tripId: string) => { success: boolean; error?: string };
  cancelTrip: (tripId: string) => void;
  addMaintenance: (m: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'startedAt' | 'completedAt' | 'actualCost' | 'status'>) => { success: boolean; error?: string };
  startMaintenance: (id: string) => { success: boolean; error?: string };
  completeMaintenance: (id: string, actualCost: number) => void;
  addFuelLog: (f: Omit<FuelLog, 'id' | 'totalCost'>) => void;
  addExpense: (e: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  pushToast: (type: ToastType, message: string) => void;
  dismissToast: (id: string) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(seedVehicles);
  const [drivers, setDrivers] = useState<Driver[]>(seedDrivers);
  const [trips, setTrips] = useState<Trip[]>(seedTrips);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>(seedMaintenance);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(seedFuelLogs);
  const [expenses, setExpenses] = useState<Expense[]>(seedExpenses);
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications);
  const [activities, setActivities] = useState<Activity[]>(seedActivities);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback((type: ToastType, message: string) => {
    const id = generateId('toast');
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushActivity = useCallback((icon: Activity['icon'], title: string, description: string) => {
    setActivities((prev) => [
      { id: generateId('a'), icon, title, description, timestamp: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const pushNotification = useCallback((type: AppNotification['type'], title: string, message: string) => {
    setNotifications((prev) => [
      { id: generateId('n'), type, title, message, timestamp: new Date().toISOString(), read: false },
      ...prev,
    ]);
  }, []);

  // ---- Vehicle CRUD ----
  const addVehicle: DataContextValue['addVehicle'] = (v) => {
    if (!isRegistrationUnique(v.registration, vehicles)) {
      return { success: false, error: `Registration "${v.registration}" already exists. Vehicle registrations must be unique.` };
    }
    const newV: Vehicle = { ...v, id: generateId('v'), createdAt: new Date().toISOString() };
    setVehicles((prev) => [newV, ...prev]);
    pushActivity('truck', 'Vehicle Added', `${newV.name} (${newV.registration}) added to fleet`);
    pushToast('success', `Vehicle ${newV.name} added successfully`);
    return { success: true };
  };

  const updateVehicle: DataContextValue['updateVehicle'] = (id, patch) => {
    if (patch.registration && !isRegistrationUnique(patch.registration, vehicles, id)) {
      pushToast('error', `Registration "${patch.registration}" already exists.`);
      return;
    }
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
    pushToast('success', 'Vehicle updated');
  };

  const deleteVehicle: DataContextValue['deleteVehicle'] = (id) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    pushToast('success', 'Vehicle removed from fleet');
  };

  // ---- Driver CRUD ----
  const addDriver: DataContextValue['addDriver'] = (d) => {
    const newD: Driver = { ...d, id: generateId('d'), hiredAt: new Date().toISOString(), tripsCompleted: 0, totalDistanceKm: 0 };
    setDrivers((prev) => [newD, ...prev]);
    pushActivity('user', 'Driver Added', `${newD.name} joined the team`);
    pushToast('success', `Driver ${newD.name} added successfully`);
  };

  const updateDriver: DataContextValue['updateDriver'] = (id, patch) => {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    pushToast('success', 'Driver updated');
  };

  const deleteDriver: DataContextValue['deleteDriver'] = (id) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id));
    pushToast('success', 'Driver removed');
  };

  // ---- Trip operations with business rules ----
  const createTrip: DataContextValue['createTrip'] = (t) => {
    const vehicle = vehicles.find((v) => v.id === t.vehicleId);
    const driver = drivers.find((d) => d.id === t.driverId);
    if (!vehicle || !driver) return { success: false, error: 'Vehicle or driver not found.' };

    const vCheck = canAssignVehicle(vehicle, trips);
    if (!vCheck.valid) return { success: false, error: vCheck.error };

    const dCheck = canAssignDriver(driver, trips);
    if (!dCheck.valid) return { success: false, error: dCheck.error };

    const cCheck = canCarryCargo(vehicle, t.cargoWeightKg);
    if (!cCheck.valid) return { success: false, error: cCheck.error };

    const code = `TRP-2024-${String(trips.length + 1).padStart(3, '0')}`;
    const newTrip: Trip = {
      ...t, id: generateId('t'), code, status: 'Draft', dispatchedAt: null, completedAt: null,
      createdAt: new Date().toISOString(),
      timeline: [{ id: generateId('e'), label: 'Trip created', timestamp: new Date().toISOString(), type: 'created' }],
    };
    setTrips((prev) => [newTrip, ...prev]);
    pushActivity('route', 'Trip Draft Created', `${code}: ${t.source} → ${t.destination}`);
    pushNotification('info', 'New Trip Draft', `${code} is awaiting dispatch.`);
    pushToast('success', `Trip ${code} created as draft`);
    return { success: true, trip: newTrip };
  };

  const dispatchTrip: DataContextValue['dispatchTrip'] = (tripId) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return { success: false, error: 'Trip not found.' };
    if (trip.status !== 'Draft') return { success: false, error: 'Only draft trips can be dispatched.' };

    const vehicle = vehicles.find((v) => v.id === trip.vehicleId);
    const driver = drivers.find((d) => d.id === trip.driverId);
    if (!vehicle || !driver) return { success: false, error: 'Vehicle or driver not found.' };

    const vCheck = canAssignVehicle(vehicle, trips);
    if (!vCheck.valid) return { success: false, error: vCheck.error };
    const dCheck = canAssignDriver(driver, trips);
    if (!dCheck.valid) return { success: false, error: dCheck.error };

    const { vehicle: newV, driver: newD } = dispatchTripSideEffects(vehicle, driver);
    setVehicles((prev) => prev.map((v) => (v.id === newV.id ? newV : v)));
    setDrivers((prev) => prev.map((d) => (d.id === newD.id ? newD : d)));
    setTrips((prev) => prev.map((t) => t.id === tripId ? {
      ...t, status: 'Dispatched', dispatchedAt: new Date().toISOString(),
      timeline: [...t.timeline, { id: generateId('e'), label: 'Dispatched', timestamp: new Date().toISOString(), type: 'dispatched' }],
    } : t));
    pushActivity('route', 'Trip Dispatched', `${trip.code}: ${trip.source} → ${trip.destination}`);
    pushToast('success', `${trip.code} dispatched. Vehicle & driver set to On Trip.`);
    return { success: true };
  };

  const completeTrip: DataContextValue['completeTrip'] = (tripId) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return { success: false, error: 'Trip not found.' };
    if (trip.status !== 'Dispatched') return { success: false, error: 'Only dispatched trips can be completed.' };

    const vehicle = vehicles.find((v) => v.id === trip.vehicleId);
    const driver = drivers.find((d) => d.id === trip.driverId);
    if (!vehicle || !driver) return { success: false, error: 'Vehicle or driver not found.' };

    const { vehicle: newV, driver: newD } = completeTripSideEffects(vehicle, driver, trip.distanceKm);
    setVehicles((prev) => prev.map((v) => (v.id === newV.id ? newV : v)));
    setDrivers((prev) => prev.map((d) => (d.id === newD.id ? newD : d)));
    setTrips((prev) => prev.map((t) => t.id === tripId ? {
      ...t, status: 'Completed', completedAt: new Date().toISOString(),
      timeline: [...t.timeline, { id: generateId('e'), label: 'Completed', timestamp: new Date().toISOString(), type: 'completed' }],
    } : t));
    pushActivity('check', 'Trip Completed', `${trip.code}: ${trip.source} → ${trip.destination}`);
    pushNotification('success', 'Trip Completed', `${trip.code} completed successfully. Vehicle & driver available again.`);
    pushToast('success', `${trip.code} completed. Vehicle & driver available.`);
    return { success: true };
  };

  const cancelTrip: DataContextValue['cancelTrip'] = (tripId) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;
    const vehicle = vehicles.find((v) => v.id === trip.vehicleId);
    const driver = drivers.find((d) => d.id === trip.driverId);
    if (vehicle && driver) {
      const { vehicle: newV, driver: newD } = cancelTripSideEffects(vehicle, driver);
      setVehicles((prev) => prev.map((v) => (v.id === newV.id ? newV : v)));
      setDrivers((prev) => prev.map((d) => (d.id === newD.id ? newD : d)));
    }
    setTrips((prev) => prev.map((t) => t.id === tripId ? {
      ...t, status: 'Cancelled',
      timeline: [...t.timeline, { id: generateId('e'), label: 'Cancelled', timestamp: new Date().toISOString(), type: 'cancelled' }],
    } : t));
    pushToast('info', `${trip.code} cancelled. Resources released.`);
  };

  // ---- Maintenance with business rules ----
  const addMaintenance: DataContextValue['addMaintenance'] = (m) => {
    const vehicle = vehicles.find((v) => v.id === m.vehicleId);
    if (!vehicle) return { success: false, error: 'Vehicle not found.' };
    const newM: MaintenanceRecord = {
      ...m, id: generateId('m'), status: 'Open', actualCost: null,
      createdAt: new Date().toISOString(), startedAt: null, completedAt: null,
    };
    setMaintenance((prev) => [newM, ...prev]);
    pushActivity('wrench', 'Maintenance Logged', `${vehicle.name}: ${m.issue}`);
    pushToast('success', 'Maintenance record created');
    return { success: true };
  };

  const startMaintenance: DataContextValue['startMaintenance'] = (id) => {
    const record = maintenance.find((m) => m.id === id);
    if (!record) return { success: false, error: 'Record not found.' };
    const vehicle = vehicles.find((v) => v.id === record.vehicleId);
    if (!vehicle) return { success: false, error: 'Vehicle not found.' };
    const check = canStartMaintenance(vehicle);
    if (!check.valid) return { success: false, error: check.error };

    setVehicles((prev) => prev.map((v) => (v.id === vehicle.id ? startMaintenanceSideEffects(v) : v)));
    setMaintenance((prev) => prev.map((m) => m.id === id ? {
      ...m, status: 'In Progress', startedAt: new Date().toISOString(),
    } : m));
    pushActivity('wrench', 'Maintenance Started', `${vehicle.name} moved to shop`);
    pushToast('warning', `${vehicle.name} is now In Shop.`);
    return { success: true };
  };

  const completeMaintenance: DataContextValue['completeMaintenance'] = (id, actualCost) => {
    const record = maintenance.find((m) => m.id === id);
    if (!record) return;
    const vehicle = vehicles.find((v) => v.id === record.vehicleId);
    if (vehicle) {
      setVehicles((prev) => prev.map((v) => (v.id === vehicle.id ? completeMaintenanceSideEffects(v) : v)));
    }
    setMaintenance((prev) => prev.map((m) => m.id === id ? {
      ...m, status: 'Completed', actualCost, completedAt: new Date().toISOString(),
    } : m));
    if (vehicle) {
      pushActivity('wrench', 'Maintenance Completed', `${vehicle.name} back in service`);
      pushToast('success', `${vehicle.name} maintenance complete. Vehicle available.`);
    }
  };

  // ---- Fuel & Expenses ----
  const addFuelLog: DataContextValue['addFuelLog'] = (f) => {
    const totalCost = +(f.quantityLiters * f.costPerLiter).toFixed(2);
    setFuelLogs((prev) => [{ ...f, id: generateId('f'), totalCost }, ...prev]);
    pushActivity('fuel', 'Fuel Log Added', `${f.quantityLiters}L refueled`);
    pushToast('success', 'Fuel entry recorded');
  };

  const addExpense: DataContextValue['addExpense'] = (e) => {
    setExpenses((prev) => [{ ...e, id: generateId('x') }, ...prev]);
    pushActivity('dollar', 'Expense Recorded', `${e.description}: $${e.amount}`);
    pushToast('success', 'Expense recorded');
  };

  const deleteExpense: DataContextValue['deleteExpense'] = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    pushToast('success', 'Expense deleted');
  };

  // ---- Notifications ----
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };
  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <DataContext.Provider value={{
      vehicles, drivers, trips, maintenance, fuelLogs, expenses, notifications, activities, toasts,
      addVehicle, updateVehicle, deleteVehicle, addDriver, updateDriver, deleteDriver,
      createTrip, dispatchTrip, completeTrip, cancelTrip,
      addMaintenance, startMaintenance, completeMaintenance,
      addFuelLog, addExpense, deleteExpense,
      markNotificationRead, markAllNotificationsRead, pushToast, dismissToast,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
