# gcal-embed
A Google Calendar frontend with a cleaner visual style, designed to be embedded in a [Homepage](https://github.com/gethomepage/homepage) server dashboard. Proxies Google Calendar API requests through a lightweight Express server to keep your API key off the client.

Supports multiple sub-calendars with per-calendar colour coding and a colour legend.

## Stack
- **Frontend:** Vanilla HTML/CSS/JS
- **Backend:** Node.js + Express (API proxy)
- **Served by:** Node on port 3000

## Project Structure
```
gcal-embed/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── config.js
├── server.js
├── package.json
└── .gitignore
```

## Setup

### 1. Clone the repo
```bash
git clone git@github.com:Caelan-Ross/gcal-embed.git
cd gcal-embed
npm install
```

### 2. Create a `.env` file
Create a `.env` file in the `gcal-embed` directory. This file is gitignored and never committed.

```env
API_KEY=your_google_api_key
MAIN_CAL=your.email@gmail.com
BILLS_CAL=your_bills_calendar_id@group.calendar.google.com
DAYS_OFF_CAL=your_days_off_calendar_id@group.calendar.google.com
GYM_CAL=your_gym_calendar_id@group.calendar.google.com
PAY_DAYS_CAL=your_pay_days_calendar_id@group.calendar.google.com
RX_CAL=your_rx_calendar_id@group.calendar.google.com
```

Add or remove calendar entries to match your setup. Update `CALENDAR_COLORS` in `server.js` and the legend in `index.html` to match.

### 3. Run with Docker Compose
Add the following to your `docker-compose.yml`:

```yaml
gcal:
  image: node:20-alpine
  container_name: gcal-embed
  working_dir: /app
  volumes:
    - ../gcal-embed:/app
  ports:
    - "8099:3000"
  dns:
    - 192.168.1.84
  env_file:
    - ../gcal-embed/.env
  command: sh -c "npm install && node server.js"
  restart: unless-stopped
```

The proxy runs on port `3000`, mapped to `8099` on the host.

## Google API Key
1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Create a project → Enable **Google Calendar API**
3. Create an API key under **Credentials**
4. Restrict the key to the Calendar API

## Calendar Setup
Each calendar must be set to **public** for the API key method to work:
- Google Calendar → gear icon → Settings → your calendar → **Access permissions for events** → check **Make available to public**

Find your calendar IDs under Settings → click the calendar → scroll to **Integrate calendar**.

## Colours
Calendar colours are hardcoded in `server.js` under `CALENDAR_COLORS`, keyed by the same names used in your `.env`. Update these to match your Google Calendar colours. A colour legend is rendered in the header of the frontend.

## .gitignore
API credentials and calendar IDs are stored in `.env` and never committed to version control.
