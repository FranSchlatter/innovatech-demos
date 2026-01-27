# 📘 Features Roadmap - InnovaTech Demos

## Project Overview

This document describes the **complete structure, functionality logic, required data, and views** for three professional demo projects designed to showcase web development capabilities.

**Current Status**: Phase 1 - Landing Pages (Static/Hardcoded)
**Next Phase**: Phase 2 - Interactive Systems (Client + Admin modes)

The systems are designed to:
- Work without real backend infrastructure
- Use hardcoded or simulated data
- Function as fully interactive prototypes
- Demonstrate professional UX/UI capabilities

---

## 🎯 System Access Modes

The complete system will have **two main modes**, accessible from the homepage:

### 🔹 Client Mode
- Simulates the end-user experience
- Complete functional forms
- Visual state feedback
- Realistic user flow

### 🔹 Admin Mode
- Simulates management dashboard
- Data handling interfaces
- Analytics dashboards
- State control panels

📌 **Both modes use the same simulated dataset**.

---

# 🏨 PROJECT 1 — HOSPITALITY (Hotel Management)

## 🔹 CLIENT VIEWS

### 1. Room Booking

#### Personal Information
```typescript
{
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
}
```

#### Stay Details
```typescript
{
  checkInDate: Date
  checkOutDate: Date
  numberOfGuests: number
  roomType: 'standard' | 'deluxe' | 'suite'
  preferences: string // textarea
  estimatedArrivalTime: string
}
```

#### Additional Information
```typescript
{
  travelPurpose: 'leisure' | 'business'
  specialRequests: string
}
```

**UI Components Needed**:
- Date picker (check-in/check-out)
- Guest counter
- Room type selector (with images and pricing)
- Time selector
- Text area for preferences

---

### 2. Guest Dashboard

**Display Information**:
- Reservation number
- Stay dates
- Assigned room details
- Reservation status
- Requested services list

**Available Actions**:
- Request room service
- View invoice
- Cancel reservation
- Modify reservation (if allowed)

**Data Structure**:
```typescript
{
  reservationId: string
  guestName: string
  roomNumber: string
  checkIn: Date
  checkOut: Date
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled'
  services: Service[]
  totalAmount: number
}
```

---

### 3. Hotel Services

**Available Services**:
- Room Service (food & beverages)
- Housekeeping Requests (towels, amenities, etc.)
- Maintenance
- Spa & Wellness
- Excursions & Tours
- Common Area Reservations (gym, pool, meeting rooms)

**Service Request Form**:
```typescript
{
  serviceType: string
  roomNumber: string
  requestDate: Date
  preferredTime: string
  notes: string
  urgent: boolean
}
```

---

### 4. Excursions & Activities

**Excursion Data**:
```typescript
{
  id: string
  name: string
  description: string
  duration: string // "2 hours", "Full day"
  price: number
  availableSchedules: string[]
  maxCapacity: number
  images: string[]
  includedItems: string[]
}
```

**Booking Data**:
```typescript
{
  excursionId: string
  date: Date
  numberOfPeople: number
  guestInfo: GuestInfo
}
```

---

## 🔹 ADMIN VIEWS (Hotel)

### 1. Dashboard

**Metrics Display**:
```typescript
{
  currentOccupancy: number // percentage
  availableRooms: number
  activeReservations: number
  pendingServices: number
  todayCheckIns: number
  todayCheckOuts: number
  revenue: {
    today: number
    week: number
    month: number
  }
}
```

**UI Components**:
- KPI cards
- Occupancy chart
- Revenue graph
- Quick actions panel

---

### 2. Room Management

**Room Data**:
```typescript
{
  roomNumber: string
  type: 'standard' | 'deluxe' | 'suite'
  capacity: number
  pricePerNight: number
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning'
  floor: number
  amenities: string[]
  notes: string
}
```

**Actions**:
- Edit room details
- Change room status
- View room history
- Assign/reassign guests

---

### 3. Housekeeping Management

**Cleaning Schedule**:
```typescript
{
  roomNumber: string
  scheduledTime: string
  assignedEmployee: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'normal' | 'high'
  notes: string
  completedAt?: Date
}
```

**Views**:
- Daily cleaning schedule
- Staff assignments
- Room status tracker
- Completion reports

---

### 4. Inventory Management

