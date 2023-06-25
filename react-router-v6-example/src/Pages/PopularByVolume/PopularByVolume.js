import React, {useEffect, useState} from "react";
import axios from "axios";
import "./PopularByVolume.css";
import {w3cwebsocket} from "websocket";

function Popular(props) {
  function convertVolume(volume) {
    if (volume > 1000000000) {
      return `${(volume / 1000000000).toFixed(2)}B`;
    } else if (volume > 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`;
    } else if (volume > 1000) {
      return `${(volume / 1000).toFixed(2)}K`;
    } else {
      return volume;
    }
  }

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
          {props.popular.map((item) => (
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
