import { useState, useEffect, useMemo, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import { geoMercator, geoPath } from "d3-geo";
import styles from "./CountryView.module.css";
import CountryDetails from "../Country View/CountryDetails";
import LiveEvents from "../Country View/LiveEvents";
import LiveStreams from "../Country View/Livestreams";
import { CountryContext } from "../../Context/countryContext";

const MAP_W = 420;
const MAP_H = 320;
const PAD   = 16;

/* ── NUMBER FORMATTER ── */

const formatNumber = (num) => {
  if (num === null || num === undefined || num === "") {
    return "Data not available";
  }

  if (typeof num !== "number") return num;

  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2
  }).format(num);
};

const GEO_URLS = [
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson",
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson",
];

const CACHE = new Map();

async function getFeatures(url) {
  if (!CACHE.has(url)) {
    const promise = fetch(url)
      .then(r => r.json())
      .then(json => json.features || [])
      .catch(() => []);
    CACHE.set(url, promise);
  }
  return CACHE.get(url);
}

function findFeature(features, iso3, name) {
  return features.find(f =>
    f.properties.ISO_A3 === iso3 ||
    f.properties.iso_a3 === iso3 ||
    f.properties.ADMIN?.toLowerCase() === name.toLowerCase()
  );
}

async function resolveFeature(iso3, name) {
  for (const url of GEO_URLS) {
    const features = await getFeatures(url);
    const feature  = findFeature(features, iso3, name);
    if (feature) return feature;
  }
  return null;
}

const TABS = [
  {
    id: "intelligence",
    label: "Country Profile",
    index: "01",
    desc: "Country profile & data",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    id: "events",
    label: "Live Events",
    index: "02",
    desc: "Real-time news & incidents",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="2.8" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M7.5 1v2M7.5 12v2M1 7.5h2M12 7.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M3.2 3.2l1.5 1.5M10.3 10.3l1.5 1.5M3.2 11.8l1.5-1.5M10.3 4.7l1.5-1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "surveillance",
    label: "Surveillance",
    index: "03",
    desc: "Live CCTV & camera feeds",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="3.5" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M10 6l4-2.5v7L10 8" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <circle cx="5.5" cy="7" r="1.4" stroke="currentColor" strokeWidth="1.1"/>
      </svg>
    ),
  },
];

export default function CountryView() {

  const { country }              = useParams();
  const { country: countryData } = useContext(CountryContext);

  const [activeTab, setActiveTab] = useState("intelligence");
  const [feature, setFeature]     = useState(null);
  const [status, setStatus]       = useState("loading");

  const data = useMemo(() => ({
    name: country || "India",
    code: (country || "India").slice(0, 2).toUpperCase(),
    iso3: (country || "India").slice(0, 3).toUpperCase(),
  }), [country]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const feat = await resolveFeature(data.iso3, data.name);
        if (cancelled) return;
        setFeature(feat);
        setStatus(feat ? "ready" : "notfound");
      } catch {
        setStatus("error");
      }
    }

    setStatus("loading");
    setFeature(null);
    load();

    return () => { cancelled = true; };

  }, [data]);

  useEffect(() => {
    setActiveTab("intelligence");
  }, [country]);

  const pathD = useMemo(() => {

    if (!feature) return null;

    const projection = geoMercator().fitExtent(
      [[PAD, PAD], [MAP_W - PAD, MAP_H - PAD]],
      feature
    );

    return geoPath(projection)(feature);

  }, [feature]);

  return (
    <div className={styles.page}>
      <div className={styles.noise} />

      {/* HERO */}

      <div className={styles.heroWrap}>
        <div className={styles.heroGlow} />

        <div className={styles.heroContent}>

          <div className={styles.heroLeft}>

            <span className={styles.eyebrow}>Country Overview</span>

            <div className={styles.flagRow}>
              <ReactCountryFlag
                countryCode={countryData?.countryCode || data.code}
                svg
                className={styles.flag}
              />
            </div>

            <h1 className={styles.heroTitle}>{data.name}</h1>

            {countryData && (
              <div className={styles.metaList}>

                {countryData.capital && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Capital</span>
                    <span className={styles.metaValue}>{countryData.capital}</span>
                  </div>
                )}

                {countryData.region && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Region</span>
                    <span className={styles.metaValue}>{countryData.region}</span>
                  </div>
                )}

                {countryData.population && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Population</span>
                    <span className={styles.metaValue}>
                      {formatNumber(countryData.population)}
                    </span>
                  </div>
                )}

                {countryData.currency && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Currency</span>
                    <span className={styles.metaValue}>{countryData.currency}</span>
                  </div>
                )}

              </div>
            )}

          </div>

          <div className={styles.heroRight}>

            <div className={styles.mapFrame}>

              {status === "loading" && (
                <div className={styles.mapStatus}>
                  <div className={styles.mapSpinner} />
                  <span className={styles.mapStatusText}>Loading map</span>
                </div>
              )}

              {status === "notfound" && (
                <div className={styles.mapStatus}>
                  <span className={styles.mapStatusText}>Map unavailable</span>
                </div>
              )}

              {status === "error" && (
                <div className={styles.mapStatus}>
                  <span className={styles.mapStatusText}>Failed to load</span>
                </div>
              )}

              {status === "ready" && pathD && (
                <svg
                  viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                  className={styles.mapSvg}
                  aria-label={`Map of ${data.name}`}
                >
                  <path d={pathD} className={styles.mapPath}/>
                </svg>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* TAB BAR */}

      <div className={styles.tabBar}>
        <div className={styles.tabBarInner}>

          {TABS.map(tab => (

            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >

              <span className={styles.tabIcon}>{tab.icon}</span>

              <span className={styles.tabBody}>
                <span className={styles.tabIndex}>{tab.index}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
                <span className={styles.tabDesc}>{tab.desc}</span>
              </span>

              <span className={styles.tabArrow}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>

              {activeTab === tab.id && (
                <span className={styles.tabIndicator}/>
              )}

            </button>

          ))}

        </div>
      </div>

      {/* TAB CONTENT */}

      <div className={styles.tabContent} key={activeTab}>

        {activeTab === "intelligence" && (
          <CountryDetails/>
        )}

        {activeTab === "events" && (
          <LiveEvents countryName={data.name}/>
        )}

        {activeTab === "surveillance" && (
          <LiveStreams countryName={data.name}/>
        )}

      </div>

    </div>
  );
}