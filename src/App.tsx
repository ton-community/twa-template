import "./App.css";
import TonConnector from "./components/Ton-Connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
