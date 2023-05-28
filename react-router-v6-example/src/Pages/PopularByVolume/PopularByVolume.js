import React, {useEffect, useState} from "react";
import axios from "axios";
import "./PopularByVolume.css";

function Popular() {
  const [page, setPage] = useState(0);
  const [popular, setPopular] = useState([]);
  const [sortedPopular, setSortedPopular] = useState([]);
  const itemsPerPage = 5;

  useEffect(() => {
    getPopular();
  }, []);

  useEffect(() => {
    // Sort the popular cryptocurrencies whenever the 'popular' state changes
    const sortedPopular = popular.sort(
      (a, b) => parseFloat(b.volume) - parseFloat(a.volume)
    );
    setSortedPopular(sortedPopular);
  }, [popular]);

  const getPopular = async () => {
    try {
      const url = `https://api.binance.com/api/v3/ticker/24hr`;
      const response = await axios.get(url);
      const popularData = response.data;
      setPopular(popularData);
    } catch (error) {
      console.error("Error fetching popular data:", error);
    }
  };

  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPopular = sortedPopular.slice(startIndex, endIndex);

  return (
    <div>
      <h1>Popular Cryptocurrencies</h1>
      <div className='container'>
        <div className='titlesrow'>
          <h2>Name</h2>
          <h2>Last Price</h2>
          <h2>24h Change</h2>
          <h2>24h Volume</h2>
        </div>
        <div className='popularcrypto'>
          {displayedPopular.map((crypto) => (
            <div className='crypto' key={crypto.symbol}>
              <h3> {crypto.symbol}</h3>
              <h3> {crypto.lastPrice}</h3>
              <h3> {crypto.priceChangePercent}</h3>
              <h3> {crypto.volume}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Popular;
