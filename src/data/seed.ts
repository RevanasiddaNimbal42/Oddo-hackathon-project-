import type {
  Vehicle,
  Driver,
  Trip,
  MaintenanceRecord,
  FuelLog,
  Expense,
  AppNotification,
  Activity,
} from '../types';

const now = new Date();
const iso = (daysAgo: number) =>
  new Date(now.getTime() - daysAgo * 86400000).toISOString();
const future = (daysAhead: number) =>
  new Date(now.getTime() + daysAhead * 86400000).toISOString();

export const seedVehicles: Vehicle[] = [
  { id: 'v1', registration: 'TRK-4501', name: 'Falcon Heavy', type: 'Truck', maxCapacityKg: 24000, odometer: 184250, acquisitionCost: 185000, status: 'On Trip', fuelType: 'Diesel', year: 2022, lastService: iso(45), createdAt: iso(400) },
  { id: 'v2', registration: 'VAN-2203', name: 'Swift Courier', type: 'Van', maxCapacityKg: 3500, odometer: 92800, acquisitionCost: 58000, status: 'Available', fuelType: 'Petrol', year: 2023, lastService: iso(20), createdAt: iso(300) },
  { id: 'v3', registration: 'REF-7705', name: 'Polar Express', type: 'Refrigerated', maxCapacityKg: 18000, odometer: 312000, acquisitionCost: 240000, status: 'In Shop', fuelType: 'Diesel', year: 2020, lastService: iso(5), createdAt: iso(600) },
  { id: 'v4', registration: 'FLT-8801', name: 'Flatbed Titan', type: 'Flatbed', maxCapacityKg: 40000, odometer: 221500, acquisitionCost: 210000, status: 'Available', fuelType: 'Diesel', year: 2021, lastService: iso(60), createdAt: iso(500) },
  { id: 'v5', registration: 'TNK-1190', name: 'Aqua Carrier', type: 'Tanker', maxCapacityKg: 28000, odometer: 156000, acquisitionCost: 268000, status: 'Available', fuelType: 'Diesel', year: 2022, lastService: iso(30), createdAt: iso(380) },
  { id: 'v6', registration: 'BOX-3344', name: 'Cargo Master', type: 'Box', maxCapacityKg: 15000, odometer: 198400, acquisitionCost: 142000, status: 'On Trip', fuelType: 'Diesel', year: 2021, lastService: iso(15), createdAt: iso(450) },
  { id: 'v7', registration: 'BUS-5567', name: 'Commuter Pro', type: 'Bus', maxCapacityKg: 5000, odometer: 287000, acquisitionCost: 320000, status: 'Available', fuelType: 'Hybrid', year: 2019, lastService: iso(10), createdAt: iso(700) },
  { id: 'v8', registration: 'TRK-9921', name: 'Road Warrior', type: 'Truck', maxCapacityKg: 24000, odometer: 412000, acquisitionCost: 175000, status: 'Retired', fuelType: 'Diesel', year: 2017, lastService: iso(120), createdAt: iso(900) },
  { id: 'v9', registration: 'VAN-4408', name: 'City Sprinter', type: 'Van', maxCapacityKg: 3500, odometer: 67200, acquisitionCost: 62000, status: 'Available', fuelType: 'Electric', year: 2024, lastService: iso(8), createdAt: iso(150) },
  { id: 'v10', registration: 'REF-2231', name: 'Frost Liner', type: 'Refrigerated', maxCapacityKg: 20000, odometer: 145300, acquisitionCost: 255000, status: 'Available', fuelType: 'Diesel', year: 2023, lastService: iso(25), createdAt: iso(280) },
  { id: 'v11', registration: 'FLT-6677', name: 'Deck King', type: 'Flatbed', maxCapacityKg: 38000, odometer: 178900, acquisitionCost: 198000, status: 'In Shop', fuelType: 'Diesel', year: 2020, lastService: iso(3), createdAt: iso(520) },
  { id: 'v12', registration: 'BOX-9988', name: 'Parcel Giant', type: 'Box', maxCapacityKg: 12000, odometer: 89400, acquisitionCost: 135000, status: 'Available', fuelType: 'Diesel', year: 2023, lastService: iso(18), createdAt: iso(260) },
];

