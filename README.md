# gcal-embed
A Google Calendar frontend with a cleaner visual style, designed to be embedded in a [Homepage](https://github.com/gethomepage/homepage) server dashboard. Proxies Google Calendar API requests through a lightweight Express server to keep your API key off the client.

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

### 2. Run with Docker Compose
Add the following to your `docker-compose.yml`:
```yaml
gcal:
  image: node:20-alpine
  container_name: gcal-embed
  working_dir: /app
  volumes:
    - /opt/gcal-embed:/app
  ports:
    - "8099:3000"
  environment:
    API_KEY: "your_google_api_key"
    CALENDAR_ID: "your.email@gmail.com"
  command: sh -c "npm install && node server.js"
  restart: unless-stopped
```

Replace `API_KEY` and `CALENDAR_ID` with your values. The proxy runs on port `3000`, mapped to `8099` on the host.

## Google API Key
1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Create a project → Enable **Google Calendar API**
3. Create an API key under **Credentials**
4. Restrict the key to the Calendar API

## Calendar Setup
Your calendar must be set to **public** for the API key method to work:
- Google Calendar → gear icon → Settings → your calendar → **Access permissions for events** → check **Make available to public**

## .gitignore
API credentials are passed via environment variables and never written to disk or committed to version control.
