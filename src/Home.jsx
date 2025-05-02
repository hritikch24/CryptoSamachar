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
    <main style={{ padding: 20 }}>
      <h1 style={{ textAlign: 'center' }}>India's Crypto Token Tracker</h1>
      <p style={{ textAlign: 'center' }}>Live INR comparisons, market news and token trends</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {tokens.map(token => (
          <div key={token.id} style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={token.image} alt={token.name} width={32} height={32} />
              <strong>{token.name}</strong>
            </div>
            <p>Price: ₹{token.current_price.toLocaleString()}</p>
            <p>24h Change: {token.price_change_percentage_24h.toFixed(2)}%</p>
            <p>Market Cap: ₹{token.market_cap.toLocaleString()}</p>
            <p>Volume: ₹{token.total_volume.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 40, textAlign: 'center' }}>Token Comparison</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={tokens}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="current_price" fill="#8884d8" name="Price (INR)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
