import {
  RemoteConnectPersistance,
  TonhubConnectProvider,
  useTonhubConnect,
} from "react-ton-x";
import useLocalStorage from "use-local-storage";
import isMobile from "is-mobile";
import BN from "bn.js";
import QRCode from "react-qr-code";

import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Address, fromNano, TonClient } from "ton";
import { MainButton } from "@twa-dev/sdk/react";
import { TransferTon } from "./TransferTon";
import { Card } from "./Card";
import { Counter } from "./Counter";

// TODO change to L3 client
export const tc = new TonClient({
  endpoint: "https://scalable-api.tonwhales.com/jsonRPC",
});

export default function TonConnector() {
  const [connectionState, setConnectionState] =
    useLocalStorage<RemoteConnectPersistance>("connection", {
      type: "initing",
    });

  return (
    <TonhubConnectProvider
      network="mainnet"
      url="https://ton.org/"
      name="TON TWA BOT"
      debug={false}
      connectionState={connectionState}
      setConnectionState={(s) => {
        setConnectionState(s as RemoteConnectPersistance);
      }}
    >
      <_TonConnecterInternal />
    </TonhubConnectProvider>
  );
}

function _TonConnecterInternal() {
  const connect = useTonhubConnect();
  const isConnected = connect.state.type === "online";

  return (
    <>
      {!isConnected && <TonConnect />}
      {isConnected && (
        <div style={{ textAlign: "left", marginBottom: 20 }}>
          <TonWalletDetails />
          <TransferTon />
          <Counter />
        </div>
      )}
    </>
  );
}

function TonConnect() {
  const connect = useTonhubConnect();

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
            Open Tonhub Wallet{" "}
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
      <Card title="Wallet">
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
      </Card>
    </>
  );
}
