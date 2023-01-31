import { Address, toNano, beginCell } from "ton";
import { Card } from "./Card";
import { useSendTxn } from "../hooks/useSendTxn";
import { TransactionWatcher } from "./TransactionWatcher";

import { TonConnectButton } from "@tonconnect/ui-react";
import { useCounterContract } from "../hooks/useCounterContract";
import { useTonConnect } from "../hooks/useTonConnect";

export function Counter() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  return (
    <div className="Container">
      <TonConnectButton />

      <div className="Card">
        <b>Counter Address</b>
        <div className="Hint">{address?.slice(0, 30) + "..."}</div>
        <b>Counter Value</b>
        <div>{value ?? "Loading..."}</div>
        <a
          className={`Button ${connected ? "Active" : "Disabled"}`}
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment
        </a>
      </div>
    </div>
  );
}
