const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// Cache object to store stock data
const cache = {};
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // Cache expiry time: 5 minutes

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
            url: `https://yahoo-finance15.p.rapidapi.com/api/yahoo/hi/history/${stockSymbol}/1d`,
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        const data = response.data.items;

        if (!data || data.length === 0) {
            return res.status(400).json({ error: 'Invalid stock symbol or no data available' });
        }

        // Fetch the latest stock data and calculate ranges
        const latest = data[0];
        const weekRange = calculateRange(data, 7);
        const monthRange = calculateRange(data, 30);
        const yearRange = calculateRange(data, 365);

        const stockData = {
            symbol: stockSymbol.toUpperCase(),
            currentPrice: latest.close,
            weekRange,
            monthRange,
            yearRange
        };

        // Save the data to the cache
        cache[stockSymbol] = {
            timestamp: Date.now(),
            data: stockData
        };

        console.log('Serving fresh data');
        res.json(stockData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

// Helper function to calculate price range over a period
function calculateRange(data, days) {
    const slicedData = data.slice(0, days);
    let min = Infinity;
    let max = -Infinity;

    slicedData.forEach(day => {
        const price = parseFloat(day.close);
        if (price < min) min = price;
        if (price > max) max = price;
    });

    return `${min.toFixed(2)} - ${max.toFixed(2)}`;
}

// Serve static files (your frontend files)
app.use(express.static('public'));

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
