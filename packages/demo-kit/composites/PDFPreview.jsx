import { FileText, Download } from 'lucide-react'
import { Button } from '../primitives/basics'

/**
 * A framed "document" preview (liquidación / factura / informe de tasación).
 * brand: { name }, title, meta, children (body), footer.
 */
export function PDFPreview({ brand, title, meta, children, onDownload, className }) {
  return (
    <div className={className}>
      <div className="mx-auto bg-white text-[#1b2430] rounded shadow-kit border border-border overflow-hidden" style={{ maxWidth: 620 }}>
        {/* header band */}
        <div className="flex items-center justify-between px-6 py-4" style={{ background: '#0A1628', color: '#E6F0F7' }}>
          <div className="flex items-center gap-2">
            <FileText size={20} style={{ color: '#66E0FF' }} />
            <div>
              <p className="font-extrabold leading-tight">{brand?.name || 'InnovaTech'}</p>
              <p className="text-[11px] opacity-70">{meta}</p>
            </div>
          </div>
          <span className="text-[11px] px-2 py-1 rounded" style={{ background: '#66E0FF22', color: '#66E0FF' }}>DEMO</span>
        </div>
        <div className="px-6 py-5">
          <h3 className="text-lg font-bold mb-4" style={{ color: '#0A1628' }}>{title}</h3>
          <div className="text-sm space-y-2">{children}</div>
        </div>
        <div className="px-6 py-3 text-[11px] text-[#6a7684] border-t border-[#e6e9ee]">
          Documento generado automáticamente · vista previa no válida como comprobante fiscal.
        </div>
      </div>
      {onDownload && (
        <div className="mt-4 flex justify-center">
          <Button icon={Download} variant="secondary" onClick={onDownload}>Descargar / enviar por WhatsApp</Button>
        </div>
      )}
    </div>
  )
}
