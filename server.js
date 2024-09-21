const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();
const path = require('path');
const cors = require('cors');

app.use(cors());

// Log the API key being used (be cautious with this in production)
console.log('Using API key:', process.env.API_KEY);

// Cache object to store stock data
const cache = {};
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // Cache expiry time: 5 minutes

// Middleware and other configurations
app.use(express.json());

// API endpoint for fetching stock information
app.get('/api/stock', async (req, res) => {
    const stockSymbol = req.query.symbol;

    if (!stockSymbol) {
        return res.status(400).json({ error: 'Stock symbol is required' });
    }

    // Check if data exists in the cache and if it is still valid
    if (cache[stockSymbol] && (Date.now() - cache[stockSymbol].timestamp) < CACHE_EXPIRY_MS) {
        console.log('Serving from cache');
        return res.json(cache[stockSymbol].data);
    }

    try {
        // Fetch data from Yahoo Finance API
        const options = {
            method: 'GET',
            url: `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${stockSymbol}`,
            headers: {
                'accept': 'application/json',
                'X-API-KEY': process.env.API_KEY // Use environment variable for API key
            }
        };

        const response = await axios.request(options);
        const data = response.data.quoteResponse.result;

        if (!data || data.length === 0) {
            return res.status(400).json({ error: 'Invalid stock symbol or no data available' });
        }

        const latest = data[0]; // Get the first result

        const stockData = {
            symbol: latest.symbol,
			stockName: latest.displayName,

            currentPrice: latest.regularMarketPrice,
            weekRange: latest.regularMarketDayRange,
            yearRange: `${latest.fiftyTwoWeekLow} - ${latest.fiftyTwoWeekHigh}`
        };

        // Save the data to the cache
        cache[stockSymbol] = {
            timestamp: Date.now(),
            data: stockData
        };

        console.log('Serving fresh data');
        res.json(stockData);
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);

        // Handle specific error codes
        if (error.response && error.response.status === 403) {
            return res.status(403).json({ error: 'Access to the API is forbidden. Check your API key or subscription status.' });
        } else if (error.response && error.response.status === 400) {
            return res.status(400).json({ error: 'Bad request. Please check the stock symbol.' });
        }

        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

// Serve static files (your frontend files)
app.use(express.static(path.join(__dirname, '../../public')));

// Serve React frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
