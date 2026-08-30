import VirtualTour360 from '@shared-ui/components/VirtualTour360'

/**
 * Thin wrapper kept for backwards compatibility with existing call sites.
 * The real experience (interactive 2.5D plan + 360° viewer) lives in the
 * shared VirtualTour360 component. `images` is no longer used: each zone in
 * the tour carries its own 360° panorama.
 */
export default function VirtualTourModal({ open, title, onClose }) {
  return <VirtualTour360 open={open} title={title} onClose={onClose} />
}
