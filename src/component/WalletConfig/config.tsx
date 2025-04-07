import { createAppKit } from "@reown/appkit/react";

import { AppKitNetwork, mainnet, optimism } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// 1. Get projectId from https://cloud.reown.com
const projectId = "cd75e5823817d94a05eb41d34de90dc3";

// 2. Create a metadata object - optional
const metadata = {
  name: "TaskOn",
  description: "AppKit Example",
  url: "https://reown.com/appkit", // origin must match your domain & subdomain
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

// 3. Set the networks
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  {
    id: optimism?.id,
    name: optimism.name,
    rpcUrls: {
      default: {
        http: optimism.rpcUrls.default.http, // Ensuring correct format
      },
    },
    blockExplorers: mainnet.blockExplorers,
    nativeCurrency: mainnet.nativeCurrency,
  },
];

// 4. Create Wagmi Adapter
export const wagmiAdapterConfig = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapterConfig],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    socials: false,
    email: false,
  },
  enableEIP6963: true,
  enableWalletGuide: false,
});
