import React, { useEffect } from "react";
/**
 * Takes a list of gainers and creates a ws connection for each, adds event handlers and retruns the connections as an array
 */
export const useWebSocketConnections = (gainers) => {
	useEffect(() => {
		if (Object.keys(websockets).length === 0) return;

		const websocketInstances = Object.values(websockets).map((ws) => {
			const { symbol } = ws;
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
};
