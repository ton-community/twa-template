import { useTonhubConnect } from "react-ton-x";
import { beginCell, toNano, Address, Cell, fromNano } from "ton";
import { Card } from "./Card";
import BN from "bn.js";
import { useMakeGetCall } from "../hooks/useMakeGetCall";
import { useSendTxn } from "../hooks/useSendTxn";
const minterAddr = "EQB8StgTQXidy32a8xfu7j4HMoWYV0b0cFM8nXsP2cza_b7Y";

export function Jetton() {
  const connect = useTonhubConnect();
  const { isIssuedTxn, sendTxn, markTxnEnded } = useSendTxn();

  // @ts-ignore
  const userAddress = Address.parse(connect.state!.walletConfig!.address);

  const {
    data: jettonWalletAddress,
    isFetching: isFetchingJettonWalletAddress,
  } = useMakeGetCall(
    Address.parse(minterAddr),
    "get_wallet_address",
    [beginCell().storeAddress(userAddress).endCell()],
    (res) => (res[0] as Cell).beginParse().readAddress()?.toFriendly()
  );

  const { data: jettonBalance, isFetching: isFetchingJettonBalance } =
    useMakeGetCall(
      jettonWalletAddress ? Address.parse(jettonWalletAddress) : undefined,
      "get_wallet_data",
      [],
      (res): string => {
        const newBalance = fromNano(res[0] as BN);
        if (isIssuedTxn && newBalance !== jettonBalance) {
          markTxnEnded();
        }
        return newBalance;
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

          await sendTxn(
            Address.parse(minterAddr),
            toNano(0.05),
            mintTokensBody
          );
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
