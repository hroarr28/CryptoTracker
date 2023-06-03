import React, {useEffect, useState} from "react";
import axios from "axios";
import "./PopularByVolume.css";
import {w3cwebsocket} from "websocket";

function convertVolume(volume) {
  if (volume >= 1e9) {
    // Convert to billions
    return (volume / 1e9).toFixed(2) + "B";
  } else if (volume >= 1e6) {
    // Convert to millions
    return (volume / 1e6).toFixed(2) + "M";
  } else {
    return volume;
  }
}

function Popular() {
  const [popular, setPopular] = useState([]);

  // connect to the websocket and sort the data by most volume in the last 24 hours
  // display the top 10

  let ws = new w3cwebsocket("wss://stream.binance.com:9443/ws/!ticker@arr");

  useEffect(() => {
    ws.onopen = () => {
      console.log("connected");
    };

    ws.onmessage = (message) => {
      const response = JSON.parse(message.data);

      setPopular((prevPopular) => {
        const top10Popular = response
          .filter((item) => item.s.endsWith("USDT"))
          .sort((a, b) => b.v - a.v)
          .slice(0, 10);
        return top10Popular;
      });
    };
  }, []);

  console.log(popular);

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
          {popular.map((item) => (
            <div className='crypto' key={item.s}>
              <h3>{`${item.s.slice(0, -4)}/USDT`}</h3>
              <h3> ${item.p}</h3>
              <h3> {item.P}%</h3>
              <h3 style={{color: "green"}}> {convertVolume(item.v)}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Popular;
