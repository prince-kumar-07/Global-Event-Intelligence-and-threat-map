import { useEffect, useState } from "react";

function Header() {
  const [attacksToday, setAttacksToday] = useState(3495048);

  useEffect(() => {
    const interval = setInterval(() => {
      setAttacksToday((prev) => prev + Math.floor(Math.random() * 1500));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        width: "100%",
        textAlign: "center",
        zIndex: 10,
        background:
          "linear-gradient(180deg,#0a0f1a 0%,rgba(10,15,26,0.85) 60%,transparent)",
        paddingTop: "0px",
        paddingBottom: "0px",
      }}
    >
      <h1
        style={{
          color: "white",
          fontSize: "34px",
          letterSpacing: "3px",
          margin: 0,
          fontFamily: "monospace",
        }}
      >
        LIVE CYBER THREAT MAP
      </h1>

      <div
        style={{
          color: "#ff004c",
          fontSize: "20px",
          marginTop: "0px",
          letterSpacing: "2px",
          fontFamily: "monospace",
        }}
      >
        {attacksToday.toLocaleString()} ATTACKS ON THIS DAY
      </div>
    </div>
  );
}

export default Header;
