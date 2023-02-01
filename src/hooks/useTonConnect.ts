import { CHAIN } from "@tonconnect/protocol";
import { atom, useRecoilState } from "recoil";
import { Sender, SenderArguments } from "ton-core";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useEffect } from "react";

const connStateAtom = atom<{ chain: CHAIN | null; address: string | null }>({
  key: "connState", // unique ID (with respect to other atoms/selectors)
  default: {
    chain: null,
    address: null,
  }, // default value (aka initial value)
});

let isSubscribed = false;

export function useTonConnect(): {
  sender: Sender;
  connected: boolean;
  wallet: string | null;
  network: CHAIN | null;
} {
  const [tonConnectUI] = useTonConnectUI();

  const [connectionState, setConnState] = useRecoilState(connStateAtom);

  useEffect(() => {
    if (isSubscribed) return;
    isSubscribed = true;
    tonConnectUI.onStatusChange((w) => {
      setConnState({
        chain: w?.account.chain ?? null,
        address: w?.account.address ?? null,
      });
    });
  }, []);

  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    connected: !!connectionState.address,
    wallet: connectionState.address,
    network: connectionState.chain,
  };
}