**Inventory Item**:
```typescript
{
  itemName: string
  category: 'linens' | 'amenities' | 'minibar' | 'cleaning' | 'other'
  currentStock: number
  minimumStock: number
  unit: string
  lastRestocked: Date
  supplier: string
  costPerUnit: number
}
```

**Features**:
- Low stock alerts
- Restock history
- Supplier management
- Usage reports

---

### 5. Service Requests Monitor

**Request Tracking**:
```typescript
{
  requestId: string
  roomNumber: string
  serviceType: string
  requestedAt: Date
  status: 'pending' | 'assigned' | 'in-progress' | 'completed'
  assignedTo: string
  priority: boolean
  completedAt?: Date
  notes: string
}
```

**Dashboard Features**:
- Real-time request feed
- Filter by status/type
- Assign to staff
- Mark as complete
- Performance metrics

---

# 🏥 PROJECT 2 — HEALTHCARE

## 🔹 CLIENT VIEWS

### 1. Appointment Request

**Personal Information**:
```typescript
{
  firstName: string
  lastName: string
  idNumber: string
  dateOfBirth: Date
  phone: string
  email: string
  address: string
}
```

**Insurance Information**:
```typescript
{
  insuranceProvider: string
  memberNumber: string
  planType: string
}
```

**Appointment Details**:
```typescript
{
  specialty: string
  preferredDoctor?: string
  preferredDate: Date
  preferredTime: string
  reasonForVisit: string
  isFirstVisit: boolean
}
```

---

### 2. Pre-Check-in Form

**Medical History**:
```typescript
{
  weight: number
  height: number
  allergies: string[]
  currentMedications: string[]
  medicalHistory: string[]
  familyHistory: string
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  notes: string
  attachments?: File[] // Medical orders, lab results
}
```

**Purpose**:
- Speed up in-person check-in
- Provide doctors with preliminary information
- Reduce waiting time

---

### 3. Patient Portal

**Dashboard Sections**:

**Upcoming Appointments**:
```typescript
{
  appointmentId: string
  date: Date
  time: string
  doctor: string
  specialty: string
  location: string
  status: 'confirmed' | 'pending' | 'cancelled'
}
```

**Medical History**:
```typescript
{
  visitDate: Date
  doctor: string
  diagnosis: string
  prescriptions: string[]
  notes: string
}
```

**Lab Results & Studies**:
```typescript
{
  studyType: string
  orderedBy: string
  date: Date
  status: 'pending' | 'ready'
  result?: {
    file: string
    summary: string
  }
}
```

**Personal Information Management**:
- Update contact info
- Update insurance
- Update medical history

---

### 4. Specialty Information Pages

**Specialty Details**:
```typescript
{
  name: string
  description: string
  commonProcedures: string[]
  requiredPreparation: string
  averageAppointmentDuration: number
  availableDoctors: Doctor[]
  faqs: FAQ[]
  relatedSpecialties: string[]
}
```

**Doctor Profile**:
```typescript
{
  name: string
  specialty: string
  subSpecialties: string[]
  education: string[]
  experience: number
  languages: string[]
  acceptedInsurance: string[]
  schedule: Schedule
  rating: number
  reviews: Review[]
}
```

---

## 🔹 ADMIN VIEWS (Healthcare)

### 1. Dashboard

**Daily Metrics**:
```typescript
{
  todayAppointments: number
  activeDoctors: number
  availableSpecialties: number
  waitingPatients: number
  completedVisits: number
  cancelledAppointments: number
  revenue: number
}
```

**Visual Components**:
- Appointment timeline
- Doctor availability grid
- Waiting room status
- Revenue charts

---

### 2. Doctor Management

**Doctor Information**:
```typescript
{
  id: string
  personalInfo: {
    name: string
    email: string
    phone: string
    licenseNumber: string
  }
  professional: {
    specialty: string
    subSpecialties: string[]
    acceptedInsurance: string[]
    consultationFee: number
  }
  schedule: {
    workingDays: string[]
    workingHours: {
      start: string
      end: string
    }
    appointmentDuration: number // minutes
    breakTime: {
      start: string
      end: string
    }
  }
  status: 'active' | 'on-leave' | 'inactive'
}
```

**Features**:
- Add/edit doctor profiles
- Manage schedules
- View appointment history
- Performance reports

---

### 3. Patient Management

