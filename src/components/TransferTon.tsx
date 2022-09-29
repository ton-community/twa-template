import { useTonhubConnect } from "react-ton-x";
import { useState } from "react";
import { toNano } from "ton";
import { Card } from "./Card";

export function TransferTon() {
  const connect = useTonhubConnect();
  const [txnStatus, setTxnStatus] = useState<string | null>(null);
  const [tonAmount, setTonAmount] = useState("0.01");
  const [tonRecipient, setTonRecipient] = useState(
    "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c"
  );

  return (
    <Card title="Transfer TON">
      <div>
        <label>Amount </label>
        <input
          style={{ marginRight: 8 }}
          type="number"
          value={tonAmount}
          onChange={(e) => setTonAmount(e.target.value)}
        ></input>
      </div>
      <div>
        <label>To </label>
        <input
          style={{ marginRight: 8 }}
          value={tonRecipient}
          onChange={(e) => setTonRecipient(e.target.value)}
        ></input>
      </div>
      <button
        style={{ marginTop: 18 }}
        onClick={async () => {
          setTxnStatus("Txn requested. Check your wallet");
          const stat = await connect.api.requestTransaction({
            to: tonRecipient,
            value: toNano(tonAmount).toString(10),
          });

          setTxnStatus(stat.type);
        }}
      >
        Transfer
      </button>
      {txnStatus && <div>{txnStatus}</div>}
    </Card>
  );
}