export const seedDrivers: Driver[] = [
  { id: 'd1', name: 'Marcus Chen', licenseNumber: 'DL-445210', licenseCategory: 'C+E', licenseExpiry: future(210), phone: '+1 555-0142', email: 'marcus.chen@transitops.com', safetyScore: 94, status: 'On Trip', hiredAt: iso(500), tripsCompleted: 412, totalDistanceKm: 284000, avatarHue: 210 },
  { id: 'd2', name: 'Sofia Ramirez', licenseNumber: 'DL-339871', licenseCategory: 'C', licenseExpiry: future(15), phone: '+1 555-0288', email: 'sofia.ramirez@transitops.com', safetyScore: 88, status: 'Available', hiredAt: iso(380), tripsCompleted: 287, totalDistanceKm: 198000, avatarHue: 340 },
  { id: 'd3', name: 'James O\'Connor', licenseNumber: 'DL-778542', licenseCategory: 'C+E', licenseExpiry: future(365), phone: '+1 555-0356', email: 'james.oconnor@transitops.com', safetyScore: 91, status: 'Available', hiredAt: iso(450), tripsCompleted: 356, totalDistanceKm: 241000, avatarHue: 150 },
  { id: 'd4', name: 'Priya Patel', licenseNumber: 'DL-112034', licenseCategory: 'C1', licenseExpiry: future(-5), phone: '+1 555-0421', email: 'priya.patel@transitops.com', safetyScore: 76, status: 'Off Duty', hiredAt: iso(290), tripsCompleted: 198, totalDistanceKm: 142000, avatarHue: 280 },
  { id: 'd5', name: 'Kwame Asante', licenseNumber: 'DL-665098', licenseCategory: 'C', licenseExpiry: future(180), phone: '+1 555-0533', email: 'kwame.asante@transitops.com', safetyScore: 95, status: 'Available', hiredAt: iso(420), tripsCompleted: 378, totalDistanceKm: 267000, avatarHue: 45 },
  { id: 'd6', name: 'Elena Volkov', licenseNumber: 'DL-889123', licenseCategory: 'D', licenseExpiry: future(95), phone: '+1 555-0612', email: 'elena.volkov@transitops.com', safetyScore: 82, status: 'Suspended', hiredAt: iso(310), tripsCompleted: 224, totalDistanceKm: 156000, avatarHue: 10 },
  { id: 'd7', name: 'David Kim', licenseNumber: 'DL-554301', licenseCategory: 'C+E', licenseExpiry: future(280), phone: '+1 555-0745', email: 'david.kim@transitops.com', safetyScore: 90, status: 'Available', hiredAt: iso(360), tripsCompleted: 301, totalDistanceKm: 212000, avatarHue: 190 },
  { id: 'd8', name: 'Amara Johnson', licenseNumber: 'DL-220187', licenseCategory: 'C', licenseExpiry: future(140), phone: '+1 555-0823', email: 'amara.johnson@transitops.com', safetyScore: 87, status: 'Available', hiredAt: iso(240), tripsCompleted: 167, totalDistanceKm: 118000, avatarHue: 320 },
  { id: 'd9', name: 'Liam Murphy', licenseNumber: 'DL-996543', licenseCategory: 'C1', licenseExpiry: future(60), phone: '+1 555-0901', email: 'liam.murphy@transitops.com', safetyScore: 79, status: 'On Trip', hiredAt: iso(180), tripsCompleted: 134, totalDistanceKm: 89000, avatarHue: 100 },
  { id: 'd10', name: 'Yuki Tanaka', licenseNumber: 'DL-773209', licenseCategory: 'C+E', licenseExpiry: future(320), phone: '+1 555-1022', email: 'yuki.tanaka@transitops.com', safetyScore: 93, status: 'Available', hiredAt: iso(340), tripsCompleted: 345, totalDistanceKm: 234000, avatarHue: 260 },
];

