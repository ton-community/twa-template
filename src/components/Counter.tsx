import { useTonhubConnect } from "react-ton-x";
import { useQuery } from "@tanstack/react-query";
import { Address, toNano, beginCell } from "ton";
import { Card } from "./Card";
import { tc } from "./Ton-Connector";
import { useState } from "react";

export function Counter() {
  const connect = useTonhubConnect();
  const counterAddr = "EQC-QTihJV_B4f8M2nynateMLynaRT_uwNYnnuyy87kam-G7";
  const [isIssuedTxn, setIssuedTxn] = useState(false);

  const { isLoading, error, data, isFetching, fetchStatus, status } = useQuery(
    ["counter"],
    async (): Promise<string> => {
      const { stack } = await tc.callGetMethod(
        Address.parse(counterAddr),
        "counter"
      );
      const newData = BigInt(stack[0][1]).toString();
      if (newData !== data) {
        setIssuedTxn(false);
      }
      return newData;
    },
    { refetchInterval: isIssuedTxn ? 2000 : undefined }
  );

  return (
    <Card title="Counter">
      <h3>Counter number {isFetching ? "Loading..." : data}</h3>
      <button
        onClick={async () => {
          const txnStat = await connect.api.requestTransaction({
            to: counterAddr,
            value: toNano(0.01).toString(),
            payload: beginCell()
              .storeUint(0x37491f2f, 32)
              .storeUint(0, 64)
              .endCell()
              .toBoc()
              .toString("base64"),
          });

          if (txnStat.type === "success") {
            setIssuedTxn(true);
          }
        }}
      >
        Increment
      </button>
    </Card>
  );
}
