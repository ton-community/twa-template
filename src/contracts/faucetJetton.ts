import {
  Contract,
  ContractProvider,
  Sender,
  Address,
  Cell,
  contractAddress,
  beginCell,
  toNano,
} from "ton-core";

export default class FaucetJetton implements Contract {
  async sendMintFromFaucet(
    provider: ContractProvider,
    via: Sender,
    receivingAddress: Address
  ) {
    const MINT = 21;
    const INTERNAL_TRANSFER = 0x178d4519;
    // @ts-ignore
    const mintTokensBody = beginCell()
      .storeUint(MINT, 32)
      .storeUint(0, 64) // queryid
      .storeAddress(receivingAddress)
      .storeCoins(toNano("0.02"))
      .storeRef(
        // internal transfer message
        beginCell()
          .storeUint(INTERNAL_TRANSFER, 32)
          .storeUint(0, 64)
          .storeCoins(toNano(150))
          .storeAddress(null)
          .storeAddress(receivingAddress) // So we get a notification
          .storeCoins(toNano("0.001"))
          .storeBit(false) // forward_payload in this slice, not separate cell
          .endCell()
      )
      .endCell();

    await provider.internal(via, {
      value: toNano("0.05"),
      body: mintTokensBody,
    });
  }

  async getWalletAddress(provider: ContractProvider, forAddress: Address) {
    const { stack } = await provider.get("get_wallet_address", [
      { type: "slice", cell: beginCell().storeAddress(forAddress).endCell() },
    ]);

    return stack.readAddress().toString();
  }

  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}
}
