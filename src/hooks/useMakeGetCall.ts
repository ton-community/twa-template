import { useQuery } from "@tanstack/react-query";
import { Address, Cell, TonClient } from "ton";
import { tc } from "../components/Ton-Connector";
import BN from "bn.js";

function _prepareParams(params: any[] = []) {
  return params.map((p) => {
    if (p instanceof Cell) {
      return ["tvm.Slice", p.toBoc({ idx: false }).toString("base64")];
    }

    throw new Error("unknown type!");
  });
}

type GetResponseValue = Cell | BN | null;

function _parseGetMethodCall(
  stack: [["num" | "cell" | "list", any]]
): GetResponseValue[] {
  return stack.map(([type, val]) => {
    switch (type) {
      case "num":
        return new BN(val.replace("0x", ""), "hex");
      case "cell":
        return Cell.fromBoc(Buffer.from(val.bytes, "base64"))[0];
      case "list":
        if (val.elements.length === 0) {
          return null;
        } else {
          throw new Error("list parsing not supported");
        }
      default:
        throw new Error(`unknown type: ${type}, val: ${JSON.stringify(val)}`);
    }
  });
}

export function useMakeGetCall<T>(
  address: Address | undefined,
  name: string,
  params: any[],
  parser: (stack: GetResponseValue[]) => T,
  useQueryOpts?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
): { data?: T; isFetching: boolean } {
  const { data, isFetching } = useQuery(
    [address?.toFriendly(), name, JSON.stringify(params)],
    async (): Promise<any> => {
      if (!address) return;
      const { stack } = await tc.callGetMethod(
        address,
        name,
        _prepareParams(params)
      );

      return parser(_parseGetMethodCall(stack as [["num" | "cell", any]]));
    },
    useQueryOpts
  );

  return { data, isFetching };
}