**Patient Record**:
```typescript
{
  id: string
  personalInfo: PersonalInfo
  insurance: InsuranceInfo
  medicalHistory: MedicalHistory
  appointments: Appointment[]
  prescriptions: Prescription[]
  labResults: LabResult[]
  attachments: File[]
  notes: string
  status: 'active' | 'inactive'
}
```

**Features**:
- Search patients
- View complete history
- Manage documents
- Send notifications
- Billing integration

---

### 4. Appointment Management

**Appointment Data**:
```typescript
{
  appointmentId: string
  patient: Patient
  doctor: Doctor
  date: Date
  time: string
  duration: number
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show'
  reasonForVisit: string
  diagnosis?: string
  prescriptions?: Prescription[]
  followUp?: Date
  notes: string
}
```

**Calendar Features**:
- Drag-and-drop scheduling
- Availability checker
- Conflict detection
- Automated reminders
- Bulk operations

---

# 🍽️ PROJECT 3 — GASTRONOMY (Restaurant)

## 🔹 CLIENT VIEWS

### 1. Online Ordering

**Customer Information**:
```typescript
{
  name: string
  phone: string
  email?: string
  deliveryType: 'pickup' | 'delivery'
  address?: {
    street: string
    number: string
    apartment?: string
    city: string
    zipCode: string
    references: string
  }
}
```

**Order Item**:
```typescript
{
  dishId: string
  dishName: string
  quantity: number
  size?: 'small' | 'medium' | 'large'
  customizations: {
    additions: string[]
    removals: string[]
    specialInstructions: string
  }
  price: number
}
```

**Payment Options**:
```typescript
{
  method: 'cash' | 'card' | 'online'
  changeFor?: number
}
```

---

### 2. Shopping Cart

**Cart Structure**:
```typescript
{
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  tax: number
  total: number
  estimatedDeliveryTime: string
}
```

**Features**:
- Add/remove items
- Update quantities
- Apply promo codes
- Save for later
- Checkout

---

### 3. Table Reservation

**Reservation Data**:
```typescript
{
  customerName: string
  phone: string
  email: string
  date: Date
  time: string
  numberOfPeople: number
  occasion?: 'birthday' | 'anniversary' | 'business' | 'other'
  specialRequests: string
  preferredArea?: 'indoor' | 'outdoor' | 'bar'
  status: 'pending' | 'confirmed' | 'cancelled'
}
```

**Availability Display**:
- Time slots grid
- Available table sizes
- Special occasion options
- Instant confirmation

---

### 4. Menu Display

**Dish Information**:
```typescript
{
  id: string
  name: string
  description: string
  category: 'appetizer' | 'main' | 'dessert' | 'beverage'
  price: number
  images: string[]
  ingredients: string[]
  allergens: string[]
  dietaryInfo: ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free')[]
  spicyLevel?: number
  preparationTime: number
  available: boolean
  popular: boolean
  chefRecommended: boolean
}
```

---

## 🔹 ADMIN VIEWS (Restaurant)

### 1. Table Management

**Table Configuration**:
```typescript
{
  tableNumber: string
  capacity: number
  location: 'indoor' | 'outdoor' | 'bar'
  status: 'available' | 'occupied' | 'reserved' | 'maintenance'
  assignedWaiter: string
  currentOrder?: Order
  reservations: Reservation[]
}
```

**Floor Plan View**:
- Interactive table layout
- Real-time status updates
- Quick table assignments
- Capacity overview

---

### 2. Order Management

**Order Details**:
```typescript
{
  orderId: string
  type: 'dine-in' | 'takeout' | 'delivery'
  table?: string
  customer: Customer
  items: OrderItem[]
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed'
  placedAt: Date
  estimatedReady: Date
  total: number
  paymentStatus: 'pending' | 'paid'
  assignedWaiter?: string
  notes: string
}
```

**Kitchen Display**:
- Active orders queue
- Priority indicators
- Preparation timers
- Mark items as ready

---

### 3. Bill Management

**Bill Structure**:
```typescript
{
  billId: string
  table: string
  items: OrderItem[]
  subtotal: number
  tax: number
  tip: number
  discount: number
  total: number
  paymentMethod: 'cash' | 'card' | 'split'
  status: 'open' | 'paid' | 'cancelled'
  createdAt: Date
  paidAt?: Date
  waiter: string
}
```

