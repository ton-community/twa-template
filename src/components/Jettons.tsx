import { useQuery } from "@tanstack/react-query";
import { useTonhubConnect } from "react-ton-x";
import { beginCell, toNano, Address, Cell, fromNano } from "ton";
import { Card } from "./Card";
import { tc } from "./Ton-Connector";
import BN from "bn.js";
import { useState } from "react";
const minterAddr = "EQB8StgTQXidy32a8xfu7j4HMoWYV0b0cFM8nXsP2cza_b7Y";

export function Jetton() {
  const connect = useTonhubConnect();

  // @ts-ignore
  const userAddress = Address.parse(connect.state!.walletConfig!.address);
  const [isIssuedTxn, setIssuedTxn] = useState(false);

  const {
    data: jettonWalletAddress,
    isFetching: isFetchingJettonWalletAddress,
  } = useQuery(
    ["get_wallet_address", userAddress.toFriendly()],
    async (): Promise<string | undefined> => {
      const { stack } = await tc.callGetMethod(
        Address.parse(minterAddr),
        "get_wallet_address",
        [
          [
            "tvm.Slice",
            beginCell()
              .storeAddress(userAddress)
              .endCell()
              .toBoc({ idx: false })
              .toString("base64"),
          ],
        ]
      );

      return Cell.fromBoc(Buffer.from(stack[0][1].bytes, "base64"))[0]
        .beginParse()
        .readAddress()
        ?.toFriendly();
    }
  );

  const { data: jettonBalance, isFetching: isFetchingJettonBalance } = useQuery(
    ["jetton_balance", userAddress.toFriendly()],
    async (): Promise<string | undefined> => {
      const { stack } = await tc.callGetMethod(
        Address.parse(jettonWalletAddress!),
        "get_wallet_data"
      );

      const balance = fromNano(BigInt(stack[0][1]).toString());

      if (balance !== jettonBalance) {
        setIssuedTxn(false);
      }

      return balance;
    },
    {
      enabled: !!jettonWalletAddress,
      refetchInterval: isIssuedTxn ? 2000 : undefined,
    }
  );

  return (
    <Card title="Jetton">
      <button
        onClick={async () => {
          const MINT = 21;
          const INTERNAL_TRANSFER = 0x178d4519;
          // @ts-ignore
          const mintTokensBody = beginCell()
            .storeUint(MINT, 32)
            .storeUint(0, 64) // queryid
            .storeAddress(userAddress)
            .storeCoins(toNano(0.02))
            .storeRef(
              // internal transfer message
              beginCell()
                .storeUint(INTERNAL_TRANSFER, 32)
                .storeUint(0, 64)
                .storeCoins(toNano(150))
                .storeAddress(null)
                .storeAddress(userAddress) // So we get a notification
                .storeCoins(toNano(0.001))
                .storeBit(false) // forward_payload in this slice, not separate cell
                .endCell()
            )
            .endCell();

          const txnStat = await connect.api.requestTransaction({
            to: minterAddr,
            value: toNano(0.05).toString(),
            payload: mintTokensBody.toBoc().toString("base64"),
          });

          if (txnStat.type === "success") {
            setIssuedTxn(true);
          }
        }}
      >
        Get jettons from faucet
      </button>
      <h4>
        Jetton address:{" "}
        {isFetchingJettonWalletAddress ? "Loading..." : jettonWalletAddress}
      </h4>
      <h4>
        Jetton balance: {isFetchingJettonBalance ? "Loading..." : jettonBalance}
      </h4>
    </Card>
  );
}
