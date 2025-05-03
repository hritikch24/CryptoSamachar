const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

// API endpoints - Using CoinGecko API with proper attribution
const CRYPTO_API_BASE = 'https://api.coingecko.com/api/v3';
const NEWS_API_BASE = 'https://newsapi.org/v2';

// Add headers to identify our application
const axiosConfig = {
    headers: {
        'User-Agent': 'CryptoKhabar/1.0',
        'Accept': 'application/json'
    }
};

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
fs.ensureDirSync(dataDir);

async function fetchTokenData() {
    try {
        // Fetch cryptocurrency data from CoinGecko API
        const response = await axios.get(`${CRYPTO_API_BASE}/coins/markets`, {
            ...axiosConfig,
            params: {
                vs_currency: 'inr',
                ids: 'bitcoin,ethereum,binancecoin,matic-network,wazirx',
                order: 'market_cap_desc',
                sparkline: false
            }
        });

        // Also fetch USD prices
        const usdResponse = await axios.get(`${CRYPTO_API_BASE}/coins/markets`, {
            ...axiosConfig,
            params: {
                vs_currency: 'usd',
                ids: 'bitcoin,ethereum,binancecoin,matic-network,wazirx',
                order: 'market_cap_desc',
                sparkline: false
            }
        });

        // Transform data to our format
        const tokenData = {};
        response.data.forEach((coin, index) => {
            const symbol = coin.symbol.toUpperCase();
            tokenData[symbol] = {
                name: coin.name,
                price_inr: coin.current_price,
                price_usd: usdResponse.data[index].current_price,
                change_24h: coin.price_change_percentage_24h,
                market_cap: coin.market_cap,
                volume_24h: coin.total_volume
            };
        });

        // Save to file
        fs.writeJsonSync(path.join(dataDir, 'tokens.json'), tokenData, { spaces: 2 });
        console.log('Token data fetched successfully');
    } catch (error) {
        console.error('Error fetching token data:', error.message);
        // Create sample data if API fails
        createSampleTokenData();
    }
}

async function fetchNewsData() {
    try {
        const response = await axios.get('https://newsdata.io/api/1/news', {
            params: {
                apikey: process.env.NEWSDATA_API_KEY,
                q: 'cryptocurrency OR blockchain india',
                language: 'en',
                category: 'business,technology'
            }
        });

        if (response.data.status === 'success' && response.data.results) {
            const newsData = response.data.results.slice(0, 6).map(article => ({
                title: article.title,
                summary: article.description || article.content,
                timestamp: article.pubDate,
                source: article.source_id,
                category: article.category?.[0] || 'Cryptocurrency',
                url: article.link || null,
                image_url: article.image_url || null
            }));

            fs.writeJsonSync(path.join(dataDir, 'news.json'), newsData, { spaces: 2 });
            console.log('News data fetched successfully from NewsData.io');
        } else {
            throw new Error('Invalid response from NewsData.io');
        }
    } catch (error) {
        console.error('Error fetching news data:', error.message);
        createSampleNewsData();
    }
}

async function fetchComparisonData() {
    try {
        const tokens = [
            { id: 'bitcoin', symbol: 'btc' },
            { id: 'ethereum', symbol: 'eth' },
            { id: 'binancecoin', symbol: 'bnb' },
            { id: 'matic-network', symbol: 'matic' },
            { id: 'wazirx', symbol: 'wrx' }
        ];

        const comparisonData = {};

        // Fetch historical data for all tokens in parallel
        await Promise.all(tokens.map(async (token) => {
            try {
                const response = await axios.get(`${CRYPTO_API_BASE}/coins/${token.id}/market_chart`, {
                    ...axiosConfig,
                    params: {
                        vs_currency: 'inr',
                        days: 7,
                        interval: 'daily'
                    }
                });

                comparisonData[token.symbol] = {
                    prices: response.data.prices.map(item => ({
                        timestamp: new Date(item[0]).toISOString(),
                        price: item[1]
                    }))
                };
            } catch (tokenError) {
                console.error(`Error fetching data for ${token.id}:`, tokenError.message);
                // Create sample data for this token if API fails
                comparisonData[token.symbol] = createSampleTokenHistory(token.symbol);
            }
        }));

        // Add attribution
        comparisonData.attribution = {
            source: "CoinGecko",
            url: "https://www.coingecko.com?utm_source=cryptokhabar&utm_medium=referral"
        };

        fs.writeJsonSync(path.join(dataDir, 'comparison.json'), comparisonData, { spaces: 2 });
        console.log('Comparison data fetched successfully from CoinGecko');
    } catch (error) {
        console.error('Error fetching comparison data:', error.message);
        createSampleComparisonData();
    }
}