export const seedTrips: Trip[] = [
  {
    id: 't1', code: 'TRP-2024-001', source: 'New York, NY', destination: 'Boston, MA',
    vehicleId: 'v1', driverId: 'd1', cargoDescription: 'Electronics pallets', cargoWeightKg: 18500,
    distanceKm: 350, status: 'Dispatched', estimatedRevenue: 4800, dispatchedAt: iso(1),
    completedAt: null, createdAt: iso(2),
    timeline: [
      { id: 'e1', label: 'Trip created', timestamp: iso(2), type: 'created' },
      { id: 'e2', label: 'Dispatched', timestamp: iso(1), type: 'dispatched' },
    ],
  },
  {
    id: 't2', code: 'TRP-2024-002', source: 'Los Angeles, CA', destination: 'Phoenix, AZ',
    vehicleId: 'v6', driverId: 'd9', cargoDescription: 'Construction materials', cargoWeightKg: 11200,
    distanceKm: 600, status: 'Dispatched', estimatedRevenue: 6200, dispatchedAt: iso(1),
    completedAt: null, createdAt: iso(3),
    timeline: [
      { id: 'e3', label: 'Trip created', timestamp: iso(3), type: 'created' },
      { id: 'e4', label: 'Dispatched', timestamp: iso(1), type: 'dispatched' },
    ],
  },
  {
    id: 't3', code: 'TRP-2024-003', source: 'Chicago, IL', destination: 'Detroit, MI',
    vehicleId: 'v4', driverId: 'd3', cargoDescription: 'Auto parts', cargoWeightKg: 22000,
    distanceKm: 280, status: 'Completed', estimatedRevenue: 3400, dispatchedAt: iso(10),
    completedAt: iso(8), createdAt: iso(12),
    timeline: [
      { id: 'e5', label: 'Trip created', timestamp: iso(12), type: 'created' },
      { id: 'e6', label: 'Dispatched', timestamp: iso(10), type: 'dispatched' },
      { id: 'e7', label: 'Completed', timestamp: iso(8), type: 'completed' },
    ],
  },
  {
    id: 't4', code: 'TRP-2024-004', source: 'Houston, TX', destination: 'Dallas, TX',
    vehicleId: 'v2', driverId: 'd8', cargoDescription: 'Medical supplies', cargoWeightKg: 2800,
    distanceKm: 380, status: 'Completed', estimatedRevenue: 2900, dispatchedAt: iso(15),
    completedAt: iso(13), createdAt: iso(17),
    timeline: [
      { id: 'e8', label: 'Trip created', timestamp: iso(17), type: 'created' },
      { id: 'e9', label: 'Dispatched', timestamp: iso(15), type: 'dispatched' },
      { id: 'e10', label: 'Completed', timestamp: iso(13), type: 'completed' },
    ],
  },
  {
    id: 't5', code: 'TRP-2024-005', source: 'Seattle, WA', destination: 'Portland, OR',
    vehicleId: 'v5', driverId: 'd5', cargoDescription: 'Chemical liquids', cargoWeightKg: 24500,
    distanceKm: 280, status: 'Completed', estimatedRevenue: 4100, dispatchedAt: iso(20),
    completedAt: iso(18), createdAt: iso(22),
    timeline: [
      { id: 'e11', label: 'Trip created', timestamp: iso(22), type: 'created' },
      { id: 'e12', label: 'Dispatched', timestamp: iso(20), type: 'dispatched' },
      { id: 'e13', label: 'Completed', timestamp: iso(18), type: 'completed' },
    ],
  },
  {
    id: 't6', code: 'TRP-2024-006', source: 'Miami, FL', destination: 'Atlanta, GA',
    vehicleId: 'v10', driverId: 'd10', cargoDescription: 'Frozen food', cargoWeightKg: 16000,
    distanceKm: 660, status: 'Completed', estimatedRevenue: 5600, dispatchedAt: iso(28),
    completedAt: iso(25), createdAt: iso(30),
    timeline: [
      { id: 'e14', label: 'Trip created', timestamp: iso(30), type: 'created' },
      { id: 'e15', label: 'Dispatched', timestamp: iso(28), type: 'dispatched' },
      { id: 'e16', label: 'Completed', timestamp: iso(25), type: 'completed' },
    ],
  },
  {
    id: 't7', code: 'TRP-2024-007', source: 'Denver, CO', destination: 'Salt Lake City, UT',
    vehicleId: 'v7', driverId: 'd7', cargoDescription: 'Passenger service', cargoWeightKg: 3200,
    distanceKm: 530, status: 'Cancelled', estimatedRevenue: 0, dispatchedAt: null,
    completedAt: null, createdAt: iso(5),
    timeline: [
      { id: 'e17', label: 'Trip created', timestamp: iso(5), type: 'created' },
      { id: 'e18', label: 'Cancelled', timestamp: iso(4), type: 'cancelled' },
    ],
  },
  {
    id: 't8', code: 'TRP-2024-008', source: 'San Francisco, CA', destination: 'Las Vegas, NV',
    vehicleId: 'v12', driverId: 'd2', cargoDescription: 'Retail goods', cargoWeightKg: 9500,
    distanceKm: 920, status: 'Draft', estimatedRevenue: 7200, dispatchedAt: null,
    completedAt: null, createdAt: iso(0),
    timeline: [
      { id: 'e19', label: 'Trip created', timestamp: iso(0), type: 'created' },
    ],
  },
];

