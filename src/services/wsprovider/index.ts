import { WebSocketProvider } from "ethers";

const KEEP_ALIVE_CHECK_INTERVAL = 15000;
const EXPECTED_PONG_BACK = 7500;

/**
 * Create a WebSocketProvider with keep-alive functionality
 *
 * The reason for this is that the WebSocketProvider does not have a built-in keep-alive mechanism.
 *
 * Inspiration: https://github.com/ethers-io/ethers.js/issues/1053#issuecomment-808736570
 * @param url
 * @returns WebSocketProvider
 */
export const createWebSocketProvider = (url: string) => {
  const configWebSocket = () => {
    const ws = new WebSocket(url);

    let pingTimeout: ReturnType<typeof setTimeout>;
    let keepAliveInterval: ReturnType<typeof setTimeout>;

    ws.onopen = () => {
      keepAliveInterval = setInterval(() => {
        ws.send("ping");
        // Use `WebSocket#terminate()`, which immediately destroys the connection,
        // instead of `WebSocket#close()`, which waits for the close timer.
        // Delay should be equal to the interval at which your server
        // sends out pings plus a conservative assumption of the latency.
        pingTimeout = setTimeout(() => {
          ws.close();
        }, EXPECTED_PONG_BACK);
      }, KEEP_ALIVE_CHECK_INTERVAL);
      // TODO: handle contract listeners setup + indexing
    };

    ws.onclose = () => {
      clearInterval(keepAliveInterval);
      clearTimeout(pingTimeout);
    };

    ws.onmessage = (event) => {
      if (event.data === "pong") {
        clearInterval(pingTimeout);
      }
    };

    return ws;
  };
  return new WebSocketProvider(configWebSocket);
};
