import React, { useEffect, useState } from "react";
import axios from "axios";
import { css } from "@emotion/react";
import { CircleLoader } from "react-spinners";
import "./TopGainers.css";
import { w3cwebsocket } from "websocket";

const BinanceAPI = {
	baseUrl: "https://api.binance.com",
	endpoint: "/api/v3/ticker/24hr"
};

function TopGainers() {
	/* 
    SAMS NOTE: this is a good case for TS since the data could be really complex and without knowing the API having types would help other devs understand what
    is going on and what data to expect.
  */

	const [gainers, setGainers] = useState([]);
	const [page, setPage] = useState(0);
	const itemsPerPage = 5;
	const startIndex = page * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const websockets = []; // Array to hold WebSocket connections

	const [loading, setLoading] = useState(true);
	const [displayedGainers, setDisplayedGainers] = useState([]);
	const [price, setPrice] = useState({});

	useEffect(() => {
		fetchGainersAndPrice();
	}, []);

	// SAMS NOTE - This would be a good place to use a custom hook - something like useConnectWebSocket - if that sounds totally new let's talk about custom hooks!
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
	}, []);

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
			const sortedGainers = filteredGainers
				.sort(
					(a, b) =>
						parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
				)
				.slice(0, 10); // testing with a smaller sample size first
			setGainers(sortedGainers);
			setDisplayedGainers(sortedGainers.slice(startIndex, endIndex));

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
		// check if the data we've recieved should be displayed so we only have to handle that case, we'll take the index so it's easier for us to update state later.
		const matchedGainerIndex = displayedGainers.findIndex(
			(gainer) => gainer.symbol.toLowerCase() === symbol
		);
		if (matchedGainerIndex !== -1) {
			console.log({ matchedGainerIndex });
			console.log("DATA FOR: ", symbol, data);
			// in here we need to update the displayed state with any properties that have changed on the matched gainer
			// make a new object for the updated gainer
			if (displayedGainers[matchedGainerIndex].lastPrice === data.a) return;

			const updatedGainer = {
				...displayedGainers[matchedGainerIndex],
				lastPrice: data.a
			};
			// put the updated object into state
			setDisplayedGainers((state) => [
				...state.slice(0, matchedGainerIndex),
				updatedGainer,
				...state.slice(matchedGainerIndex)
			]);
		}
		// Handle received data for the symbol
		// Update the state or perform any necessary actions
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
			<h1 className="title">Daily Top Gainers</h1>
			<div className="carousel-container">
				<button
					className="carousel-button left"
					disabled={page === 0}
					onClick={handlePrevious}
				>
					&lt;
				</button>
				<div className="carousel">
					{loading ? (
						<CircleLoader
							color="#F3BA2F"
							css={override}
							size={50}
						/>
					) : (
						displayedGainers.map((gainer, index) => (
							<div
								key={gainer.symbol}
								className="carousel-item"
							>
								<h3>{formatTickerSymbol(gainer.symbol)}</h3>
								<h3>{gainer.priceChangePercent}%</h3>
								<h3>${gainer.lastPrice}</h3>
							</div>
						))
					)}
				</div>
				<button
					className="carousel-button right"
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