export const seedMaintenance: MaintenanceRecord[] = [
  { id: 'm1', vehicleId: 'v3', issue: 'Refrigeration compressor failure', priority: 'Critical', mechanic: 'Tom Bradley', estimatedCost: 8500, actualCost: null, status: 'In Progress', createdAt: iso(6), startedAt: iso(5), completedAt: null, notes: 'Compressor ordered, awaiting delivery.' },
  { id: 'm2', vehicleId: 'v11', issue: 'Brake pad replacement + rotor resurfacing', priority: 'High', mechanic: 'Sarah Lin', estimatedCost: 2200, actualCost: null, status: 'In Progress', createdAt: iso(4), startedAt: iso(3), completedAt: null, notes: 'Front axle brakes.' },
  { id: 'm3', vehicleId: 'v9', issue: 'Battery cell replacement (EV)', priority: 'Medium', mechanic: 'Tom Bradley', estimatedCost: 4200, actualCost: null, status: 'Open', createdAt: iso(2), startedAt: null, completedAt: null, notes: 'Scheduled for next service bay.' },
  { id: 'm4', vehicleId: 'v1', issue: 'Oil change + filter replacement', priority: 'Low', mechanic: 'Sarah Lin', estimatedCost: 480, actualCost: 450, status: 'Completed', createdAt: iso(50), startedAt: iso(45), completedAt: iso(44), notes: 'Routine service completed.' },
  { id: 'm5', vehicleId: 'v6', issue: 'Transmission fluid leak', priority: 'High', mechanic: 'Mike Davis', estimatedCost: 3100, actualCost: 2950, status: 'Completed', createdAt: iso(30), startedAt: iso(28), completedAt: iso(26), notes: 'Seal replaced, no further leaks.' },
  { id: 'm6', vehicleId: 'v7', issue: 'Hybrid battery diagnostic', priority: 'Medium', mechanic: 'Tom Bradley', estimatedCost: 1500, actualCost: 1200, status: 'Completed', createdAt: iso(20), startedAt: iso(12), completedAt: iso(10), notes: 'Software recalibration resolved issue.' },
];

