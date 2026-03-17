import { useState } from "react"
import styles from "./Navbar.module.css"
import { useNavigate } from "react-router-dom"

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>

        {/* Logo */}
        <div onClick={() => navigate("/")} className={styles.logo}>
          <span className={styles.logoDot} />
          Global Event Intelligence
        </div>

        {/* Desktop Links */}
        <ul className={styles.links}>
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/CyberThreat")}>Threat Map</li>
          <li onClick={() => navigate("/Passport/Home")}>Passport-Index</li>
          <li onClick={() => navigate("/world-map")}>Analytics</li>
        </ul>

        {/* CTA */}
        <button onClick={() => navigate("/CyberThreat")} className={styles.liveBtn}>
          <span className={styles.liveDot} />
          Live Map
        </button>

        {/* Hamburger */}
        <div
          className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </div>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <p onClick={() => { navigate("/"); setMenuOpen(false) }}>Home</p>
          <p onClick={() => { navigate("/CyberThreat"); setMenuOpen(false) }}>Threat Map</p>
          <p onClick={() => navigate("/Passport/Home")}>Passport-Index</p>
          <p onClick={() => { navigate("/world-map"); setMenuOpen(false) }}>Analytics</p>
          <button
            className={styles.mobileBtn}
            onClick={() => { navigate("/CyberThreat"); setMenuOpen(false) }}
          >
            Live Map
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar