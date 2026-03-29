# gcal-embed

A Google Calendar frontend with a cleaner visual style, designed to be embedded in a [Homepage](https://github.com/gethomepage/homepage) server dashboard. Proxies Google Calendar API requests through a lightweight Express server to keep your API key off the client.

## Stack

- **Frontend:** Vanilla HTML/CSS/JS
- **Backend:** Node.js + Express (API proxy)
- **Served by:** Nginx (static) + Node on port 3000

## Project Structure
```
gcal-embed/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── config.js       # ← not committed, see below
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

### 2. Create your config file

`config.js` is excluded from version control. Create it at `public/config.js`:
```js
const ENV = {
  API_KEY:     'YOUR_GOOGLE_API_KEY',
  CALENDAR_ID: 'your.email@gmail.com',
};

// Node.js compatibility
if (typeof module !== 'undefined') {
  module.exports = ENV;
}
```

Replace `YOUR_GOOGLE_API_KEY` with a key from [Google Cloud Console](https://console.cloud.google.com/) with the **Google Calendar API** enabled. Restrict the key to the Calendar API and your server's IP/domain.

### 3. Run the server
```bash
node server.js
```

The proxy runs on port `3000`. Point Nginx at it or access directly at `http://your-server:3000`.

## Google API Key

1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Create a project → Enable **Google Calendar API**
3. Create an API key under **Credentials**
4. Restrict the key to the Calendar API

## .gitignore

`config.js` is intentionally ignored to keep your API key out of version control. Never commit it.