**Features**:
- Split bill functionality
- Apply discounts
- Add tips
- Multiple payment methods
- Print receipt

---

### 4. Analytics Dashboard

**Key Metrics**:
```typescript
{
  dailySales: {
    total: number
    orders: number
    averageTicket: number
  }
  activeTables: {
    occupied: number
    available: number
    reserved: number
  }
  popularDishes: {
    name: string
    orders: number
    revenue: number
  }[]
  waiterPerformance: {
    name: string
    tables: number
    sales: number
    averageTime: number
  }[]
  hourlyBreakdown: {
    hour: string
    orders: number
    revenue: number
  }[]
}
```

**Visual Components**:
- Sales charts
- Table occupancy timeline
- Popular items ranking
- Peak hours heatmap

---

# 🧩 IMPLEMENTATION NOTES

## Technical Stack Recommendations

**Frontend**:
- React/Next.js
- TypeScript (strongly recommended)
- Tailwind CSS / Styled Components
- Framer Motion (animations)
- React Hook Form (form handling)
- Zustand / Context API (state management)

**Data Management**:
- JSON files in `/apps/[app]/data/`
- LocalStorage for persistence
- Simulated API delays for realism

**Routing**:
- Client/Admin mode toggle
- Protected routes simulation
- State-based view switching

---

## Code Organization

```
apps/
  [app-name]/
    src/
      components/
        client/          # Client-facing components
        admin/           # Admin dashboard components
        shared/          # Shared between modes
      pages/
        client/          # Client views
        admin/           # Admin views
      data/
        mock-data.ts     # Hardcoded data
        types.ts         # TypeScript interfaces
      utils/
        simulation.ts    # API simulation helpers
```

---

## Key Features to Implement

### Authentication Simulation
```typescript
// Simple role-based access
const mockAuth = {
  role: 'client' | 'admin',
  userId: string,
  login: (role) => void,
  logout: () => void
}
```

### Data Persistence
- Use localStorage to persist state
- Simulate API delays (500-1500ms)
- Reset to default data option

### Notifications System
- Toast notifications for actions
- Success/error states
- Confirmation dialogs

### Form Validation
- Client-side validation
- Visual feedback
- Error messages in English

---

## UI/UX Guidelines

### Client Mode
- Focus on simplicity and clarity
- Large touch-friendly buttons
- Clear CTAs
- Minimal steps to complete actions
- Progress indicators for multi-step forms

### Admin Mode
- Data-dense layouts
- Quick filters and search
- Bulk actions support
- Keyboard shortcuts
- Export capabilities (CSV simulation)

### Both Modes
- Dark/Light theme support (mandatory)
- Mobile-first responsive design
- Smooth transitions
- Loading states
- Empty states with helpful messages

---

## Demo Data Requirements

### Realistic Content
- Use actual city names, addresses
- Realistic prices for the region
- Professional imagery (Unsplash, Pexels)
- Varied but believable data

### Data Variety
- Different statuses represented
- Edge cases included
- Historical data (past dates)
- Future bookings/appointments

### Sample Sizes
- Minimum 10-15 items per category
- At least 3-5 staff/doctors/waiters
- 20+ reservations/appointments
- Varied date ranges

---

## Deployment Strategy

### Initial Access
Create a mode selector on homepage:

```typescript
// Landing page with two buttons
<ModeSelector>
  <Button onClick={() => navigate('/client')}>
    Enter as Client
  </Button>
  <Button onClick={() => navigate('/admin')}>
    Enter as Administrator
  </Button>
</ModeSelector>
```

### Demo Credentials
For admin mode, show sample credentials:
```
Username: admin@demo.com
Password: demo123
(No actual validation, just for show)
```

---

## Future Enhancements (Post-Demo)

### Phase 3 Possibilities
- Real backend integration
- User authentication
- Email notifications
- Payment processing
- Analytics integration
- Mobile apps (React Native)
- Multi-language support

---

## Success Criteria

✅ **Functional Requirements**
- All forms work correctly
- State updates reflect immediately
- Data persists during session
- Responsive on all devices
- Dark/light modes functional

✅ **Visual Requirements**
- Professional appearance
- Consistent branding per app
- Smooth animations
- No layout shifts
- Accessible color contrast

