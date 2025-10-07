"use client"

import { useEffect, useState } from "react"
import { multicall, readContract } from '@wagmi/core'
import { ethers } from "ethers"; // BigNumber and constants are now part of ethers
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import toast from 'react-hot-toast';
import BTCSTR_ABI from '../config/BTCSTR.json';
import { BTCSTR_ADDRESS, BTCSTR_TS, isDevnet, WBTC_DECIMALS } from "@/config";
import { config } from "@/config/wagmi";
import { bscTestnet, mainnet } from 'wagmi/chains' // example


type Orders = {
    id: number;
    ethSpent: number;
    wbtcBought: number;
    timestamp: number;
    sold: boolean;
}

export default function OrderCard({ nextOrderId, profitBps, wbtc2Eth }: { nextOrderId: number, profitBps: number, wbtc2Eth: number }) {

    // console.log('debug ordercard id::', nextOrderId, profitBps)
    const { isConnected, address, chainId, status } = useAccount();
    const { writeContract, writeContractAsync } = useWriteContract()
    const [activeTab, setActiveTab] = useState<"holding" | "sold">("holding")
    const [isPending, setIsPending] = useState(false);
    const [orders, setOrders] = useState<Orders[]>([]);
    const [soldOrderCount, setSoldOrderCount] = useState(0);

    const [showAllOrders, setShowAllOrders] = useState(false);
    const [showAllSoldOrders, setShowAllSoldOrders] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            let _tempOrders: Orders[] = [];
            let _tempSoldOrderCount = 0;
            for (let k = 0; k < nextOrderId; k++) {
                try {
                    const orderDetail = await readContract(config, {
                        chainId: isDevnet ? bscTestnet.id : mainnet.id,
                        address: BTCSTR_ADDRESS,
                        abi: BTCSTR_ABI,
                        functionName: 'orders',
                        args: [k]
                    });
                    if (Array.isArray(orderDetail) && typeof orderDetail[0] === 'bigint') {
                        _tempOrders.push({
                            id: k,
                            ethSpent: Number(ethers.formatEther(orderDetail[0])),
                            wbtcBought: Number(ethers.formatUnits(orderDetail[1], WBTC_DECIMALS)),
                            timestamp: Number(orderDetail[2]),
                            sold: orderDetail[3]
                        })
                        if (orderDetail[3] == true) {
                            _tempSoldOrderCount++;
                        }
                    }
                    console.log('debug ordercard kth Detail::', k, orderDetail)
                } catch (error) {
                    console.error('Error fetching contract stats:', error);
                }
            }
            setOrders(_tempOrders);
            setSoldOrderCount(_tempSoldOrderCount);
        }
        if (nextOrderId >= 2) {
            fetchOrders();
        }
    }, [nextOrderId, isConnected, BTCSTR_ADDRESS, isPending])

    const handleSellWBTC = async (_orderId: number, rate: number) => {
        console.log('debug sell::', _orderId, rate)
        if (!address || !isConnected) {
            toast.error("Wallet is not connected")
            return;
        }
        if (rate < 100) {
            toast.error("Not reached to target")
            return;
        }
        try {
            setIsPending(true);
            let tx;
            tx = await writeContractAsync({
                address: BTCSTR_ADDRESS,
                abi: BTCSTR_ABI,
                functionName: "sellWBTC",
                args: [_orderId],
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

    // console.log('debug ordercard: orders', orders)
    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mt-6">
            {/* Orders Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Orders</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab("holding")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "holding"
                            ? "bg-white/20 text-white"
                            : "bg-transparent text-white/60 hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        Currently Holding
                    </button>
                    <button
                        onClick={() => setActiveTab("sold")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "sold"
                            ? "bg-white/20 text-white"
                            : "bg-transparent text-white/60 hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        Sold WBTC
                    </button>
                </div>
            </div>

            {/* Conditional Rendering based on active tab */}
            {activeTab === "holding" ? (
                nextOrderId - soldOrderCount - 1 > 0 ?
                    (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {orders
                                    .filter((order, index) => order.sold == false && index >= 1)
                                    .reverse()
                                    .slice(0, showAllOrders ? orders.length : 3)
                                    .map((order, index) => (
                                        <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                                            {/* Order Header */}
                                            <div className="flex items-center justify-between mb-6">
                                                <span className="text-white text-lg font-semibold">#{orders.length - index - 1}</span>
                                                <span className="bg-green-500/30 text-green-300 px-3 py-1 rounded-full text-xs font-medium">
                                                    Open
                                                </span>
                                            </div>

                                            {/* Order Details */}
                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-white/60 text-sm">ETH SPENT</span>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                                                        </svg>
                                                        <span className="text-white font-semibold">{Number(order.ethSpent.toFixed(6))}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-white/60 text-sm">WBTC BOUGHT</span>
                                                    <div className="flex items-center gap-2">
                                                        {/* <span className="text-lg">🐸</span> */}
                                                        <img src="/BitCoin.png" alt="Bitcoin Logo" width={24} height={24} className="bg-white/20 rounded-full" />
                                                        <span className="text-white font-semibold">{Number(order.wbtcBought.toFixed(6))}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-white/60 text-sm">EST. VALUE (NOW)</span>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                                                        </svg>
                                                        <span className="text-white font-semibold">{Number((order.wbtcBought * wbtc2Eth).toFixed(6))}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-white/60 text-sm">TARGET TO SELL</span>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                                                        </svg>
                                                        <span className="text-white font-semibold">{Number((order.ethSpent * profitBps / 1000).toFixed(6))}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="relative mb-4">
                                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                                                        style={{ width: `${order.wbtcBought * wbtc2Eth * 100000 / order.ethSpent / profitBps}%` }}
                                                    />
                                                </div>
                                                <div className="absolute -top-1 right-0 text-white/80 text-xs">{Number((order.wbtcBought * wbtc2Eth * 100000 / order.ethSpent / profitBps).toFixed(2))}%</div>
                                            </div>

                                            {/* Sell Button */}
                                            <button className="w-full bg-[#a8d5ba] hover:bg-[#98c5aa] text-[#1e4d2b] py-3 rounded-lg text-sm font-semibold transition-colors"
                                                onClick={() => { handleSellWBTC(order.id, (order.wbtcBought * wbtc2Eth * 100000 / order.ethSpent / profitBps)) }}
                                            >
                                                Sell
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setShowAllOrders(!showAllOrders)}
                                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    {showAllOrders ? "View Less" : "View More"}
                                </button>
                            </div>
                        </>
                    ) :
                    (
                        <div className="flex items-center justify-center py-16">
                            <p className="text-white/60 text-lg">No WBTC purchased yet</p>
                        </div>
                    )

            ) : (
                soldOrderCount > 0 ?
                    (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {orders
                                    .filter((order, index) => order.sold == true)
                                    .reverse()
                                    .slice(0, showAllSoldOrders ? orders.length : 3)
                                    .map((order, index) => (
                                        <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                                            {/* Order Header */}
                                            <div className="flex items-center justify-between mb-6">
                                                <span className="text-white text-lg font-semibold">#{order.id}</span>
                                                <span className="bg-green-500/30 text-green-300 px-3 py-1 rounded-full text-xs font-medium">
                                                    Closed
                                                </span>
                                            </div>

                                            {/* Order Details */}
                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-white/60 text-sm">ETH SPENT</span>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                                                        </svg>
                                                        <span className="text-white font-semibold">{Number(order.ethSpent.toFixed(6))}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-white/60 text-sm">WBTC BOUGHT</span>
                                                    <div className="flex items-center gap-2">
                                                        {/* <span className="text-lg">🐸</span> */}
                                                        <img src="/BitCoin.png" alt="Bitcoin Logo" width={24} height={24} className="bg-white/20 rounded-full" />
                                                        <span className="text-white font-semibold">{Number(order.wbtcBought.toFixed(6))}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-white/60 text-sm">EST. VALUE (NOW)</span>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                                                        </svg>
                                                        <span className="text-white font-semibold">{Number((order.wbtcBought * wbtc2Eth).toFixed(6))}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-white/60 text-sm">TARGET TO SELL</span>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                                                        </svg>
                                                        <span className="text-white font-semibold">{Number((order.ethSpent * profitBps / 1000).toFixed(6))}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="relative mb-4">
                                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                                                        // style={{ width: `${order.wbtcBought * wbtc2Eth * 100000 / order.ethSpent / profitBps}%` }}
                                                        style={{width: '100%'}}
                                                    />
                                                </div>
                                                <div className="absolute -top-1 right-0 text-white/80 text-xs">100%</div>
                                            </div>

                                            {/* Sell Button */}
                                            <button className="w-full bg-[#a8d5ba] hover:bg-[#98c5aa] text-[#1e4d2b] py-3 rounded-lg text-sm font-semibold transition-colors"
                                            >
                                                Sold
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setShowAllSoldOrders(!showAllSoldOrders)}
                                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    {showAllSoldOrders ? "View Less" : "View More"}
                                </button>
                            </div>
                        </>
                    ) : (
                        // Empty state for Sold Pepe
                        <div className="flex items-center justify-center py-16">
                            <p className="text-white/60 text-lg">No WBTC sold yet</p>
                        </div>
                    )
            )}
        </div>

    )
}