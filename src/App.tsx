import { WagmiProvider } from "wagmi";
import "./App.css";
import CustomCursor from "./component/CustomCursor";
import Header from "./component/Header";
import Navigation from "./Navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiAdapterConfig } from "../src/component/WalletConfig/config";
import { Toaster } from "react-hot-toast";

function App() {
  const queryClient = new QueryClient();
  return (
    <div className="app">
      <WagmiProvider config={wagmiAdapterConfig.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <Header>
            <CustomCursor />
            <Navigation />
          </Header>
        </QueryClientProvider>
      </WagmiProvider>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;
