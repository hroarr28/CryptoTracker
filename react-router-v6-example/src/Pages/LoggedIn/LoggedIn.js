import React, {useEffect, useState, useRef} from "react";
import {w3cwebsocket} from "websocket";
import "./LoggedIn.css";
import {Line} from "react-chartjs-2";

function LoggedIn() {
  const [searchClicked, setSearchClicked] = useState(false);
  const [search, setSearch] = useState("");
  const [showData, setShowData] = useState(false); // New state variable
  const tickerDataRef = useRef([]);

  const initializeWebSocket = () => {
    const ws = new w3cwebsocket(
      `wss://stream.binance.com:9443/ws/${search.toLowerCase()}@kline_1h`
    );

    ws.onopen = () => {
      console.log("connected");
    };

    ws.onmessage = (message) => {
      const response = JSON.parse(message.data);
      const {k: klineData} = response; // Extract kline data from the WebSocket message
      const {t: time, c: close, o: open, h: high, l: low} = klineData;
      const formattedData = {time, close, open, high, low};
      tickerDataRef.current = [...tickerDataRef.current, formattedData];
      console.log(tickerDataRef.current);
      setSearchClicked(true);
      setShowData(true); // Show the data
    };
  };

  useEffect(() => {
    console.log(tickerDataRef.current);
  }, []);

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

  const renderChart = () => {
    if (!tickerDataRef.current || tickerDataRef.current.length === 0) {
      return null;
    }

    const chartData = {
      labels: tickerDataRef.current.map((data) => data.t),
      datasets: [
        {
          label: "Price",
          data: tickerDataRef.current.map((data) => ({
            high: data.h,
            low: data.l,
          })),
          fill: false,
          borderColor: "#82ca9d",
          tension: 0.1,
        },
      ],
    };

    return (
      <div>
        <h2>Chart</h2>
        <Line data={chartData} />
      </div>
    );
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

      {searchClicked && showData && (
        <div>
          <div>{renderChart()}</div>
        </div>
      )}
    </div>
  );
}

export default LoggedIn;
