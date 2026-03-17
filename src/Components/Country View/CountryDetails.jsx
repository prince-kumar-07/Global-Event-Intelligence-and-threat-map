import React, { useContext, useEffect, useState } from "react";
import { CountryContext } from "../../Context/countryContext";
import styles from "./CountryDetails.module.css";
import { useParams } from "react-router-dom";

/* ── NUMBER FORMATTER ── */
const formatNumber = (num) => {
  if (num === null || num === undefined || num === "") return "Data not available";
  if (typeof num !== "number") return num;
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(num);
};

/* ── CLOCK HELPER (pure function, not a hook) ── */
const getCountryTime = (timezone) => {
  if (!timezone) return "Data not available";
  try {
    const match = timezone.match(/UTC([+-]\d{2}):?(\d{2})?/);
    if (!match) return "Data not available";
    const hours   = parseInt(match[1]);
    const minutes = parseInt(match[2] || 0);
    const offsetMinutes = hours * 60 + Math.sign(hours) * minutes;
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const localTime = new Date(utc + offsetMinutes * 60000);
    return localTime.toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  } catch {
    return "Data not available";
  }
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const CountryDetails = () => {

  const { country, getCountry } = useContext(CountryContext);
  const { country: countryName } = useParams();

  // ── ALL HOOKS MUST BE DECLARED BEFORE ANY EARLY RETURN ──
  const [currentTime, setCurrentTime] = useState("");

  // Fetch country data when route param changes
  useEffect(() => {
    if (countryName) getCountry(countryName);
  }, [countryName]);

  // Live clock — always runs, guards internally when data absent
  useEffect(() => {
    if (!country?.timezone) return;

    const update = () => setCurrentTime(getCountryTime(country.timezone));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [country?.timezone]);

  // ── EARLY RETURN AFTER ALL HOOKS ──
  if (!country) {
    return (
      <div className={styles.loaderWrap}>
        <div className={styles.spinner} />
        <p className={styles.loaderText}>Fetching intelligence</p>
      </div>
    );
  }

  /* timestamps */
  const lastUpdatedUTC = country.updatedAt
    ? new Date(country.updatedAt).toUTCString()
    : "Data not available";

  const lastUpdatedIST = country.updatedAt
    ? new Date(country.updatedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    : "Data not available";

  /* ── RENDER ── */
  return (
    <div className={styles.page}>
      <div className={styles.noise} />

      {/* HERO */}
      <header className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Country Profile Report</span>
          <h1 className={styles.heroTitle}>{country.name}</h1>
          <div className={styles.heroSub}>
            <span className={styles.pill}>{country.capital}</span>
            <span className={styles.pill}>{country.region}</span>
            <span className={styles.pill}>{country.continent}</span>
          </div>
        </div>
      </header>

      <div className={styles.divider} />

      {/* CONTENT */}
      <main className={styles.main}>

        <Section index="01" title="General">
          <Field label="Country Code"    value={country.countryCode} />
          <Field label="ISO 3"           value={country.iso3} />
          <Field label="Continent"       value={country.continent} />
          <Field label="Population"      value={formatNumber(country.population)} />
          <Field label="Currency"        value={country.currency} />
          <Field label="Currency Symbol" value={country.currencySymbol} />
          <Field label="Timezone"        value={country.timezone} />
          <Field label="Current Time"    value={currentTime} />
        </Section>

        <Section index="02" title="Geography">
          <Field label="Latitude"  value={country.latitude} />
          <Field label="Longitude" value={country.longitude} />
          <br />
          <Field
            label="Borders"
            value={
              country.geography?.borders?.length
                ? `${country.geography.borders.length} (${country.geography.borders.join(", ")})`
                : "Data not available"
            }
          />
          <br />
          <Field
            label="Major Cities"
            value={
              country.geography?.majorCities?.length
                ? `${country.geography.majorCities.length} (${country.geography.majorCities.join(", ")})`
                : "Data not available"
            }
          />
        </Section>

        <Section index="03" title="Demographics">
          <Field
            label="Population Density"
            value={formatNumber(country.demographics?.populationDensity) + " people/km²"}
          />
          <Field
            label="Median Age"
            value={formatNumber(country.demographics?.medianAge) + " years"}
          />
        </Section>

        <Section index="04" title="Economy">
          <Field label="GDP"               value={"$ " + formatNumber(country.economy?.gdp)} />
          <Field label="GDP Per Capita"    value={"$ " + formatNumber(country.economy?.gdpPerCapita)} />
          <Field label="Inflation Rate"    value={formatNumber(country.economy?.inflationRate) + " %"} />
          <Field label="Unemployment Rate" value={formatNumber(country.economy?.unemploymentRate) + " %"} />
        </Section>

        <Section index="05" title="Infrastructure">
          <Field label="Internet Penetration"  value={formatNumber(country.infrastructure?.internetPenetration) + " %"} />
          <Field label="Cloud Regions"         value={formatNumber(country.infrastructure?.cloudRegions)} />
          <Field label="Data Centers"          value={formatNumber(country.infrastructure?.dataCenters)} />
          <Field label="Mobile Subscriptions"  value={formatNumber(country.infrastructure?.mobileSubscriptions) + " subscriptions per 100 people"} />
          <Field label="Submarine Cables"      value={formatNumber(country.infrastructure?.submarineCables)} />
        </Section>

        <Section index="06" title="Cyber Intelligence">
          <Field label="Security Index"      value={formatNumber(country.cyber?.cyberSecurityIndex)} />
          <Field label="Data Breaches"       value={formatNumber(country.cyber?.dataBreaches)} />
          <Field label="Malware Incidents"   value={formatNumber(country.cyber?.malwareIncidents)} />
          <Field label="Phishing Incidents"  value={formatNumber(country.cyber?.phishingIncidents)} />
          <Field label="Ransomware Incidents"value={formatNumber(country.cyber?.ransomwareIncidents)} />
        </Section>

        <Section index="07" title="Government">
          <Field label="Government Type"   value={country.government?.governmentType} />
          <Field label="Head of State"     value={country.government?.headOfState} />
          <Field label="UN Member"         value={country.government?.unMember  ? "Yes" : "No"} />
          <Field label="EU Member"         value={country.government?.euMember  ? "Yes" : "No"} />
          <Field label="NATO Member"       value={country.government?.natoMember ? "Yes" : "No"} />
          <Field label="Independence Year" value={country.government?.independenceYear} />
        </Section>

        <Section index="08" title="Energy">
          <Field label="Oil Production"        value={formatNumber(country.energy?.oilProduction)} />
          <Field label="Oil Reserves"          value={formatNumber(country.energy?.oilReserves)} />
          <Field label="Electricity Production"value={formatNumber(country.energy?.electricityProduction)} />
          <Field label="Renewable Energy"      value={formatNumber(country.energy?.renewableEnergyPercent) + " %"} />
        </Section>

        <Section index="09" title="Military">
          <Field label="Active Personnel"  value={formatNumber(country.military?.activePersonnel)} />
          <Field label="Reserve Personnel" value={formatNumber(country.military?.reservePersonnel)} />
          <Field label="Defense Budget"    value={"$ " + formatNumber(country.military?.defenseBudget)} />
          <Field label="Nuclear Weapons"   value={formatNumber(country.military?.nuclearWeapons)} />
        </Section>

        <Section index="10" title="Risk Intelligence">
          <Field label="Political Stability" value={country.risk?.politicalStability} />
          <Field label="Terrorism Index"     value={country.risk?.terrorismIndex} />
          <Field label="Disaster Risk Index" value={country.risk?.disasterRiskIndex} />
        </Section>

        <Section index="11" title="Trade">
          <Field label="Exports"               value={formatNumber(country.trade?.exports)} />
          <Field label="Imports"               value={formatNumber(country.trade?.imports)} />
          <Field label="Trade Balance"         value={formatNumber(country.trade?.tradeBalance)} />
          <Field label="Major Export Partners" value={country.trade?.majorExportPartners?.join(", ")} />
        </Section>

        <Section index="12" title="Tech Ecosystem">
          <Field label="Startups"        value={formatNumber(country.tech?.startups)} />
          <Field label="Unicorns"        value={country.tech?.unicorns} />
          <Field label="Tech Talent Rank"value={country.tech?.techTalentRank} />
        </Section>

        <Section index="13" title="Transport">
          <Field label="Airports"   value={formatNumber(country.transport?.airports)} />
          <Field label="Seaports"   value={country.transport?.seaports} />
          <Field label="Rail Length"value={formatNumber(country.transport?.railLength) + " km"} />
          <Field label="Road Length"value={formatNumber(country.transport?.roadLength) + " km"} />
        </Section>

        <Section index="14" title="Climate">
          <Field label="CO2 Emissions"            value={formatNumber(country.climate?.co2Emissions)} />
          <Field label="Climate Risk Index"        value={country.climate?.climateRiskIndex} />
          <Field label="Natural Disasters / Year"  value={country.climate?.naturalDisastersPerYear} />
        </Section>

        {/* Rankings */}
        <section className={styles.rankSection}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionIndex}>
              <span className={styles.dot} />15
            </span>
            <h2 className={styles.sectionTitle}>Global Rankings</h2>
          </div>
          <div className={styles.rankGrid}>
            <RankBar label="Passport"      value={country.rankings?.passportRank} />
            <RankBar label="Happiness"     value={country.rankings?.happinessRank} />
            <RankBar label="Peace"         value={country.rankings?.peaceRank} />
            <RankBar label="Military"      value={country.rankings?.militaryRank} />
            <RankBar label="Corruption"    value={country.rankings?.corruptionIndex} />
            <RankBar label="Cyber Security"value={country.rankings?.cyberSecurityIndexRank} />
            <RankBar label="Democracy"     value={country.rankings?.democracyIndex} />
            <RankBar label="HDI"           value={country.rankings?.hdiIndex} />
            <RankBar label="Innovation"    value={country.rankings?.innovationIndex} />
            <RankBar label="Press Freedom" value={country.rankings?.pressFreedomIndex} />
          </div>
        </section>

        <div className={styles.updateInfo}>
          <div className={styles.updateRow}>
            <span className={styles.updateLabel}>Last Updated (UTC)</span>
            <span className={styles.updateValue}>{lastUpdatedUTC}</span>
          </div>
          <div className={styles.updateRow}>
            <span className={styles.updateLabel}>Last Updated (IST)</span>
            <span className={styles.updateValue}>{lastUpdatedIST}</span>
          </div>
        </div>

      </main>
    </div>
  );
};

/* ── HELPERS ── */

const Section = ({ index, title, children }) => (
  <section className={styles.section}>
    <div className={styles.sectionHead}>
      <span className={styles.sectionIndex}>
        <span className={styles.dot} />{index}
      </span>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </div>
    <div className={styles.fieldGrid}>{children}</div>
  </section>
);

const Field = ({ label, value }) => (
  <div className={styles.field}>
    <span className={styles.fieldLabel}>{label}</span>
    <span className={styles.fieldValue}>{value ?? "Data not available"}</span>
  </div>
);

const RankBar = ({ label, value }) => {
  if (value === null || value === undefined) {
    return (
      <div className={styles.rankItem}>
        <div className={styles.rankMeta}>
          <span className={styles.rankLabel}>{label}</span>
          <span className={styles.rankValue}>Data not available</span>
        </div>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: "0%" }} />
        </div>
      </div>
    );
  }

  const pct = Math.min(100, (200 - value) / 2);

  return (
    <div className={styles.rankItem}>
      <div className={styles.rankMeta}>
        <span className={styles.rankLabel}>{label}</span>
        <span className={styles.rankValue}>#{value}</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default CountryDetails;