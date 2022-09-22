import { useTonhubConnect } from "react-ton-x";
import { useQuery } from "@tanstack/react-query";
import { Address, toNano, beginCell } from "ton";
import { Card } from "./Card";
import { tc } from "./Ton-Connector";


export function Counter() {
  const connect = useTonhubConnect();
  const counterAddr = "EQC-QTihJV_B4f8M2nynateMLynaRT_uwNYnnuyy87kam-G7";

  const { isLoading, error, data, isFetching, fetchStatus, status, refetch } = useQuery(["counter"], async () => {
    const { stack } = await tc.callGetMethod(
      Address.parse(counterAddr),
      "counter"
    );
    return BigInt(stack[0][1]).toString();
  });

  return (
    <Card title="Counter">
      <h3>Counter number {isLoading ? "Loading..." : data}</h3>
      <button
        onClick={() => {
          connect.api.requestTransaction({
            to: counterAddr,
            value: toNano(0.01).toString(),
            payload: beginCell()
              .storeUint(0x37491f2f, 32)
              .storeUint(0, 64)
              .endCell()
              .toBoc()
              .toString("base64"),
          });
        }}
      >
        Increment
      </button>
    </Card>
  );
}
