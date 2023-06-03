import React, {useEffect, useState, useRef} from "react";
import {w3cwebsocket} from "websocket";
import "./LoggedIn.css";

function LoggedIn() {
  const [tickerData, setTickerData] = useState(null);
  const [searchClicked, setSearchClicked] = useState(false);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showData, setShowData] = useState(false); // New state variable

  const ws = useRef(null);

  useEffect(() => {
    // Clean up WebSocket connection on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const initializeWebSocket = () => {
    ws.current = new w3cwebsocket(
      `wss://stream.binance.com:9443/ws/${search.toLowerCase()}@ticker`
    );

    ws.current.onopen = () => {
      console.log("connected");
    };

    ws.current.onmessage = (message) => {
      const response = JSON.parse(message.data);
      setTickerData(response);
      setSearchClicked(true);
      setShowData(true); // Show the data
    };
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      setSearchClicked(false);
    }
  };

  const handleSearch = () => {
    if (search !== "") {
      initializeWebSocket();
      setSearchClicked(true);
      setSearch("");
    }
  };

  const addToFavorites = () => {
    const newFavorite = {
      symbol: tickerData?.s,
      price: tickerData?.p,
      percentChange: tickerData?.P,
      volume: tickerData?.v,
      high: tickerData?.h,
      low: tickerData?.l,
    };
    setFavorites((prevFavorites) => [...prevFavorites, newFavorite]);
    setSearchClicked(false);
    setTickerData(null); // Reset tickerData
    setShowData(false); // Hide the data
  };

  const removeFavorite = (index) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = [...prevFavorites];
      updatedFavorites.splice(index, 1);
      return updatedFavorites;
    });
  };

  return (
    <div>
      <h1>Profile</h1>

      <input
        onChange={handleChange}
        type='text'
        placeholder='Search for a crypto'
        value={search}
      />
      <button onClick={handleSearch}>Search</button>

      <div className='favorites'>
        <h2>Favorites:</h2>
        <ul className='favorites-list'>
          {favorites.map((favorite, index) => (
            <li key={index}>
              <h2>{favorite.symbol}</h2>
              <h3>Price: {favorite.price}</h3>
              <h3>24h Change: {favorite.percentChange}</h3>
              <h3>24h Volume: {favorite.volume}</h3>
              <h3>24h High: {favorite.high}</h3>
              <h3>24h Low: {favorite.low}</h3>
              <button onClick={() => removeFavorite(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      {searchClicked &&
        showData && ( // Only show if searchClicked and showData are true
          <div>
            <h2>{tickerData.s}</h2>
            <h3>Price: {tickerData.p}</h3>
            <h3>24h Change: {tickerData.P}</h3>
            <h3>24h Volume: {tickerData.v}</h3>
            <h3>24h High: {tickerData.h}</h3>
            <h3>24h Low: {tickerData.l}</h3>
            <div>
              <button onClick={addToFavorites}>Add to Favorites</button>
            </div>
          </div>
        )}
    </div>
  );
}

export default LoggedIn;
