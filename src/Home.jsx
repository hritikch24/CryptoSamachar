import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=10&page=1&sparkline=false";

export default function Home() {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setTokens(data);
      });
  }, []);

  return (
    <main className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">India's Crypto Token Tracker</h1>
      <p className="text-center text-gray-700">Live INR comparisons, market news and token trends</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tokens.map(token => (
          <div key={token.id} className="bg-white p-4 rounded shadow">
            <div className="flex items-center gap-2 mb-2">
              <img src={token.image} alt={token.name} className="w-6 h-6" />
              <h2 className="font-semibold text-lg">{token.name}</h2>
            </div>
            <p>Price: ₹{token.current_price.toLocaleString()}</p>
            <p>24h Change: {token.price_change_percentage_24h.toFixed(2)}%</p>
            <p>Market Cap: ₹{token.market_cap.toLocaleString()}</p>
            <p>Volume: ₹{token.total_volume.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-center mt-8">Token Comparison</h2>
      <div className="w-full h-[300px] bg-white p-4 rounded shadow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={tokens}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="current_price" fill="#60a5fa" name="Price (INR)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
