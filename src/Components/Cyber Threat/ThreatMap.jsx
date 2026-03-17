import styles from "./ThreatMap.module.css";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { useEffect, useState } from "react";
import AttackArc from "./AtackArcs";
import { locations, attackTypes } from "../../Data/data";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function ThreatMap() {
  const [attacks, setAttacks]         = useState([]);
  const [attacksToday, setAttacksToday] = useState(3495048);

  // rolling counter
  useEffect(() => {
    const iv = setInterval(() => {
      setAttacksToday(prev => prev + Math.floor(Math.random() * 1500));
    }, 1200);
    return () => clearInterval(iv);
  }, []);

  // live arcs
  useEffect(() => {
    const interval = setInterval(() => {
      const from = locations[Math.floor(Math.random() * locations.length)];
      const to   = locations[Math.floor(Math.random() * locations.length)];
      if (from === to) return;

      const type      = attackTypes[Math.floor(Math.random() * attackTypes.length)];
      const intensity = Math.floor(Math.random() * 4) + 1;
      const newAttacks = [];

      for (let i = 0; i < intensity; i++) {
        newAttacks.push({ id: Date.now() + Math.random() + i, from, to, type });
      }

      setAttacks(prev => [...prev, ...newAttacks]);

      setTimeout(() => {
        setAttacks(prev => prev.filter(a => !newAttacks.find(n => n.id === a.id)));
      }, 3000);
    }, 900);

    return () => clearInterval(interval);
  }, []);

  const activeNodes = new Set(attacks.flatMap(a => [a.from.name, a.to.name])).size;

  return (
    <div className={styles.page}>
      <div className={styles.noise} />
      <div className={styles.glow} />
      <div className={styles.grid} />

      {/* ── HERO HEADER ── */}
      <header className={styles.header}>
        <span className={styles.eyebrow}>
          <span className={styles.liveDot} />
          Live Intelligence Feed
        </span>

        <h1 className={styles.title}>Live Cyber<br />Threat Map</h1>

        <div className={styles.counterRow}>
          <span className={styles.counterValue}>
            {attacksToday.toLocaleString()}
          </span>
          <span className={styles.counterLabel}>attacks recorded today</span>
        </div>

        {/* gradient fade into map */}
        <div className={styles.headerFade} />
      </header>

      {/* ── HUD BAR ── */}
      <div className={styles.hud}>
        <div className={styles.hudLeft}>
          <span className={styles.hudDot} />
          <span className={styles.hudLabel}>Global Threat Monitor</span>
        </div>
        <div className={styles.hudRight}>
          <div className={styles.hudStat}>
            <span className={styles.hudStatLabel}>Live Attacks</span>
            <span className={styles.hudStatValue}>{attacks.length}</span>
          </div>
          <div className={styles.hudDivider} />
          <div className={styles.hudStat}>
            <span className={styles.hudStatLabel}>Nodes Active</span>
            <span className={styles.hudStatValue}>{activeNodes}</span>
          </div>
        </div>
      </div>

      {/* ── MAP ── */}
      <div className={styles.mapWrapper}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 160, center: [0, 20] }}
          className={styles.map}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#0a1018"
                  stroke="rgba(201,169,110,0.10)"
                  strokeWidth={0.5}
                />
              ))
            }
          </Geographies>

          {attacks.map(attack => (
            <AttackArc key={attack.id} attack={attack} />
          ))}

          {locations.map((loc, i) => {
            const active   = attacks.some(a => a.from.name === loc.name || a.to.name === loc.name);
            if (!active) return null;
            const isTarget = attacks.some(a => a.to.name === loc.name);

            return (
              <Marker key={i} coordinates={loc.coords}>
                <circle r={14} fill={isTarget ? "rgba(201,169,110,0.07)" : "rgba(201,169,110,0.04)"} />
                <circle r={7}  fill={isTarget ? "rgba(201,169,110,0.20)" : "rgba(201,169,110,0.10)"} />
                <circle r={2.5} fill={isTarget ? "#c9a96e" : "#eef2f7"} />
                <text
                  textAnchor="middle"
                  y={-18}
                  style={{
                    fill: "rgba(201,169,110,0.75)",
                    fontSize: "9px",
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {loc.name}
                </text>
              </Marker>
            );
          })}
        </ComposableMap>
      </div>

      {/* ── LEGEND ── */}
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: "#c9a96e" }} />
          Target Node
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: "#eef2f7" }} />
          Source Node
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendLine} />
          Attack Vector
        </span>
      </div>
    </div>
  );
}