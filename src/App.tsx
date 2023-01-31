import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Counter } from "./components/Counter";
import { Jetton } from "./components/Jettons";
import { TonWalletDetails } from "./components/TonWalletDetails";
import { TransferTon } from "./components/TransferTon";

function App() {
  return (
    <div className="App">
      <div className="Container">
        <TonConnectButton />
        {/* <TonWalletDetails /> */}
        {/* <TransferTon /> */}
        <Counter />
        {/* <Counter />
        <Jetton /> */}
      </div>
    </div>
  );
}

export default App;
