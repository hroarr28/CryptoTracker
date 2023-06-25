// App.js

import React, {useState, useEffect, createContext} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import NavBar from "./Pages/NavBar/NavBar";
import LoginForm from "./Pages/LoginForm/LoginForm";
import Home from "./Pages/Home/Home";
import LoggedIn from "./Pages/LoggedIn/LoggedIn";
import {w3cwebsocket} from "websocket";

export const WebSocketContext = createContext(null);

function App() {
  const [loggedin, setLoggedin] = useState(false);
  const [popular, setPopular] = useState([]);
  const [chartTime, setChartTime] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [price, setPrice] = useState(null);
  const [formattedData, setFormattedData] = useState([]);
  const [generalData, setGeneralData] = useState([]);

  useEffect(() => {
    let ws = new w3cwebsocket("wss://stream.binance.com:9443/ws/!ticker@arr");

    ws.onopen = () => {
      console.log("connected");
    };

    ws.onmessage = (message) => {
      const response = JSON.parse(message.data);

      setGeneralData(response);

      setPrice(response.p);

      setChartTime(() =>
        response.map((item) => ({
          ...item,
          C: new Date(item.C).toLocaleString(),
        }))
      );

      setPopular((prevPopular) => {
        const top10Popular = response
          .filter((item) => item.s.endsWith("USDT"))
          .sort((a, b) => b.v - a.v)
          .slice(0, 10);
        return top10Popular;
      });

      setTopGainers((prevWebsockets) => {
        const top20Gainers = response
          .filter((item) => item.s.endsWith("USDT"))
          .sort((a, b) => b.P - a.P)
          .slice(0, 20);
        return top20Gainers;
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const btcIndex = chartTime.findIndex((item) => item.s === "BTCUSDT");

    if (btcIndex !== -1) {
      const convertedPrice = parseFloat(generalData[btcIndex].c);
      const timeString = chartTime[btcIndex].C;
      const timeParts = timeString.split(", ")[1].split(":");
      const hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]);
      const roundedMinutes = Math.round(minutes / 10) * 10;
      const formattedTime = `${hours
        .toString()
        .padStart(2, "0")}:${roundedMinutes.toString().padStart(2, "0")}`;

      const btcData = {
        time: formattedTime,
        price: convertedPrice,
        high: parseFloat(generalData[btcIndex].h), // Add high price
        low: parseFloat(generalData[btcIndex].l), // Add low price
      };

      setFormattedData((prevData) => {
        const newData = {
          ...prevData,
          [btcIndex]: btcData,
        };

        // Convert the object to an array
        const dataArray = Object.values(newData);

        return dataArray;
      });
    }
  }, [chartTime, generalData]);

  console.log(formattedData);

  return (
    <BrowserRouter>
      {formattedData.length > 0 && (
        <WebSocketContext.Provider value={{formattedData}}>
          <NavBar loggedin={loggedin} />

          <Routes>
            <Route
              path='/'
              element={<Home topGainers={topGainers} popular={popular} />}
            />
            <Route
              path='/login'
              element={<LoginForm setLoggedin={setLoggedin} />}
            />
            <Route path='/user' element={<LoggedIn />} />
          </Routes>
        </WebSocketContext.Provider>
      )}
    </BrowserRouter>
  );
}

export default App;
