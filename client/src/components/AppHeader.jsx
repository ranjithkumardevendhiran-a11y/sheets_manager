export function LogoBadge({ small = false }) {
  return (
    <div className={`logo-badge${small ? ' logo-badge-small' : ''}`}>
      <div className="app-logo-mark">TVS</div>
      <div className="app-logo-text">
        <span className="brand">myTVS</span>
        {!small && <span className="tagline">India's Largest Multi-Brand Car Service Network</span>}
      </div>
    </div>
  );
}

export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <LogoBadge />
      </div>
    </header>
  );
}
