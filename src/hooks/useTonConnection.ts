import { useQuery } from "@tanstack/react-query";
import { Address, Cell, TonClient } from "ton";
import { tc } from "../components/Ton-Connector";

function _prepareParams(params: any[] = []) {
  return params.map((p) => {
    if (p instanceof Cell) {
      return ["tvm.Slice", p.toBoc({ idx: false }).toString("base64")];
    }

    throw new Error("unknown type!");
  });
}

export async function useMakeGetCall(
  address: Address,
  name: string,
  params: any[]
) {
  useQuery(
    [address.toFriendly(), name, JSON.stringify(params)],
    async (): Promise<any> => {
      const { stack } = await tc.callGetMethod(
        address,
        name,
        _prepareParams(params)
      );

      console.log(stack, "shahar");
    }
  );
}
