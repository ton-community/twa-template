import { useState } from "react";
import { useTonhubConnect } from "react-ton-x";
import { Address, Cell, toNano } from "ton";
import BN from "bn.js";

export function useSendTxn() {
  const connect = useTonhubConnect();
  const [isIssuedTxn, setIssuedTxn] = useState(false);

  return {
    sendTxn: async (address: Address, value: BN, body: Cell) => {
      const txnStat = await connect.api.requestTransaction({
        to: address.toFriendly(),
        value: value.toString(),
        payload: body.toBoc().toString("base64"),
      });

      if (txnStat.type === "success") {
        setIssuedTxn(true);
      }
    },
    isIssuedTxn,
    markTxnEnded: () => {
      setIssuedTxn(false);
    },
  };
}
