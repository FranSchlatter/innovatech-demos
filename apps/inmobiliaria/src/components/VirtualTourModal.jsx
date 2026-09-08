import VirtualTour360, { DEFAULT_TOUR_VIEWS } from '@shared-ui/components/VirtualTour360'
import { TYPE_LABELS } from '../utils/format'

/**
 * Property-only 360° tour.
 *
 * The shared VirtualTour360 ships with two scales (whole complex + a unit). For
 * a real-estate listing we only want the unit itself, so we pass a single view
 * built from the unit plan and adapt its rooms to the property (bedroom count,
 * house vs. apartment outdoor space). Panoramas stay placeholder samples until
 * real 360° captures per property are available.
 */
function buildPropertyTour(property) {
  const unit = DEFAULT_TOUR_VIEWS.find((v) => v.id === 'suite') || DEFAULT_TOUR_VIEWS[0]
  if (!property) return [unit]

  // Non-residential: relabel the plan zones as an open commercial space so the
  // tour never shows "Dormitorio" for an office or shop.
  if (property.type === 'office' || property.type === 'commercial') {
    const panos = unit.rooms.map((r) => r.panorama)
    const zones = [
      { id: 'salon', name: 'Salón principal', area: 'Planta', desc: 'Espacio abierto con frente vidriado.' },
      { id: 'privado', name: 'Privado', area: 'Oficina', desc: 'Despacho cerrado para reuniones.' },
      { id: 'kitchen', name: 'Office', area: 'Cocina', desc: 'Kitchenette para el personal.' },
      { id: 'bath', name: 'Baño', area: 'Sanitario', desc: 'Baño completo.' }
    ].map((z, i) => ({ ...z, shape: unit.rooms[i].shape, panorama: panos[i % panos.length] }))
    return [{ ...unit, label: TYPE_LABELS[property.type] || 'Unidad', rooms: zones }]
  }

  const isHouse = property.type === 'house'
  const bedrooms = Math.max(1, property.bedrooms || 1)

  const rooms = unit.rooms.map((room) => {
    if (room.id === 'bedroom') {
      return {
        ...room,
        area: bedrooms > 1 ? `${bedrooms} dormitorios` : room.area,
        desc:
          bedrooms > 1
            ? `${bedrooms} dormitorios, el principal en suite con vestidor.`
            : room.desc
      }
    }
    if (room.id === 'balcony' && isHouse) {
      return {
        ...room,
        name: 'Jardín',
        area: property.areaTotal ? `${property.areaTotal} m²` : room.area,
        desc: 'Jardín parquizado con parrilla y galería.'
      }
    }
    return room
  })

  return [
    {
      ...unit,
      label: TYPE_LABELS[property.type] || 'Unidad',
      rooms
    }
  ]
}

export default function VirtualTourModal({ open, title, property, onClose }) {
  return (
    <VirtualTour360
      open={open}
      title={title || property?.title}
      views={buildPropertyTour(property)}
      onClose={onClose}
    />
  )
}
