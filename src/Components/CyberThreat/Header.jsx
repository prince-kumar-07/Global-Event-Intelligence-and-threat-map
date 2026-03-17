import { useEffect, useState } from "react";
import styles from "./Header.module.css";

function Header() {

  const [attacksToday, setAttacksToday] = useState(3495048);

  useEffect(() => {

    const interval = setInterval(() => {
      setAttacksToday(prev => prev + Math.floor(Math.random() * 1500));
    }, 1200);

    return () => clearInterval(interval);

  }, []);

  return (

    <div className={styles.header}>

      <h1 className={styles.title}>
        LIVE CYBER THREAT MAP
      </h1>

      <div className={styles.counter}>
        {attacksToday.toLocaleString()} ATTACKS ON THIS DAY
      </div>

    </div>

  );
}

export default Header;