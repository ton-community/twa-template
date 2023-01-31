import { useTonConnectUI } from "@tonconnect/ui-react";
import { CHAIN } from "@tonconnect/protocol";
import { Sender, SenderArguments } from "ton-core";
import { useAsyncInitialize } from "./useAsyncInitialize";

export function useTonConnect(): {
  sender: Sender;
  connected: boolean;
  wallet: string | null;
  network: CHAIN | null;
} {
  const [tonConnectUI] = useTonConnectUI();

  const conDetails = useAsyncInitialize(async () => {
    await tonConnectUI.connectionRestored;
    return {
      connected: tonConnectUI.connected,
      wallet: tonConnectUI.wallet?.account.address ?? null,
      network: tonConnectUI.wallet?.account.chain ?? null,
    };
  });

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
    connected: !!conDetails?.connected,
    wallet: conDetails?.wallet ?? null,
    network: conDetails?.network ?? null,
  };
}
