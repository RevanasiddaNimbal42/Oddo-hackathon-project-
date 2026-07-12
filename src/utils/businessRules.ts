import type { Vehicle, Driver, Trip } from '../types';
import { isExpired } from '../utils';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function canAssignVehicle(vehicle: Vehicle, trips: Trip[]): ValidationResult {
  if (vehicle.status === 'In Shop') {
    return { valid: false, error: `${vehicle.name} is in maintenance and cannot be assigned to a trip.` };
  }
  if (vehicle.status === 'Retired') {
    return { valid: false, error: `${vehicle.name} is retired and cannot be assigned to a trip.` };
  }
  if (vehicle.status === 'On Trip') {
    return { valid: false, error: `${vehicle.name} is already on an active trip.` };
  }
  const hasActiveTrip = trips.some(
    (t) => t.vehicleId === vehicle.id && (t.status === 'Dispatched' || t.status === 'Draft'),
  );
  if (hasActiveTrip) {
    return { valid: false, error: `${vehicle.name} is already assigned to an active trip.` };
  }
  return { valid: true };
}

export function canAssignDriver(driver: Driver, trips: Trip[]): ValidationResult {
  if (driver.status === 'Suspended') {
    return { valid: false, error: `${driver.name} is suspended and cannot be assigned.` };
  }
  if (driver.status === 'On Trip') {
    return { valid: false, error: `${driver.name} is already on an active trip.` };
  }
  if (driver.status === 'Off Duty') {
    return { valid: false, error: `${driver.name} is off duty and cannot be assigned.` };
  }
  if (isExpired(driver.licenseExpiry)) {
    return { valid: false, error: `${driver.name}'s license has expired and cannot be assigned.` };
  }
  const hasActiveTrip = trips.some(
    (t) => t.driverId === driver.id && (t.status === 'Dispatched' || t.status === 'Draft'),
  );
  if (hasActiveTrip) {
    return { valid: false, error: `${driver.name} is already assigned to an active trip.` };
  }
  return { valid: true };
}

export function canCarryCargo(vehicle: Vehicle, cargoWeightKg: number): ValidationResult {
  if (cargoWeightKg <= 0) {
    return { valid: false, error: 'Cargo weight must be greater than zero.' };
  }
  if (cargoWeightKg > vehicle.maxCapacityKg) {
    return {
      valid: false,
      error: `Cargo (${cargoWeightKg} kg) exceeds ${vehicle.name}'s capacity (${vehicle.maxCapacityKg} kg).`,
    };
  }
  return { valid: true };
}

export function isRegistrationUnique(registration: string, vehicles: Vehicle[], excludeId?: string): boolean {
  return !vehicles.some((v) => v.registration.toLowerCase() === registration.toLowerCase() && v.id !== excludeId);
}

export function canStartMaintenance(vehicle: Vehicle): ValidationResult {
  if (vehicle.status === 'Retired') {
    return { valid: false, error: 'Cannot start maintenance on a retired vehicle.' };
  }
  if (vehicle.status === 'On Trip') {
    return { valid: false, error: `${vehicle.name} is on a trip. Complete the trip before maintenance.` };
  }
  return { valid: true };
}

export function dispatchTripSideEffects(
  vehicle: Vehicle,
  driver: Driver,
): { vehicle: Vehicle; driver: Driver } {
  return {
    vehicle: { ...vehicle, status: 'On Trip' },
    driver: { ...driver, status: 'On Trip' },
  };
}

export function completeTripSideEffects(
  vehicle: Vehicle,
  driver: Driver,
  distanceKm: number,
): { vehicle: Vehicle; driver: Driver } {
  return {
    vehicle: { ...vehicle, status: 'Available', odometer: vehicle.odometer + distanceKm },
    driver: {
      ...driver,
      status: 'Available',
      tripsCompleted: driver.tripsCompleted + 1,
      totalDistanceKm: driver.totalDistanceKm + distanceKm,
    },
  };
}

export function startMaintenanceSideEffects(vehicle: Vehicle): Vehicle {
  return { ...vehicle, status: 'In Shop' };
}

export function completeMaintenanceSideEffects(vehicle: Vehicle): Vehicle {
  return { ...vehicle, status: 'Available', lastService: new Date().toISOString() };
}

export function cancelTripSideEffects(vehicle: Vehicle, driver: Driver): { vehicle: Vehicle; driver: Driver } {
  return {
    vehicle: vehicle.status === 'On Trip' ? { ...vehicle, status: 'Available' } : vehicle,
    driver: driver.status === 'On Trip' ? { ...driver, status: 'Available' } : driver,
  };
}
