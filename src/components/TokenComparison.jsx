import { useEffect, useState } from 'react';

export default function TokenComparison() {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=5&page=1&sparkline=false')
      .then(res => res.json())
      .then(setTokens);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">📊 Top Token Comparison (INR)</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tokens.map(token => (
          <div key={token.id} className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition">
            <div className="flex items-center space-x-2 mb-2">
              <img src={token.image} alt={token.name} className="w-6 h-6" />
              <h3 className="font-semibold">{token.name}</h3>
            </div>
            <p>💰 Price: ₹{token.current_price.toLocaleString()}</p>
            <p>📈 24h Change: <span className={token.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}>
              {token.price_change_percentage_24h.toFixed(2)}%
            </span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
