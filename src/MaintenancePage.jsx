import logo from './assets/brand/orka-logo-on-dark.png'
import './maintenance.css'

export default function MaintenancePage() {
  return (
    <main className="maintenance-shell">
      <section className="maintenance-card" aria-labelledby="maintenance-title">
        <img className="maintenance-logo" src={logo} alt="OrkaOS" />

        <div className="maintenance-status">
          <span className="maintenance-status__dot" aria-hidden="true" />
          Temporarily offline
        </div>

        <h1 id="maintenance-title">We’ll be back soon.</h1>
        <p>
          OrkaOS is temporarily unavailable while we make updates behind the
          scenes. Please check back later.
        </p>

        <div className="maintenance-divider" aria-hidden="true" />
        <p className="maintenance-note">Thank you for your patience.</p>
      </section>
    </main>
  )
}
