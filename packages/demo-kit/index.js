/* InnovaTech Demo Kit — public API */

// Providers
export { DemoProvider, useDemo, useTour } from './providers/DemoProvider.jsx'
export { I18nProvider, useT } from './providers/I18nProvider.jsx'
export { MARKETS, DEFAULT_MARKET, marketList } from './providers/markets.js'

// Primitives
export { Button, Card, Badge, Skeleton, EmptyState, Pill } from './primitives/basics.jsx'
export { Input, Select, DateField, Toggle } from './primitives/inputs.jsx'
export { Modal, Drawer, Tabs, Tooltip } from './primitives/overlays.jsx'
export { Table } from './primitives/Table.jsx'

// Composites
export { AppShell } from './composites/AppShell.jsx'
export { Inbox } from './composites/Inbox.jsx'
export { KPICard, ChartCard, BarRow } from './composites/metrics.jsx'
export { FilterBar, QuickFilter } from './composites/FilterBar.jsx'
export { MapView } from './composites/MapView.jsx'
export { PDFPreview } from './composites/PDFPreview.jsx'
export { TourOverlay } from './composites/TourOverlay.jsx'
export { Hexes, HexMark } from './composites/Hexes.jsx'
export { ThemeToggle, CurrencyToggle, LanguageToggle, MarketToggle, ResetButton } from './composites/controls.jsx'

// mockApi
export { hotelApi } from './mockApi/hotel.js'
export { realestateApi } from './mockApi/realestate.js'
export { img } from './mockApi/latency.js'

// lib
export * from './lib/format.js'