export const seedFuelLogs: FuelLog[] = [
  { id: 'f1', vehicleId: 'v1', driverId: 'd1', date: iso(1), quantityLiters: 320, costPerLiter: 1.45, totalCost: 464, odometerAtFill: 184250, mileageKm: 5.8 },
  { id: 'f2', vehicleId: 'v6', driverId: 'd9', date: iso(1), quantityLiters: 280, costPerLiter: 1.42, totalCost: 397.6, odometerAtFill: 198400, mileageKm: 6.1 },
  { id: 'f3', vehicleId: 'v4', driverId: 'd3', date: iso(8), quantityLiters: 350, costPerLiter: 1.48, totalCost: 518, odometerAtFill: 221500, mileageKm: 5.5 },
  { id: 'f4', vehicleId: 'v2', driverId: 'd8', date: iso(13), quantityLiters: 95, costPerLiter: 1.52, totalCost: 144.4, odometerAtFill: 92800, mileageKm: 8.2 },
  { id: 'f5', vehicleId: 'v5', driverId: 'd5', date: iso(18), quantityLiters: 380, costPerLiter: 1.45, totalCost: 551, odometerAtFill: 156000, mileageKm: 5.2 },
  { id: 'f6', vehicleId: 'v10', driverId: 'd10', date: iso(25), quantityLiters: 290, costPerLiter: 1.47, totalCost: 426.3, odometerAtFill: 145300, mileageKm: 5.9 },
  { id: 'f7', vehicleId: 'v1', driverId: 'd1', date: iso(35), quantityLiters: 310, costPerLiter: 1.44, totalCost: 446.4, odometerAtFill: 180950, mileageKm: 5.6 },
  { id: 'f8', vehicleId: 'v6', driverId: 'd9', date: iso(40), quantityLiters: 270, costPerLiter: 1.41, totalCost: 380.7, odometerAtFill: 195600, mileageKm: 6.3 },
  { id: 'f9', vehicleId: 'v9', driverId: 'd8', date: iso(10), quantityLiters: 0, costPerLiter: 0, totalCost: 28, odometerAtFill: 67200, mileageKm: 0 },
  { id: 'f10', vehicleId: 'v12', driverId: 'd2', date: iso(3), quantityLiters: 240, costPerLiter: 1.46, totalCost: 350.4, odometerAtFill: 89400, mileageKm: 6.5 },
];

export const seedExpenses: Expense[] = [
  { id: 'x1', category: 'Maintenance', description: 'Refrigeration compressor', amount: 8500, vehicleId: 'v3', date: iso(5), vendor: 'ColdChain Parts' },
  { id: 'x2', category: 'Toll', description: 'I-95 corridor tolls', amount: 340, vehicleId: 'v1', date: iso(1), vendor: 'EZ-Pass' },
  { id: 'x3', category: 'Insurance', description: 'Monthly fleet insurance premium', amount: 12500, vehicleId: null, date: iso(3), vendor: 'Guardian Insurance' },
  { id: 'x4', category: 'Repair', description: 'Brake pad replacement', amount: 2200, vehicleId: 'v11', date: iso(3), vendor: 'FastFit Auto' },
  { id: 'x5', category: 'Fuel', description: 'Diesel refuel - Falcon Heavy', amount: 464, vehicleId: 'v1', date: iso(1), vendor: 'Pilot Stations' },
  { id: 'x6', category: 'Parking', description: 'Depot overnight parking', amount: 180, vehicleId: 'v6', date: iso(2), vendor: 'SecurePark' },
  { id: 'x7', category: 'Toll', description: 'Turnpike tolls batch', amount: 520, vehicleId: 'v6', date: iso(4), vendor: 'EZ-Pass' },
  { id: 'x8', category: 'Maintenance', description: 'Transmission seal repair', amount: 2950, vehicleId: 'v6', date: iso(26), vendor: 'GearTech Services' },
  { id: 'x9', category: 'Fuel', description: 'Diesel refuel - Cargo Master', amount: 397.6, vehicleId: 'v6', date: iso(1), vendor: 'Pilot Stations' },
  { id: 'x10', category: 'Others', description: 'Driver training program', amount: 2400, vehicleId: null, date: iso(7), vendor: 'SafeDrive Academy' },
  { id: 'x11', category: 'Insurance', description: 'Cargo insurance rider', amount: 1800, vehicleId: null, date: iso(15), vendor: 'Guardian Insurance' },
  { id: 'x12', category: 'Repair', description: 'Hybrid battery diagnostic', amount: 1200, vehicleId: 'v7', date: iso(10), vendor: 'EcoMotors' },
];

