// Import the Axios library
import React from "react";
import SearchTicker from "../SearchTicker/SearchTicker";
import TopGainers from "../TopGainers/TopGainers";
import Popular from "../PopularByVolume/PopularByVolume";

function Home(props) {
  return (
    <div>
      <SearchTicker />
      <TopGainers topGainers={props.topGainers} />
      <Popular popular={props.popular} />
    </div>
  );
}

export default Home;
