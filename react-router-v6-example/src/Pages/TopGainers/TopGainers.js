import React, {useEffect, useState} from "react";
import axios from "axios";
import {css} from "@emotion/react";
import {CircleLoader} from "react-spinners";
import "./TopGainers.css";
import {w3cwebsocket} from "websocket";

const BinanceAPI = {
  baseUrl: "https://api.binance.com",
  endpoint: "/api/v3/ticker/24hr",
};

function TopGainers() {
  const [gainers, setGainers] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState({});
  const itemsPerPage = 5;
  const websockets = []; // Array to hold WebSocket connections

  useEffect(() => {
    fetchGainersAndPrice();
  }, []);

  useEffect(() => {
    // Create a WebSocket connection for each gainer symbol
    gainers.forEach((gainer) => {
      const symbol = gainer.symbol.toLowerCase();
      const ws = new w3cwebsocket(
        `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`
      );

      // Handle WebSocket message
      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        // Handle received data for the symbol
        // Update the state or perform any necessary actions
        handleWebSocketData(symbol, data);
      };

      websockets.push(ws); // Store the WebSocket connection in the array
    });

    // Cleanup function
    return () => {
      // Close WebSocket connections on component unmount
      websockets.forEach((ws) => {
        ws.close();
      });
    };
  }, [gainers]);

  const fetchGainersAndPrice = async () => {
    setLoading(true); // Set loading to true before fetching data

    try {
      const response = await axios.get(
        `${BinanceAPI.baseUrl}${BinanceAPI.endpoint}`
      );
      const data = response.data;
      const filteredGainers = data.filter(
        (item) =>
          item.symbol.endsWith("USDT") &&
          parseFloat(item.priceChangePercent) > 0
      );
      const sortedGainers = filteredGainers.sort(
        (a, b) =>
          parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
      );
      setGainers(sortedGainers);

      // Fetch prices for each gainer symbol
      // const prices = {};
      // for (let gainer of sortedGainers) {
      //   const symbol = gainer.symbol;
      //   const priceResponse = await axios.get(
      //     `${BinanceAPI.baseUrl}${BinanceAPI.price}${symbol}`
      //   );
      //   const priceData = priceResponse.data;
      //   prices[symbol] = priceData.price;
      // }
      // setPrice(prices);

      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleWebSocketData = (symbol, data) => {
    // Handle received data for the symbol
    // Update the state or perform any necessary actions
    console.log(symbol, data);
  };

  const formatTickerSymbol = (symbol) => {
    const index = symbol.lastIndexOf("USDT");
    if (index !== -1) {
      const base = symbol.substring(0, index);
      const quote = symbol.substring(index);
      return `${base}/${quote}`;
    }
    return symbol;
  };

  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedGainers = gainers.slice(startIndex, endIndex);

  const handleNext = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevious = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  return (
    <div>
      <h1 className='title'>Daily Top Gainers</h1>
      <div className='carousel-container'>
        <button
          className='carousel-button left'
          disabled={page === 0}
          onClick={handlePrevious}
        >
          &lt;
        </button>
        <div className='carousel'>
          {loading ? (
            <CircleLoader color='#F3BA2F' css={override} size={50} />
          ) : (
            websockets.map((gainer, index) => (
              <div key={gainer.symbol} className='carousel-item'>
                <h3>{formatTickerSymbol(gainer.symbol)}</h3>
                <h3>{gainer.priceChangePercent}%</h3>
                <h3>${gainer.price}</h3>
              </div>
            ))
          )}
        </div>
        <button
          className='carousel-button right'
          disabled={endIndex >= gainers.length}
          onClick={handleNext}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default TopGainers;
