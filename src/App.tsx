import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { MainButton } from "@twa-dev/sdk/react";
import TonConnector from "./components/Ton-Connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TransferTon } from "./components/TransferTon";

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1>Ton Sample TWA</h1>
        <TonConnector />
      </div>
    </QueryClientProvider>
  );
}

export default App;
