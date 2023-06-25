// LoggedIn.js

import React, {useContext} from "react";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip} from "recharts";
import {WebSocketContext} from "../../App";

const LoggedIn = () => {
  const {formattedData} = useContext(WebSocketContext);

  const low = formattedData.low;
  const high = formattedData.high;

  return (
    <div>
      <LineChart width={600} height={300} data={formattedData}>
        <Line type='monotone' dataKey='price' stroke='#8884d8' />
        <XAxis dataKey='time' />
        <YAxis domain={[low, high]} />
        <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
      </LineChart>
    </div>
  );
};

export default LoggedIn;
