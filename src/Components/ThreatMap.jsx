import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

import { useEffect, useState } from "react";
import AttackArc from "./AtackArcs";
import { locations } from "../Data/data";
import { attackTypes } from "../Data/data";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function ThreatMap() {
  const [attacks, setAttacks] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const from = locations[Math.floor(Math.random() * locations.length)];

      const to = locations[Math.floor(Math.random() * locations.length)];

      if (from === to) return;

      const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];

      const intensity = Math.floor(Math.random() * 4) + 1;

      const newAttacks = [];

      for (let i = 0; i < intensity; i++) {
        newAttacks.push({
          id: Date.now() + Math.random() + i,
          from,
          to,
          type,
        });
      }

      setAttacks((prev) => [...prev, ...newAttacks]);

      setTimeout(() => {
        setAttacks((prev) =>
          prev.filter((a) => !newAttacks.find((n) => n.id === a.id)),
        );
      }, 3000);
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",

        background:
          "radial-gradient(circle at center,#081a2a 0%,#020617 60%,#01030a 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at center,rgba(0,255,255,0.05),transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage:
            "linear-gradient(#00ffff08 1px,transparent 1px),linear-gradient(90deg,#00ffff08 1px,transparent 1px)",
          backgroundSize: "120px 120px",
          pointerEvents: "none",
        }}
      />

      {/* attack counter */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "#00ffff",
          fontFamily: "monospace",
          fontSize: 14,
          letterSpacing: 2,
          background: "rgba(0,0,0,0.4)",
          padding: "6px 12px",
          borderRadius: 4,
          border: "1px solid #00ffff40",
          backdropFilter: "blur(6px)",
          zIndex: 10,
        }}
      >
        LIVE CYBER ATTACKS : {attacks.length}
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 160,
          center: [0, 20],
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#071c2f"
                stroke="#00ffff22"
                strokeWidth={0.5}
                style={{
                  default: {
                    outline: "none",
                  },

                  hover: {
                    fill: "#0c2a44",
                    transition: "0.3s",
                  },
                }}
              />
            ))
          }
        </Geographies>

        {attacks.map((attack) => (
          <AttackArc key={attack.id} attack={attack} />
        ))}

        {locations.map((loc, i) => {
          const active = attacks.some(
            (a) => a.from.name === loc.name || a.to.name === loc.name,
          );

          if (!active) return null;

          return (
            <Marker key={i} coordinates={loc.coords}>
              <circle r={12} fill="#00ffff" opacity={0.08} />

              <circle r={7} fill="#00ffff" opacity={0.25} />

              <circle r={3} fill="#ffffff" />

              <text
                textAnchor="middle"
                y={-12}
                style={{
                  fill: "#00ffff",
                  fontSize: "10px",
                  fontFamily: "monospace",
                  letterSpacing: "1px",
                }}
              >
                {loc.name}
              </text>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}
