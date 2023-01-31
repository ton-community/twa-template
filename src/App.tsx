import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Counter } from "./components/Counter";
import { Jetton } from "./components/Jettons";
import { TonWalletDetails } from "./components/TonWalletDetails";
import { TransferTon } from "./components/TransferTon";

function App() {
  return (
    <div className="App">
      <h1>Ton Sample TWA</h1>
      <TonConnectButton />
      <div style={{ textAlign: "left", marginBottom: 20 }}>
        {/* <TonWalletDetails /> */}
        <TransferTon />
        {/* <Counter />
        <Jetton /> */}
      </div>
    </div>
  );
}

export default App;