export const seedNotifications: AppNotification[] = [
  { id: 'n1', type: 'warning', title: 'License Expiring Soon', message: "Sofia Ramirez's license expires in 15 days.", timestamp: iso(0), read: false },
  { id: 'n2', type: 'error', title: 'License Expired', message: "Priya Patel's license has expired. Driver suspended from assignment.", timestamp: iso(1), read: false },
  { id: 'n3', type: 'warning', title: 'Maintenance Reminder', message: 'Polar Express has been in the shop for 5 days.', timestamp: iso(0), read: false },
  { id: 'n4', type: 'success', title: 'Trip Completed', message: 'TRP-2024-006 (Miami → Atlanta) completed successfully.', timestamp: iso(25), read: true },
  { id: 'n5', type: 'info', title: 'New Trip Draft', message: 'TRP-2024-008 is awaiting dispatch approval.', timestamp: iso(0), read: false },
];

export const seedActivities: Activity[] = [
  { id: 'a1', icon: 'route', title: 'Trip Dispatched', description: 'Falcon Heavy departed for Boston, MA', timestamp: iso(1) },
  { id: 'a2', icon: 'check', title: 'Trip Completed', description: 'Frost Liner arrived in Atlanta, GA', timestamp: iso(25) },
  { id: 'a3', icon: 'wrench', title: 'Maintenance Started', description: 'Polar Express moved to shop — compressor failure', timestamp: iso(5) },
  { id: 'a4', icon: 'fuel', title: 'Fuel Log Added', description: '320L diesel added to Falcon Heavy ($464.00)', timestamp: iso(1) },
  { id: 'a5', icon: 'alert', title: 'License Expiring', description: 'Sofia Ramirez license expires in 15 days', timestamp: iso(0) },
  { id: 'a6', icon: 'dollar', title: 'Expense Recorded', description: 'Monthly insurance premium $12,500', timestamp: iso(3) },
  { id: 'a7', icon: 'route', title: 'Trip Draft Created', description: 'SF → Las Vegas draft awaiting dispatch', timestamp: iso(0) },
  { id: 'a8', icon: 'wrench', title: 'Maintenance Completed', description: 'Cargo Master transmission repair finished', timestamp: iso(26) },
];

// 12 months of trend data for analytics
export const monthlyTrends = [
  { month: 'Aug', revenue: 142000, expenses: 98000, fuelCost: 31000, maintenanceCost: 12000 },
  { month: 'Sep', revenue: 156000, expenses: 104000, fuelCost: 33000, maintenanceCost: 15000 },
  { month: 'Oct', revenue: 168000, expenses: 108000, fuelCost: 34500, maintenanceCost: 18000 },
  { month: 'Nov', revenue: 151000, expenses: 101000, fuelCost: 32000, maintenanceCost: 22000 },
  { month: 'Dec', revenue: 189000, expenses: 118000, fuelCost: 38000, maintenanceCost: 14000 },
  { month: 'Jan', revenue: 175000, expenses: 112000, fuelCost: 36000, maintenanceCost: 19000 },
  { month: 'Feb', revenue: 198000, expenses: 121000, fuelCost: 37000, maintenanceCost: 11000 },
  { month: 'Mar', revenue: 212000, expenses: 128000, fuelCost: 39000, maintenanceCost: 24000 },
  { month: 'Apr', revenue: 205000, expenses: 125000, fuelCost: 38500, maintenanceCost: 16000 },
  { month: 'May', revenue: 224000, expenses: 134000, fuelCost: 41000, maintenanceCost: 21000 },
  { month: 'Jun', revenue: 238000, expenses: 141000, fuelCost: 42000, maintenanceCost: 13000 },
  { month: 'Jul', revenue: 251000, expenses: 148000, fuelCost: 43500, maintenanceCost: 26000 },
];
