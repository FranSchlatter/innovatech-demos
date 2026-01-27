# 📋 PENDING FEATURES - InnovaTech Demos

> **Documento creado**: 2026-01-27
> **Propósito**: Guía para Claude Code - Features pendientes de implementar
> **Contexto**: Los paneles ADMIN de los 3 proyectos están 100% completos. Faltan features del lado CLIENTE.

---

## 🎯 ESTADO ACTUAL DEL PROYECTO

### ✅ COMPLETADO

#### Admin Mode (100% en los 3 proyectos)

**Hotelería**:
- `AdminDashboard.jsx` - Dashboard con KPIs
- `RoomManagement.jsx` + `RoomEditModal.jsx` - Gestión de habitaciones
- `HousekeepingManagement.jsx` - Limpieza y housekeeping
- `InventoryManagement.jsx` - Inventario del hotel
- `ServiceRequestsMonitor.jsx` - Monitor de solicitudes

**Salud**:
- `AdminDashboard.jsx` - Dashboard con KPIs
- `AppointmentManagement.jsx` - Gestión de citas
- `DoctorManagement.jsx` - Gestión de doctores
- `PatientRecords.jsx` - Registros de pacientes
- `MedicalInventory.jsx` - Inventario médico
- `ScheduleManagement.jsx` - Horarios y disponibilidad

**Gastronomía**:
- `AdminDashboard.jsx` - Dashboard con KPIs
- `OrderManagement.jsx` - Gestión de pedidos
- `ReservationManagement.jsx` - Gestión de reservas
- `MenuManagement.jsx` - Gestión del menú
- `KitchenInventory.jsx` - Inventario de cocina
- `TableManagement.jsx` - Gestión de mesas

---

## ⚠️ PENDIENTE DE IMPLEMENTAR

### 🍽️ GASTRONOMÍA - Prioridad ALTA

#### 1. Online Ordering System
**Ubicación**: `apps/gastronomia/src/components/client/ordering/`

**Componentes a crear**:
```
components/client/ordering/
├── OnlineOrderPage.jsx      # Página principal de pedidos
├── MenuBrowser.jsx          # Navegador del menú con categorías
├── DishCard.jsx             # Tarjeta de plato con "Add to Cart"
├── DishDetailModal.jsx      # Modal con customizaciones
├── CartSidebar.jsx          # Sidebar del carrito (slide-in)
├── CartItem.jsx             # Item individual del carrito
├── CheckoutForm.jsx         # Formulario de checkout
├── OrderConfirmation.jsx    # Confirmación de pedido
└── OrderTracking.jsx        # Seguimiento del pedido (opcional)
```

**Funcionalidad requerida**:
- Navegar menú por categorías (Appetizers, Main, Desserts, Drinks)
- Añadir items al carrito con cantidad
- Customizaciones: additions, removals, special instructions
- Seleccionar tipo: pickup o delivery
- Si delivery: formulario de dirección
- Aplicar código promocional (simulado)
- Calcular subtotal, tax, delivery fee, total
- Confirmar pedido → mostrar número de orden
- Persistir carrito en localStorage

**Data structures** (ver FEATURES_ROADMAP.md líneas 576-640):
- OrderItem, Cart, Customer Information, Payment Options

**Integración con App.jsx**:
- Agregar `viewMode: 'ordering'`
- Botón "Order Online" en navbar o hero section

---

### 🏨 HOTELERÍA - Prioridad ALTA

#### 2. Guest Dashboard (Portal del Huésped)
**Ubicación**: `apps/hoteleria/src/components/client/portal/`

**Componentes a crear**:
```
components/client/portal/
├── GuestPortal.jsx          # Layout principal del portal
├── ReservationCard.jsx      # Tarjeta de reserva activa
├── ReservationDetails.jsx   # Detalles completos de la reserva
├── ServiceRequestForm.jsx   # Formulario para solicitar servicios
├── ServiceHistory.jsx       # Historial de servicios solicitados
├── InvoiceView.jsx          # Vista de factura/cuenta
└── ModifyReservation.jsx    # Modificar/cancelar reserva
```

**Funcionalidad requerida**:
- Login simulado (solo UI, sin validación real)
- Ver reserva actual: número, fechas, habitación, status
- Solicitar servicios: Room Service, Housekeeping, Maintenance, Spa
- Ver historial de servicios solicitados
- Ver factura/invoice actual
- Modificar reserva (cambiar fechas si es posible)
- Cancelar reserva (con confirmación)

**Data structures** (ver FEATURES_ROADMAP.md líneas 100-135):
- Reservation, Service Request

**Integración con App.jsx**:
- Agregar `viewMode: 'guest-portal'`
- Botón "Guest Portal" o "My Reservation" en navbar

---

### 🏥 SALUD - Prioridad ALTA

#### 3. Patient Portal
**Ubicación**: `apps/salud/src/components/client/portal/`

**Componentes a crear**:
```
components/client/portal/
├── PatientPortal.jsx        # Layout principal del portal
├── UpcomingAppointments.jsx # Citas próximas
├── AppointmentCard.jsx      # Tarjeta de cita individual
├── MedicalHistory.jsx       # Historial médico
├── LabResults.jsx           # Resultados de laboratorio
├── PrescriptionList.jsx     # Lista de prescripciones
├── PersonalInfoForm.jsx     # Actualizar información personal
└── InsuranceInfo.jsx        # Información del seguro
```

