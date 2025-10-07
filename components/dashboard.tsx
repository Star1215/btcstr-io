"use client"


import { useEffect, useState } from "react"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { multicall, readContract } from '@wagmi/core'
import { ethers } from "ethers"; // BigNumber and constants are now part of ethers
import { useAccount, useWriteContract } from "wagmi";
import toast from 'react-hot-toast';
import BTCSTR_ABI from '../config/BTCSTR.json';
import { BTCSTR_ADDRESS, BTCSTR_TS, WBTC_DECIMALS } from "@/config";
import { config } from "@/config/wagmi";
import OrderCard from "./ordercard";


type HoldingStats = {
    eth: number;
    wbtc: number;
    // btcSTR: number;
    burnedBtcSTR: number;
}

type RewardValues = {
    minWbtcBuy: number;
    txReward: number;
    profitBps: number;
}


export default function Home() {
    const { isConnected, address, chainId, status } = useAccount();
    const { writeContract, writeContractAsync } = useWriteContract()
    const [activeTab, setActiveTab] = useState<"holding" | "sold">("holding")
    const [isPending, setIsPending] = useState(false);
    const [nextOrderId, setNextOrderId] = useState(1);

    const [wbtc2Eth, setWbtc2Eth] = useState(1 / 10000000000)
    const [holdingStats, setHoldingStats] = useState<HoldingStats>({
        eth: 0,
        wbtc: 0,
        // btcSTR: 0,
        burnedBtcSTR: 0
    })

    const [rewardValues, setRewardValues] = useState<RewardValues>({
        minWbtcBuy: 0.0001,
        txReward: 0.00001,
        profitBps: 1200
    })

    useEffect(() => {
        let cancelled = false;

        const fetchContractStats = async () => {
            try {
                const result = await readContract(config, {
                    address: BTCSTR_ADDRESS,
                    abi: BTCSTR_ABI,
                    functionName: 'stats',

                });

                // const tokenBalance = await readContract(config, {
                //     address: BTCSTR_ADDRESS,
                //     abi: BTCSTR_ABI,
                //     functionName: 'balanceOf',
                //     args: [BTCSTR_ADDRESS]
                // })

                const _wbtc2Eth = await readContract(config, {
                    address: BTCSTR_ADDRESS,
                    abi: BTCSTR_ABI,
                    functionName: 'previewSell',
                    args: [ethers.parseUnits('1', WBTC_DECIMALS)]
                })

                console.log('debug contract stats::', _wbtc2Eth);
                if (typeof _wbtc2Eth == 'bigint') {
                    setWbtc2Eth(Number(ethers.formatEther(_wbtc2Eth)))
                }
                // if (!cancelled && Array.isArray(result) && typeof result[0] === 'bigint' && typeof tokenBalance == 'bigint') {
                if (!cancelled && Array.isArray(result) && typeof result[0] === 'bigint') {
                    setHoldingStats({
                        eth: Number(ethers.formatEther(result[1])),
                        wbtc: Number(ethers.formatUnits(result[2], WBTC_DECIMALS)),
                        // btcSTR: Number(ethers.formatEther(tokenBalance)),
                        burnedBtcSTR: Number(ethers.formatEther(result[0])),

                    });
                }
            } catch (error) {
                console.error('Error fetching contract stats:', error);
            }
        };

        const fetchContractValues = async () => {
            try {
                const values = await multicall(config, {
                    contracts: [
                        {
                            address: BTCSTR_ADDRESS,
                            abi: BTCSTR_ABI as any,
                            functionName: "minWbtcBuy",
                            args: [],
                        },
                        {
                            address: BTCSTR_ADDRESS,
                            abi: BTCSTR_ABI as any,
                            functionName: "txReward",
                            args: [],
                        },
                        {
                            address: BTCSTR_ADDRESS,
                            abi: BTCSTR_ABI as any,
                            functionName: "PROFIT_BPS",
                            args: [],
                        },
                        {
                            address: BTCSTR_ADDRESS,
                            abi: BTCSTR_ABI as any,
                            functionName: "nextOrderId",
                            args: [],
                        },

                    ],
                });
                // Consider Profit BPS is private
                const [_minWbtcBuy, _txReward, _profitBps, _nextOrderId] = values
                console.log('debug contract values::', _minWbtcBuy, _txReward, _profitBps, _nextOrderId);
                setRewardValues({
                    minWbtcBuy: _minWbtcBuy.status == 'success' ? Number(ethers.formatEther(BigInt(_minWbtcBuy.result as bigint))) : 0.0001,
                    txReward: _txReward.status == 'success' ? Number(ethers.formatEther(BigInt(_txReward.result as bigint))) : 0.00001,
                    profitBps: _profitBps.status == 'success' ? Number(_profitBps.result as bigint) : 1200,
                })
                setNextOrderId(
                    _nextOrderId.status === 'success'
                        ? Number(_nextOrderId.result)
                        : 1
                )
                // if (_orders.status !== 'failure')
                //     setOrders(_orders.result as any);
            } catch (error) {
                console.error('Error fetching contract values:', error);
            }

        }

        // Fetch immediately on mount
        fetchContractStats();

        fetchContractValues()

        // then run both every 10 seconds
        const interval = setInterval(() => {
            fetchContractStats();
            fetchContractValues();
        }, 10_000);

        // Cleanup when component unmounts or dependencies change
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [isPending]);

    // useEffect(() => {
    //     const fetchContractValues = async () => {
    //         try {
    //             const values = await multicall(config, {
    //                 contracts: [
    //                     {
    //                         address: BTCSTR_ADDRESS,
    //                         abi: BTCSTR_ABI as any,
    //                         functionName: "minWbtcBuy",
    //                         args: [],
    //                     },
    //                     {
    //                         address: BTCSTR_ADDRESS,
    //                         abi: BTCSTR_ABI as any,
    //                         functionName: "txReward",
    //                         args: [],
    //                     },
    //                     {
    //                         address: BTCSTR_ADDRESS,
    //                         abi: BTCSTR_ABI as any,
    //                         functionName: "PROFIT_BPS",
    //                         args: [],
    //                     },
    //                     {
    //                         address: BTCSTR_ADDRESS,
    //                         abi: BTCSTR_ABI as any,
    //                         functionName: "nextOrderId",
    //                         args: [],
    //                     },

    //                 ],
    //             });
    //             // Consider Profit BPS is private
    //             const [_minWbtcBuy, _txReward, _profitBps, _nextOrderId] = values
    //             console.log('debug contract values::', _minWbtcBuy, _txReward, _profitBps, _nextOrderId);
    //             setRewardValues({
    //                 minWbtcBuy: _minWbtcBuy.status == 'success' ? Number(ethers.formatEther(BigInt(_minWbtcBuy.result as bigint))) : 0.0001,
    //                 txReward: _txReward.status == 'success' ? Number(ethers.formatEther(BigInt(_txReward.result as bigint))) : 0.00001,
    //                 profitBps: _profitBps.status == 'success' ? Number(_profitBps.result as bigint) : 1200,
    //             })
    //             setNextOrderId(
    //                 _nextOrderId.status === 'success'
    //                     ? Number(_nextOrderId.result)
    //                     : 1
    //             )
    //             // if (_orders.status !== 'failure')
    //             //     setOrders(_orders.result as any);
    //         } catch (error) {
    //             console.error('Error fetching contract values:', error);
    //         }

    //     }
    //     fetchContractValues()

    // }, [isPending, BTCSTR_ADDRESS, isConnected])


    const handleBuyWBTC = async () => {
        if (!address || !isConnected) {
            toast.error("Wallet is not connected")
            return;
        }
        if (holdingStats.eth < rewardValues.minWbtcBuy + rewardValues.txReward) {
            toast.error("Not enought ETH to next purchase");
            return;
        }
        try {
            setIsPending(true);
            let tx;
            tx = await writeContractAsync({
                address: BTCSTR_ADDRESS,
                abi: BTCSTR_ABI,
                functionName: "buyWBTC",
                args: [],
            });
            if (!tx) {
                throw new Error("Transaction object or hash is undefined");
            }
            setIsPending(false);
        } catch (error) {
            console.error("Flip failed:", error);
            setIsPending(false);
        }
    }



    return (
        <div className="min-h-screen bg-[#15803d]">
            <div className="max-w-5xl mx-auto px-8">
                {/* Header */}
                <header className="flex items-center justify-between py-6">
                    <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-white tracking-tight">
                            <span className="inline-block bg-[#3a7d4f] px-1">B</span>
                            <span className="inline-block bg-[#4a8d5f] px-1">T</span>
                            <span className="inline-block bg-[#3a7d4f] px-1">C</span>
                            <span className="inline-block bg-[#4a8d5f] px-1">S</span>
                            <span className="inline-block bg-[#3a7d4f] px-1">t</span>
                            <span className="inline-block bg-[#4a8d5f] px-1">r</span>
                            <span className="inline-block bg-[#3a7d4f] px-1">a</span>
                            <span className="inline-block bg-[#4a8d5f] px-1">t</span>
                            <span className="inline-block bg-[#3a7d4f] px-1">e</span>
                            <span className="inline-block bg-[#4a8d5f] px-1">g</span>
                            <span className="inline-block bg-[#3a7d4f] px-1">y</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-white/80 text-sm">Trade BTCSTR</span>
                        {/* <button className="bg-[#4169E1] hover:bg-[#3659d1] text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              Connect Wallet
            </button> */}
                        <ConnectButton />
                    </div>
                </header>

                {/* Main Content */}
                <main className="py-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 relative overflow-hidden">
                        {/* Radial gradient overlay */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-radial from-white/20 via-white/5 to-transparent rounded-full blur-2xl -translate-x-1/3 -translate-y-1/3 pointer-events-none" />

                        {/* View Treasury Button */}
                        <button className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors z-10">
                            View treasury
                        </button>

                        {/* Live Holdings Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full mb-6">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-white/80 text-sm">Live holdings</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl font-bold text-white mb-8">BTC Strategy is currently holding</h1>

                        {/* Holdings Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* ETH Card */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-white/60 text-sm mb-1">ETH</div>
                                        <div className="text-white text-3xl font-bold">{Number(holdingStats.eth.toFixed(WBTC_DECIMALS))}</div>
                                    </div>
                                </div>
                            </div>

                            {/* PEPE Card */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="flex items-center gap-4">
                                    {/* <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">🐸</div> */}
                                    <img src="/BitCoin.png" alt="Bitcoin Logo" width={48} height={48} className="bg-white/20 rounded-full" />
                                    <div>
                                        <div className="text-white/60 text-sm mb-1">WBTC</div>
                                        <div className="text-white text-3xl font-bold">{Number(holdingStats.wbtc.toFixed(WBTC_DECIMALS))}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Burned Card */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                            <div className="flex items-center gap-4">
                                {/* <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
                                        <path d="M12 22V12" />
                                        <path d="M12 12L4 7" />
                                        <path d="M12 12l8-5" />
                                    </svg>
                                </div> */}
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">🐸</div>
                                <div>
                                    <div className="text-white/60 text-sm mb-1">BURNED $BTCSTR</div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-white text-3xl font-bold">{holdingStats.burnedBtcSTR}</span>
                                        <span className="text-white/60 text-sm">({holdingStats.burnedBtcSTR / BTCSTR_TS}% of 1B)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-white">Progress to Next Purchase</h2>
                            <div className="text-white/80 text-sm">
                                Current rewards <span className="font-bold text-white">{rewardValues.txReward} ETH</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative mb-4">
                            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                                    style={{ width: `${Number(holdingStats.eth / (rewardValues.minWbtcBuy + rewardValues.txReward) * 100)}%` }}
                                />
                            </div>
                            <div className="absolute -top-1 right-0 text-white text-sm font-medium">{Number((holdingStats.eth / (rewardValues.minWbtcBuy + rewardValues.txReward) * 100).toFixed(1))}%</div>
                        </div>

                        {/* Progress Text */}
                        <p className="text-white/80 text-sm mb-6">
                            When the machine acquires the missing <span className="text-green-400 font-semibold">{Number((rewardValues.minWbtcBuy + rewardValues.txReward - holdingStats.eth).toFixed(WBTC_DECIMALS))} ETH</span>, the
                            first entity to trigger the functions below will process the mechanism forward and earn a reward.
                        </p>

                        {/* Buy Button */}
                        <button className="w-full bg-[#a8d5ba] hover:bg-[#98c5aa] text-[#1e4d2b] py-4 rounded-xl text-lg font-semibold transition-colors"
                            onClick={() => { handleBuyWBTC() }}
                        >
                            Buy
                        </button>
                    </div>

                    {/* Orders Section */}
                    <OrderCard nextOrderId={nextOrderId} profitBps={rewardValues.profitBps ?? 1200} wbtc2Eth={wbtc2Eth} />
                    {/* BTCSTR Chart Section */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold text-white">BTCSTR Chart</h2>
                            <span className="text-white/60 text-sm">Powered by GeckoTerminal</span>
                        </div>

                        <div className="bg-black rounded-xl overflow-hidden">
                            <iframe
                                src="https://www.geckoterminal.com/eth/pools/0x1234567890abcdef?embed=1&info=0&swaps=1"
                                className="w-full h-[600px] border-0"
                                title="BTCSTR Chart"
                            />
                        </div>
                    </div>

                    {/* BTC Strategy Footer Section */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">BTC Strategy</h3>
                                <p className="text-white/60 text-sm mb-4">The btc memecoin machine</p>
                                <p className="text-white/40 text-xs">© 2025 BTC Strategy</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    X
                                </a>
                                <a
                                    href="https://telegram.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    Telegram
                                </a>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}