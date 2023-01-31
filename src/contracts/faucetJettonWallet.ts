import { fromNano } from "ton";
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

export default class FaucetJettonWallet implements Contract {
  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("get_wallet_data", []);
    return fromNano(stack.readBigNumber());
  }

  // async sendIncrement(provider: ContractProvider, via: Sender) {
  //   const messageBody = beginCell()
  //     .storeUint(1, 32) // op (op #1 = increment)
  //     .storeUint(0, 64) // query id
  //     .endCell();
  //   await provider.internal(via, {
  //     value: "0.002", // send 0.002 TON for gas
  //     body: messageBody,
  //   });
  // }

  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}
}
