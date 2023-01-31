import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import FaucetJetton from "../contracts/faucetJetton";
import { Address, OpenedContract } from "ton-core";
import FaucetJettonWallet from "../contracts/faucetJettonWallet";

export function useFaucetJettonContract() {
  const { wallet, sender } = useTonConnect();
  const { client } = useTonClient();

  const faucetJettonContract = useAsyncInitialize(async () => {
    if (!client || !wallet) return;
    const contract = new FaucetJetton(
      Address.parse("EQB8StgTQXidy32a8xfu7j4HMoWYV0b0cFM8nXsP2cza_b7Y") // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<FaucetJetton>;
  }, [client, wallet]);

  const jettonWalletAddress = useAsyncInitialize(async () => {
    if (!faucetJettonContract) return;
    return await faucetJettonContract!.getWalletAddress(Address.parse(wallet!));
  }, [faucetJettonContract]);

  const balance = useAsyncInitialize(async () => {
    if (!jettonWalletAddress || !client) return;
    const jwContract = new FaucetJettonWallet(
      Address.parse(jettonWalletAddress)
    );
    return client!.open(jwContract).getBalance();
  }, [jettonWalletAddress]);

  return {
    mint: () => {
      faucetJettonContract?.sendMintFromFaucet(sender, Address.parse(wallet!));
    },
    jettonWalletAddress,
    balance,
  };
}
