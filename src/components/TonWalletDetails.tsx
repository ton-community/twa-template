import { useTonhubConnect } from "react-ton-x";
import { useQuery } from "@tanstack/react-query";
import { Address, fromNano } from "ton";
import { Card } from "./Card";
import { tc } from "./Ton-Connector";

export function TonWalletDetails() {
  const connect = useTonhubConnect();

  // @ts-ignore
  const { isLoading, data } = useQuery(
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
