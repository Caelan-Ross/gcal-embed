const express = require('express');
const https   = require('https');
const path    = require('path');
const app     = express();

const API_KEY      = process.env.API_KEY;
const CALENDAR_IDS = {
  main:           process.env.MAIN_CAL,
  bills:          process.env.BILLS_CAL,
  daysOff:        process.env.DAYS_OFF_CAL,
  gym:            process.env.GYM_CAL,
  payDays:        process.env.PAY_DAYS_CAL,
  rxAppointments: process.env.RX_CAL,
};
const CALENDAR_COLORS = {
  main:           '#4a86e8', // blue
  bills:          '#cc0000', // red
  daysOff:        '#c4a000', // olive
  gym:            '#16a765', // teal
  payDays:        '#e91e8c', // pink
  rxAppointments: '#795548', // brown
};

function fetchCalendar(name, calendarId, timeMin, timeMax) {
  return new Promise((resolve, reject) => {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`
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
        try {
          const parsed = JSON.parse(data);
          const color  = CALENDAR_COLORS[name] || '#4a86e8';
          const items  = (parsed.items || []).map(event => ({
            ...event,
            _calendarName:  name,
            _calendarColor: event.backgroundColor || color,
          }));
          resolve(items);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/events', async (req, res) => {
  const { timeMin, timeMax } = req.query;

  try {
    const results  = await Promise.all(
      Object.entries(CALENDAR_IDS).map(([name, id]) => fetchCalendar(name, id, timeMin, timeMax))
    );
    const allItems = results.flat().sort((a, b) => {
      const aTime = a.start.dateTime || a.start.date;
      const bTime = b.start.dateTime || b.start.date;
      return aTime < bTime ? -1 : aTime > bTime ? 1 : 0;
    });

    res.json({ items: allItems });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

app.listen(3000, () => console.log('gcal proxy running on :3000'));