"use client"

import { useState } from "react"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"holding" | "sold">("holding")

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
            <button className="bg-[#4169E1] hover:bg-[#3659d1] text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              Connect Wallet
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-12">
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
            <h1 className="text-4xl font-bold text-white mb-8">BTCSTR is currently holding</h1>

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
                    <div className="text-white text-3xl font-bold">4.842</div>
                  </div>
                </div>
              </div>

              {/* PEPE Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">🐸</div>
                  <div>
                    <div className="text-white/60 text-sm mb-1">BTCSTR</div>
                    <div className="text-white text-3xl font-bold">4.51B</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Burned Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
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
                </div>
                <div>
                  <div className="text-white/60 text-sm mb-1">BURNED $BTCSTR</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white text-3xl font-bold">6.21M</span>
                    <span className="text-white/60 text-sm">(0.62% of 1B)</span>
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
                Current rewards <span className="font-bold text-white">0.01 ETH</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-4">
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                  style={{ width: "96.6%" }}
                />
              </div>
              <div className="absolute -top-1 right-0 text-white text-sm font-medium">96.6%</div>
            </div>

            {/* Progress Text */}
            <p className="text-white/80 text-sm mb-6">
              When the machine acquires the missing <span className="text-green-400 font-semibold">0.168 ETH</span>, the
              first entity to trigger the functions below will process the mechanism forward and earn a reward.
            </p>

            {/* Buy Button */}
            <button className="w-full bg-[#a8d5ba] hover:bg-[#98c5aa] text-[#1e4d2b] py-4 rounded-xl text-lg font-semibold transition-colors">
              Buy
            </button>
          </div>

          {/* Orders Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mt-6">
            {/* Orders Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Orders</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("holding")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "holding"
                      ? "bg-white/20 text-white"
                      : "bg-transparent text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Currently Holding
                </button>
                <button
                  onClick={() => setActiveTab("sold")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "sold"
                      ? "bg-white/20 text-white"
                      : "bg-transparent text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Sold Pepe
                </button>
              </div>
            </div>

            {/* Conditional Rendering based on active tab */}
            {activeTab === "holding" ? (
              // Orders Grid
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Order #2 */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-white text-lg font-semibold">#2</span>
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
                        <span className="text-white font-semibold">5.077</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">PEPE BOUGHT</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🐸</span>
                        <span className="text-white font-semibold">2.27B</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">EST. VALUE (NOW)</span>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                        </svg>
                        <span className="text-white font-semibold">4.912</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">TARGET TO SELL</span>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                        </svg>
                        <span className="text-white font-semibold">6.092</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative mb-4">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                        style={{ width: "80.6%" }}
                      />
                    </div>
                    <div className="absolute -top-1 right-0 text-white/80 text-xs">80.6%</div>
                  </div>

                  {/* Sell Button */}
                  <button className="w-full bg-[#a8d5ba] hover:bg-[#98c5aa] text-[#1e4d2b] py-3 rounded-lg text-sm font-semibold transition-colors">
                    Sell
                  </button>
                </div>

                {/* Order #1 */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-white text-lg font-semibold">#1</span>
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
                        <span className="text-white font-semibold">5.063</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">PEPE BOUGHT</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🐸</span>
                        <span className="text-white font-semibold">2.24B</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">EST. VALUE (NOW)</span>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                        </svg>
                        <span className="text-white font-semibold">4.841</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">TARGET TO SELL</span>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                        </svg>
                        <span className="text-white font-semibold">6.075</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative mb-4">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                        style={{ width: "79.7%" }}
                      />
                    </div>
                    <div className="absolute -top-1 right-0 text-white/80 text-xs">79.7%</div>
                  </div>

                  {/* Sell Button */}
                  <button className="w-full bg-[#a8d5ba] hover:bg-[#98c5aa] text-[#1e4d2b] py-3 rounded-lg text-sm font-semibold transition-colors">
                    Sell
                  </button>
                </div>
              </div>
            ) : (
              // Empty state for Sold Pepe
              <div className="flex items-center justify-center py-16">
                <p className="text-white/60 text-lg">No PEPE sold yet</p>
              </div>
            )}
          </div>

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
