import { useState } from "react";
import { useTonhubConnect } from "react-ton-x";
import { Address, Cell, toNano } from "ton";
import BN from "bn.js";
import { tc } from '../components/Ton-Connector';

export type TxnState = 'idle' | 'requested' | 'pending' | 'success' | 'error';

export function useSendTxn() {
  const connect = useTonhubConnect();
  const [txnState, setTxnState] = useState<TxnState>('idle');

  return {
    sendTxn: async (address: Address, value: BN, body: Cell) => {
      setTxnState('requested');
      const txnStat = await connect.api.requestTransaction({
        to: address.toFriendly(),
        value: value.toString(),
        payload: body.toBoc().toString("base64"),
      });


      if (txnStat.type === "success") {
        setTxnState('pending');
        
        let found = false;
        let now = Date.now();
        for (let i = 0; i < 5; i++) {
          let txns = await tc.getTransactions(address, { limit: 5 });
          let hasTx = txns.find(tx => tx.inMessage?.value.eq(value) && tx.time * 1000 > now);
          if (hasTx) {
            found = true;
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 6000));
        }
        if (found) {
          setTxnState('success');
        } else {
          setTxnState('error');
        }
      } else {
        setTxnState('error');
      }
    },
    txnState,
    isIssuedTxn: txnState === 'requested' || txnState === 'pending',
    markTxnEnded: () => {
      setTxnState('idle');
    },
  };
}
