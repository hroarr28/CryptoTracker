// Import the Axios library
import React from "react";
import SearchTicker from "../SearchTicker/SearchTicker";
import TopGainers from "../TopGainers/TopGainers";
import Popular from "../PopularByVolume/PopularByVolume";

function Home() {
  return (
    <div>
      <SearchTicker />
      <TopGainers />
      <Popular />
    </div>
  );
}

export default Home;
