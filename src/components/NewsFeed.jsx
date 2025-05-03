import { useEffect, useState } from 'react';

export default function NewsFeed() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('https://cryptopanic.com/api/v1/posts/?auth_token=demo&public=true')
      .then(res => res.json())
      .then(data => setArticles(data.results || []));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">📰 Latest Crypto News</h2>
      <ul className="space-y-4">
        {articles.map(article => (
          <li key={article.id} className="bg-white p-4 rounded-xl shadow">
            <a href={article.url} target="_blank" className="text-blue-600 font-semibold hover:underline">
              {article.title}
            </a>
            <p className="text-sm text-gray-600">{article.published_at}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