**Funcionalidad requerida**:
- Login simulado (solo UI)
- Ver citas próximas con detalles (doctor, especialidad, ubicación)
- Cancelar/reprogramar cita
- Ver historial médico (visitas pasadas)
- Ver resultados de laboratorio (simulados)
- Ver prescripciones activas
- Actualizar información personal
- Actualizar información del seguro

**Data structures** (ver FEATURES_ROADMAP.md líneas 366-410):
- Upcoming Appointments, Medical History, Lab Results

**Integración con App.jsx**:
- Agregar `viewMode: 'patient-portal'`
- Botón "Patient Portal" en navbar

---

### 🏨 HOTELERÍA - Prioridad MEDIA

#### 4. Hotel Services Request (desde landing)
**Ubicación**: `apps/hoteleria/src/components/HotelServices.jsx`

**Funcionalidad**:
- Sección en landing que muestra servicios disponibles
- Modal/formulario para solicitar servicios (sin estar logueado)
- Requiere: número de habitación, tipo de servicio, detalles

---

### 🏥 SALUD - Prioridad MEDIA

#### 5. Pre-Check-in Form
**Ubicación**: `apps/salud/src/components/PreCheckIn.jsx`

**Funcionalidad**:
- Formulario para completar antes de la cita
- Campos: peso, altura, alergias, medicamentos actuales
- Historia médica, contacto de emergencia
- Subir archivos (simulado)
- Se accede desde email de confirmación (link simulado)

---

### 🏨 HOTELERÍA - Prioridad BAJA

#### 6. Excursions & Activities Booking
**Ubicación**: `apps/hoteleria/src/components/Excursions.jsx`

**Funcionalidad**:
- Listado de excursiones disponibles
- Detalle con duración, precio, horarios
- Formulario de reserva de excursión

---

### 🍽️ GASTRONOMÍA - Prioridad BAJA

#### 7. Enhanced Analytics Dashboard
**Ubicación**: Extender `AdminDashboard.jsx`

**Funcionalidad adicional**:
- Gráficos de ventas por hora
- Top platos más vendidos
- Performance de meseros
- Heatmap de horas pico

---

## 🛠️ INSTRUCCIONES PARA IMPLEMENTAR

### Antes de empezar cualquier feature:

1. **Leer este documento completo**
2. **Consultar FEATURES_ROADMAP.md** para data structures detalladas
3. **Revisar REGLAS_CRITICAS.md** para estándares de código
4. **Revisar componentes Admin existentes** como referencia de estilo

### Patrones a seguir:

```jsx
// Estructura típica de componente cliente
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
// ... lucide-react icons

export default function ComponentName() {
  const [state, setState] = useState(initialValue)

  // Loading state
  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Responsive container */}
      <div className="container mx-auto px-4 py-8">
        {/* Content */}
      </div>
    </div>
  )
}
```

### Checklist por feature:

- [ ] Dark/Light mode funcionando
- [ ] Responsive (mobile-first)
- [ ] Animaciones con Framer Motion
- [ ] Estados de loading
- [ ] Estados vacíos con mensaje útil
- [ ] Persistencia en localStorage si aplica
- [ ] Integración con App.jsx (viewMode)
- [ ] Botón de acceso en Navbar
- [ ] Probado en 375px, 768px, 1024px

---

## 📁 ARCHIVOS DE REFERENCIA

| Archivo | Propósito |
|---------|-----------|
| `FEATURES_ROADMAP.md` | Data structures y especificaciones completas |
| `REGLAS_CRITICAS.md` | Estándares de código obligatorios |
| `FRONT_END_DEVELOPMENT.md` | Guías técnicas de frontend |
| `apps/*/src/components/admin/` | Referencia de estilo y patrones |
| `apps/*/src/hooks/useAdminData.js` | Patrón de manejo de datos |

---

## 🚀 ORDEN SUGERIDO DE IMPLEMENTACIÓN

1. **Gastronomía - Online Ordering** (más impacto visual, demuestra e-commerce)
2. **Hotelería - Guest Portal** (complementa el flujo de reservas)
3. **Salud - Patient Portal** (complementa el flujo de citas)
4. **Hotelería - Hotel Services** (mejora UX del landing)
5. **Salud - Pre-Check-in** (feature secundario útil)
6. **Hotelería - Excursions** (nice-to-have)
7. **Gastronomía - Analytics** (polish final)

---

## 💡 NOTAS IMPORTANTES

- **No crear backends reales** - Todo es simulado con mock data
- **localStorage para persistencia** - Usar el patrón de useAdminData
- **Delays simulados** - 300-800ms para realismo
- **Textos en INGLÉS** - Todo el UI
- **Theme colors por proyecto**:
  - Hotelería: Amber/Gold (#F59E0B)
  - Salud: Teal (#14B8A6)
  - Gastronomía: Orange/Red (#EA580C)

---

**Última actualización**: 2026-01-27
**Estado**: Listo para continuar implementación
**Próximo paso**: Implementar Online Ordering System (Gastronomía)