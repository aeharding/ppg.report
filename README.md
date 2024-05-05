```diff
- ⚠️ Warning! Fly at your own risk.
```

<img src="public/favicon-196.png" width="96" align="right">

# [🪂 PPG.report](https://ppg.report)

Weather report tailored for paramotor pilots. Consolidates data from multiple sources. Worldwide coverage, with extra information within the United States.

1. 🌏 [Open-Meteo](https://Open-Meteo.com/) for international winds aloft and hourly weather forecasts
2. 🌏 Nearby [Terminal Aerodrome Forecasts](https://www.aviationweather.gov/taf), if available
3. 🌏 Aviation Weather Center [SIGMETs](https://www.aviationweather.gov/sigmet) (international support), [G‑AIRMETs](https://www.aviationweather.gov/gairmet), and [CWAs](https://www.aviationweather.gov/cwamis)
4. 🇺🇸 The [NOAA Rapid Refresh Op40 analysis](https://rucsoundings.noaa.gov/)
5. 🇺🇸 NWS [hourly weather forecast](https://www.weather.gov/documentation/services-web-api)
6. 🇺🇸 National Weather Service [active alerts](https://alerts.weather.gov/cap/us.php?x=1)
7. 🇺🇸 Federal Aviation Administration [TFRs](https://tfr.faa.gov)

![Screenshot of PPG.report website](https://user-images.githubusercontent.com/2166114/166601608-42c74bed-7c87-41ef-bd55-0911b470a9c4.png)

## Available Scripts

In the project directory, you can run:

### `pnpm start`

Runs the app in the development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `pnpm test`

Launches the test runner in the interactive watch mode.

### `pnpm build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Deploying

Using a reverse proxy such as Nginx, configure the following:

- Serve `index.html` for 404 requests, no caching
  - Aggressively cache `/assets`
- Create the following reverse proxy endpoints:
  - REQUIRED endpoints (for worldwide support):
    - GET `/api/position/search` ➡ `https://nominatim.openstreetmap.org/search`
    - GET `/api/position/reverse` ➡ `https://nominatim.openstreetmap.org/reverse.php`
    - GET `/api/timezone` ➡ `http://api.timezonedb.com/v2.1/get-time-zone` (You will need to attach an API key. Note: This API is only used as a fallback for when the `/api/weather` endpoint fails, or when using Open-Meteo.)
    - GET `/api/openmeteo/{proxy+}` ➡ `https://api.open-meteo.com/v1/{proxy}` Get worldwide winds aloft and forecast information
  - OPTIONAL endpoints (to further enhance basic global support):
    - GET `/api/rap` ➡ `https://rucsoundings.noaa.gov/get_soundings.cgi`
    - GET `/api/aviationweather` ➡ `https://www.aviationweather.gov/adds/dataserver_current/httpparam`
    - GET `/api/weather/{proxy+}` ➡ `https://api.weather.gov/{proxy}` Greedy path capturing, forwards to api.weather.gov.
    - GET `/api/pqs` ➡ `https://epqs.nationalmap.gov/v1/json` Get United States altitude information for a given geolocation.
    - GET `/api/googleelevation` ➡ `https://maps.googleapis.com/maps/api/elevation/json` Get global altitude information for a given geolocation (backup API).
    - GET `/api/tfr` ➡ self-hosted [tfr-scraper](https://github.com/aeharding/tfr-scraper)
    - GET `/api/aviationalerts` ➡ self-hosted [aviation-wx](https://github.com/aeharding/aviation-wx)
- **IMPORTANT!** For each outgoing API request, make sure to:
  - Attach a `User-Agent` header, as per [NOAA](https://www.weather.gov/documentation/services-web-api) and [Nominatim](https://operations.osmfoundation.org/policies/nominatim/) usage policies.
  - **Keep these free APIs free - be a good API consumer!** Add caching for each route - I recommend at least 10 minutes for `rucsoundings.noaa.gov`, and one week for `nominatim.openstreetmap.org`.
