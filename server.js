const express = require('express');
const https   = require('https');
const path    = require('path');
const app     = express();

const API_KEY     = process.env.API_KEY;
const CALENDAR_ID = process.env.CALENDAR_ID;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/events', (req, res) => {
  const { timeMin, timeMax } = req.query;
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`
    + `?key=${API_KEY}`
    + `&timeMin=${encodeURIComponent(timeMin)}`
    + `&timeMax=${encodeURIComponent(timeMax)}`
    + `&singleEvents=true`
    + `&orderBy=startTime`
    + `&maxResults=250`;

  https.get(url, apiRes => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    });
  }).on('error', err => {
    res.status(500).json({ error: { message: err.message } });
  });
});

app.listen(3000, () => console.log('gcal proxy running on :3000'));
