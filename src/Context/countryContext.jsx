import { createContext, useState } from "react";

export const CountryContext = createContext();

export const CountryProvider = ({ children }) => {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newsData, setNewsData] = useState("");
  const [liveFeed, setLiveFeed] = useState("");
  const [passport, setPassport] = useState("")
  const [allCcountriesPassportRanking, setAllCcountriesPassportRanking] = useState("")


  async function getCountry(name) {
    try {
      setLoading(true);

      const res = await fetch(`http://localhost:4000/api/v1/countries/${name}`);
      const data = await res.json();

      setCountry(data.data);
      console.log(data.data)
      
      getNews(name)
      getLiveFeed(name)
    } catch (error) {
      console.log("Error fetching country:", error);
    } finally {
      setLoading(false);
    }
  }

   async function getNews(country) {
    try {
      setLoading(true);

      const res = await fetch(`http://localhost:4000/api/v1/news?country=${country}`)
      const data = await res.json();

      setNewsData(data.results);
      console.log(data.results)
    } catch (error) {
      console.log("Error fetching country:", error);
    } finally {
      setLoading(false);
    }
  }

   async function getLiveFeed(country) {
    try {
      setLoading(true);

      const res = await fetch(`http://localhost:4000/api/v1/streams?country=${country}`)
      const data = await res.json();

      setLiveFeed(data.streams);
      console.log(data.streams)
    } catch (error) {
      console.log("Error fetching country:", error);
    } finally {
      setLoading(false);
    }
  }

  async function getPassportData(name) {
    try {
      setLoading(true);

      const res = await fetch(`http://localhost:4000/api/v1/passport/${name}`);
      const data = await res.json();

      const res2 = await fetch(`http://localhost:4000/api/v1/countries/${name}`);
      const data2 = await res2.json();

      setCountry(data2.data);

      setPassport(data.data);
      console.log(data.data)
      
      // getNews(name)
      // getLiveFeed(name)
    } catch (error) {
      console.log("Error fetching country:", error);
    } finally {
      setLoading(false);
    }
  }

  

  return (
    <CountryContext.Provider
      value={{
        country,
        loading,
        getCountry,
        setCountry,
        newsData,
        liveFeed,
        getPassportData,
        passport
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};