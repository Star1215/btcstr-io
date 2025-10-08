
import {
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi';
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    bscTestnet
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";


// Get projectId from <https://cloud.reown.com>
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

export const config = getDefaultConfig({
    appName: 'BTCStrategy-BTCSTR',
    projectId: projectId,
    chains: [mainnet, bscTestnet],
    ssr: true, // If your dApp uses server side rendering (SSR)
    transports: {
        [mainnet.id]: http(),
        [bscTestnet.id]: http(),
    },
});