✅ **Demo Requirements**
- Easy to understand
- Self-explanatory flow
- Impressive to clients
- Shows technical capability
- Portfolio-ready

---

## 📋 Development Checklist

### Before Starting Implementation

- [ ] Review all data structures
- [ ] Create TypeScript interfaces
- [ ] Set up mock data files
- [ ] Design component hierarchy
- [ ] Plan state management approach

### During Implementation

- [ ] Build one complete flow first (e.g., booking)
- [ ] Test on mobile devices
- [ ] Verify dark/light mode
- [ ] Check form validations
- [ ] Test state persistence

### Before Delivery

- [ ] All forms functional
- [ ] Data persistence works
- [ ] Responsive verified
- [ ] Dark mode verified
- [ ] Demo data populated
- [ ] No console errors
- [ ] Loading states implemented
- [ ] Success/error messages work

---

## 🎯 Final Objective

This roadmap defines:
- ✅ What data exists and how it's structured
- ✅ How data flows between components
- ✅ What views are needed for each role
- ✅ How features should behave

This enables:
- **Developers** to implement features consistently
- **AI assistants** to understand project context
- **Clients** to visualize the final product
- **Stakeholders** to understand system capabilities

---

**Document Version**: 1.1
**Last Updated**: 2026-01-27
**Status**: Phase 2 - Admin Complete, Client Pending
**Maintained By**: Development Team

---

## 📊 IMPLEMENTATION STATUS (2026-01-27)

### Summary
- **Admin Mode**: ✅ 100% COMPLETE (all 3 projects)
- **Client Mode**: ⚠️ PARTIALLY COMPLETE (core features done, portals pending)

### Detailed Status

#### 🏨 HOTELERIA
| Feature | Mode | Status |
|---------|------|--------|
| Room Booking Form | Client | ✅ Done |
| Guest Dashboard/Portal | Client | ❌ Pending |
| Hotel Services Request | Client | ❌ Pending |
| Excursions Booking | Client | ❌ Pending |
| Admin Dashboard | Admin | ✅ Done |
| Room Management | Admin | ✅ Done |
| Housekeeping Management | Admin | ✅ Done |
| Inventory Management | Admin | ✅ Done |
| Service Requests Monitor | Admin | ✅ Done |

#### 🏥 SALUD
| Feature | Mode | Status |
|---------|------|--------|
| Appointment Request | Client | ✅ Done |
| Specialty Pages | Client | ✅ Done |
| Doctor Profiles | Client | ✅ Done |
| Pre-Check-in Form | Client | ❌ Pending |
| Patient Portal | Client | ❌ Pending |
| Admin Dashboard | Admin | ✅ Done |
| Appointment Management | Admin | ✅ Done |
| Doctor Management | Admin | ✅ Done |
| Patient Records | Admin | ✅ Done |
| Medical Inventory | Admin | ✅ Done |
| Schedule Management | Admin | ✅ Done |

#### 🍽️ GASTRONOMIA
| Feature | Mode | Status |
|---------|------|--------|
| Menu Display | Client | ✅ Done |
| Table Reservation | Client | ✅ Done |
| Online Ordering System | Client | ❌ Pending |
| Shopping Cart | Client | ❌ Pending |
| Admin Dashboard | Admin | ✅ Done |
| Order Management | Admin | ✅ Done |
| Reservation Management | Admin | ✅ Done |
| Menu Management | Admin | ✅ Done |
| Kitchen Inventory | Admin | ✅ Done |
| Table Management | Admin | ✅ Done |

### Next Steps
> **See `PENDING_FEATURES.md`** for detailed implementation guide of remaining features.

Priority order:
1. 🍽️ Online Ordering + Cart (Gastronomia)
2. 🏨 Guest Portal (Hoteleria)
3. 🏥 Patient Portal (Salud)
4. Other features as needed

## Quick Reference

### When implementing a new feature:

1. **Check this document** for data structures
2. **Review REGLAS_CRITICAS.md** for coding standards
3. **Follow FRONT_END_DEVELOPMENT.md** for technical guidelines
4. **Use INSTRUCCIONES_CLAUDE.md** for workflow guidance
5. **Test thoroughly** before marking complete

### Remember:
- 🌍 Code in English
- 🎨 Dark/Light mode always
- 📱 Mobile-first approach
- ✅ Test before completing
- 🔒 Ask before git operations

---

END OF ROADMAP
