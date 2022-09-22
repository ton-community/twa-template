import {
  RemoteConnectPersistance,
  TonhubConnectProvider,
  useTonhubConnect,
} from "react-ton-x";
import useLocalStorage from "use-local-storage";
import isMobile from "is-mobile";

import QRCode from "react-qr-code";

import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Address, fromNano, TonClient } from "ton";
import { MainButton } from "@twa-dev/sdk/react";
import { TransferTon } from "./TransferTon";

export default function TonConnector() {
  const [connectionState, setConnectionState] =
    useLocalStorage<RemoteConnectPersistance>("connection", {
      type: "initing",
    });

  return (
    <TonhubConnectProvider
      network="mainnet"
      url={`https://aaa.com`}
      name="YOUR APP NAME"
      debug={false}
      connectionState={connectionState}
      setConnectionState={(s) => {
        setConnectionState(s as RemoteConnectPersistance);
      }}
    >
      <_TonConnecterInternal />
      {/* {connect.state.type === "online" && <TransferTon />} */}
    </TonhubConnectProvider>
  );
}

function _TonConnecterInternal() {
  const connect = useTonhubConnect();
  const isConnected = connect.state.type === "online";

  return (
    <div style={{ textAlign: "left", marginBottom: 20 }}>
      {!isConnected && <TonConnect />}
      {isConnected && <TonWalletDetails />}
      {isConnected && <TransferTon />}
    </div>
  );
}

function TonConnect() {
  const connect = useTonhubConnect();

  // @ts-ignore
  console.log(connect.state?.walletConfig?.address);
  const [_, setConnectionState] = useLocalStorage<RemoteConnectPersistance>(
    "connection",
    { type: "initing" }
  );

  if (connect.state.type === "initing") {
    return <span>Waiting for session</span>;
  }
  if (connect.state.type === "pending") {
    return (
      <div>
        {isMobile() && (
          <button
            onClick={() => {
              // @ts-ignore
              window.location.href = connect.state.link.replace(
                "ton://",
                "https://tonhub.com/"
              );
            }}
          >
            Authorize{" "}
          </button>
        )}
        {!isMobile() && (
          <div>
            Scan with your mobile tonhub wallet:
            <br />
            <br />
            <QRCode value={connect.state.link} />
          </div>
        )}
      </div>
    );
  }
  return <TonWalletDetails />;
}

function TonWalletDetails() {
  const connect = useTonhubConnect();

  // @ts-ignore
  const { isLoading, error, data, isFetching, fetchStatus, status } = useQuery(
    ["balance"],
    async () => {
      const tc = new TonClient({
        endpoint: "https://scalable-api.tonwhales.com/jsonRPC",
      });
      const b = await tc.getBalance(
        // @ts-ignore
        Address.parse(connect.state?.walletConfig?.address)
      );

      return `${fromNano(b)} TON`;
    },
    // @ts-ignore
    { enabled: !!connect.state?.walletConfig?.address }
  );

  return (
    <>
      <div>
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {/* @ts-ignore */}
            Address: {connect.state.walletConfig.address}
          </div>
          <div>Balance: {isLoading ? "Loading..." : data}</div>
        </div>
        {/* @ts-ignore */}
        {connect.state.walletConfig.address && (
          <button
            onClick={() => {
              localStorage.removeItem("connection");
              window.location.reload();
            }}
          >
            Disconnect
          </button>
        )}
      </div>
    </>
  );
}
