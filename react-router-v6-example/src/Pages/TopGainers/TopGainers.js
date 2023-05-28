import React, {useEffect, useState} from "react";
import {css} from "@emotion/react";
import {CircleLoader} from "react-spinners";
import {w3cwebsocket} from "websocket";
import "./TopGainers.css";

const BinanceAPI = {
  baseUrl: "https://api.binance.com",
  endpoint: "/api/v3/ticker/24hr",
};

function TopGainers() {
  const [loading, setLoading] = useState(true);
  const [websockets, setWebsockets] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchGainersAndPrice();
  }, []);

  useEffect(() => {
    if (Object.keys(websockets).length === 0) return;

    const websocketInstances = Object.values(websockets).map((ws) => {
      const {symbol} = ws;
      const websocket = new w3cwebsocket(
        `wss://stream.binance.com:9443/ws/${symbol}@ticker`
      );

      websocket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        handleWebSocketData(symbol, data);
      };

      return websocket;
    });

    return () => {
      websocketInstances.forEach((ws) => {
        ws.onclose = () => {}; // Clear the `onclose` handler
        ws.close();
      });
    };
  }, [websockets]);

  const handleWebSocketData = (symbol, data) => {
    setWebsockets((prevWebsockets) => ({
      ...prevWebsockets,
      [symbol]: {
        ...prevWebsockets[symbol],
        percentageChange: data.P,
        price: data.p,
      },
    }));
  };

  const fetchGainersAndPrice = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${BinanceAPI.baseUrl}${BinanceAPI.endpoint}`
      );
      const data = await response.json();
      const filteredGainers = data.filter(
        (item) =>
          item.symbol.endsWith("USDT") &&
          parseFloat(item.priceChangePercent) > 0
      );
      const sortedGainers = filteredGainers
        .slice(0, 10)
        .sort(
          (a, b) =>
            parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
        );
      createWebsockets(sortedGainers);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      return; // Stop executing further code
    }
  };

  const createWebsockets = async (gainers) => {
    if (Object.keys(websockets).length >= 10) {
      return;
    }

    const newWebsockets = {};
    gainers.slice(0, 10).forEach((gainer) => {
      const symbol = gainer.symbol.toLowerCase();

      const websocket = new w3cwebsocket(
        `wss://stream.binance.com:9443/ws/${symbol}@ticker`
      );

      websocket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        handleWebSocketData(symbol, data);
      };

      newWebsockets[symbol] = {
        symbol: formatSymbol(symbol),
        percentageChange: gainer.priceChangePercent,
        price: gainer.lastPrice,
      };
    });

    setWebsockets((prevWebsockets) => ({
      ...prevWebsockets,
      ...newWebsockets,
    }));
  };

  const formatSymbol = (symbol) => {
    const usdtIndex = symbol.toUpperCase().lastIndexOf("USDT");
    if (usdtIndex !== -1) {
      const base = symbol.substring(0, usdtIndex);
      const quote = symbol.substring(usdtIndex);
      return `${base}/${quote}`.toUpperCase();
    }
    return symbol;
  };

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(0, prevPage - 1));
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(Object.keys(websockets).length / 5);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const startIndex = currentPage * 5;
  const endIndex = startIndex + 5;
  const visibleWebsockets = Object.entries(websockets).slice(
    startIndex,
    endIndex
  );

  return (
    <div>
      <h1 className='title'>Daily Top Gainers</h1>
      <div className='carousel-container'>
        <div className='carousel'>
          {loading ? (
            <CircleLoader color='#F3BA2F' css={override} size={50} />
          ) : (
            <>
              <button
                className='carousel-button'
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
              >
                Previous
              </button>
              {visibleWebsockets.map(([symbol, gainerData]) => {
                const {percentageChange, price} = gainerData;
                return (
                  <div key={symbol} className='carousel-item'>
                    <h3>{formatSymbol(symbol)}</h3>
                    <h3>{percentageChange}%</h3>
                    <h3>${price}</h3>
                  </div>
                );
              })}
              {Object.keys(websockets).length > 5 && (
                <div className='carousel-navigation'>
                  <button
                    className='carousel-button'
                    onClick={handleNextPage}
                    disabled={
                      currentPage ===
                      Math.ceil(Object.keys(websockets).length / 5) - 1
                    }
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopGainers;