// Helper function to create sample history for a token
function createSampleTokenHistory(symbol) {
    const now = Date.now();
    const basePrice = {
        'btc': 4500000,
        'eth': 315000,
        'bnb': 42000,
        'matic': 100,
        'wrx': 17
    }[symbol] || 1000;

    const variance = basePrice * 0.05; // 5% variance

    return {
        prices: Array.from({ length: 7 }, (_, i) => ({
            timestamp: new Date(now - (6 - i) * 24 * 3600 * 1000).toISOString(),
            price: basePrice + (Math.random() * 2 - 1) * variance
        }))
    };
}

function createSampleTokenData() {
    const sampleData = {
        "BTC": {
            "name": "Bitcoin",
            "price_inr": 4529000,
            "price_usd": 54321,
            "change_24h": 2.5,
            "market_cap": 1050000000000,
            "volume_24h": 42000000000
        },
        "ETH": {
            "name": "Ethereum",
            "price_inr": 317000,
            "price_usd": 3801,
            "change_24h": -1.2,
            "market_cap": 450000000000,
            "volume_24h": 18000000000
        },
        "BNB": {
            "name": "Binance Coin",
            "price_inr": 42500,
            "price_usd": 510,
            "change_24h": 1.8,
            "market_cap": 80000000000,
            "volume_24h": 2500000000
        },
        "MATIC": {
            "name": "Polygon",
            "price_inr": 108,
            "price_usd": 1.29,
            "change_24h": 5.3,
            "market_cap": 12000000000,
            "volume_24h": 800000000
        },
        "WRX": {
            "name": "WazirX",
            "price_inr": 17,
            "price_usd": 0.20,
            "change_24h": -3.2,
            "market_cap": 150000000,
            "volume_24h": 12000000
        }
    };
    
    fs.writeJsonSync(path.join(dataDir, 'tokens.json'), sampleData, { spaces: 2 });
    console.log('Sample token data created');
}

function createSampleNewsData() {
    const sampleNews = [
        {
            title: "RBI Launches Digital Rupee Pilot Program",
            summary: "Reserve Bank of India expands central bank digital currency pilot to more cities",
            timestamp: new Date().toISOString(),
            source: "Economic Times",
            category: "Regulatory",
            url: "https://economictimes.indiatimes.com/markets/cryptocurrency"
        },
        {
            title: "Polygon Announces Major zkEVM Upgrade",
            summary: "Indian-origin blockchain company Polygon reveals significant improvements to its scaling solution",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            source: "CryptoKhabar",
            category: "Technology",
            url: "https://techcrunch.com/blockchain"
        },
        {
            title: "Indian Crypto Exchanges Report Record Trading Volumes",
            summary: "WazirX and CoinDCX see unprecedented daily trading volumes amid market recovery",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            source: "Business Standard",
            category: "Market",
            url: "https://www.business-standard.com/markets/cryptocurrency"
        }
    ];
    
    fs.writeJsonSync(path.join(dataDir, 'news.json'), sampleNews, { spaces: 2 });
    console.log('Sample news data created');
}

function createSampleComparisonData() {
    const now = Date.now();
    const sampleComparison = {
        bitcoin: {
            prices: Array.from({ length: 168 }, (_, i) => ({
                timestamp: now - (167 - i) * 3600000,
                price: 4500000 + Math.random() * 100000
            }))
        },
        ethereum: {
            prices: Array.from({ length: 168 }, (_, i) => ({
                timestamp: now - (167 - i) * 3600000,
                price: 315000 + Math.random() * 10000
            }))
        }
    };
    
    fs.writeJsonSync(path.join(dataDir, 'comparison.json'), sampleComparison, { spaces: 2 });
    console.log('Sample comparison data created');
}

// Main execution
async function main() {
    console.log('Starting data fetch...');
    
    try {
        await fetchTokenData();
        await fetchNewsData();
        await fetchComparisonData();
        
        // Create timestamp file
        fs.writeJsonSync(path.join(dataDir, 'timestamp.json'), {
            lastUpdated: new Date().toISOString()
        }, { spaces: 2 });
        
        console.log('All data fetched successfully');
    } catch (error) {
        console.error('Error in main execution:', error);
        process.exit(1);
    }
}

main();