import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

function SearchTicker() {
  const [tickerData, setTickerData] = useState(null);
  const [search, setSearch] = useState("");

  const getTickerData = async () => {
    try {
      const url = `https://api.binance.com/api/v3/ticker/price?symbol=${search}`;
      const response = await axios.get(url);
      setTickerData(response.data);
    } catch (error) {
      console.error("Error fetching ticker data:", error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      getTickerData();
    }
  };
  return (
    <div>
      <input
        onChange={handleSearch}
        onKeyPress={handleKeyPress}
        type='text'
        placeholder='Search ticker'
      />
      <button onClick={getTickerData}>Search</button>
      {search && <h2>{search}</h2>}
      {tickerData && <h3>Price: {tickerData.price}</h3>}
    </div>
  );
}

export default SearchTicker;