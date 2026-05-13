const https = require('https');
const http = require('http');

const PING_URL = process.env.RENDER_EXTERNAL_URL || 'http://localhost:10000';
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes

function ping() {
  try {
    const url = new URL(PING_URL);
    const client = url.protocol === 'https:' ? https : http;

    client.get(PING_URL, (res) => {
      console.log(`[autopinger] ${new Date().toISOString()} — ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`[autopinger] Failed:`, err.message);
    });
  } catch (err) {
    console.error(`[autopinger] Bad URL:`, err.message);
  }
}

ping();
setInterval(ping, PING_INTERVAL);
console.log(`[autopinger] Started — pinging ${PING_URL} every 14 min`);
