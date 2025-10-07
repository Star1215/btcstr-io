




// Devnet: BSC Testnet, Mainnet: Ethereum Mainnet
export const isDevnet = process.env.NEXT_PUBLIC_IS_DEVNET == 'true';


export const V2_FACTORY_ADDRESS = isDevnet ? '0x6725F303b657a9451d8BA641348b6761A6CC7a17' : '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
export const V2_ROUTER_ADDRESS = isDevnet ? '0xD99D1c33F9fC3444f8101754aBC46c52416550D1' : '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

export const TeamWallet = isDevnet ? '0xfb11bc70Cb3C874FBB54EB4ED39020e4b26c95FC' : '0xE30619534E3B4B14aC5526f85CCC493e651ac70a';

export const WETH = isDevnet ? '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd' : '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

export const WBTC_ADDRESS = isDevnet ? '0x9eF04E9845Faa99DECDbfbCf4cBE38aEa3206117' : '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599';
// Attention: PNKSTR is v2 LP but uniswap v3, v4 LP on Mainnet
// export const PNKSTR_ADDRESS = isDevnet ? '0x8A3391A505Ea43e6994574939ff2FbF124E84c1d' : '0xc50673EDb3A7b94E8CAD8a7d4E0cD68864E33eDF';
export const BTCSTR_ADDRESS = isDevnet ? '0xFfD95eD840eF17565Cc7696796731F991C4bD0BD' : '0xB9F11B5DE201F8E0Dc013215FdBf6178c4A24A62';

export const WBTC_DECIMALS = 8;
export const BTCSTR_TS = 1000000000

export const rpcUrl = isDevnet ? 'https://bsc-testnet-rpc.publicnode.com' : 'https://ethereum-rpc.publicnode.com';



