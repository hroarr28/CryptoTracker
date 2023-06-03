import React from "react";
import axios from "axios";
import {useState, useEffect} from "react";

function SearchTicker() {
  const [tickerData, setTickerData] = useState(null);
  const [searchClicked, setSearchClicked] = useState(false);
  const [search, setSearch] = useState("");

  const getTickerData = async () => {
    try {
      const url = `https://api.binance.com/api/v3/ticker/price?symbol=${search}`;
      const response = await axios.get(url);
      setTickerData(response.data);
      setSearchClicked(true);
    } catch (error) {
      console.error("Error fetching ticker data:", error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      setSearchClicked(false);
    }
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
      {searchClicked && <h2>{search}</h2>}
      {searchClicked && <h3>Price: {tickerData.price}</h3>}
    </div>
  );
}

export default SearchTicker;
