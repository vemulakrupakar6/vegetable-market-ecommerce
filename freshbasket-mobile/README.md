# FreshBasket Mobile App (Ionic + Angular + Capacitor)

A mobile-first vegetable shopping app that uses the existing Node.js/Express backend and PostgreSQL database. UI is separated into HTML, SCSS and TypeScript files per page/component.

## Requirements

- Node.js 20+ recommended
- Android Studio (for Android emulator/build)
- Java JDK compatible with your Android Studio setup (Android Studio bundled JBR is usually sufficient)
- Existing backend running on port 3000
- Android phone and USB debugging enabled if testing on a physical device

## 1. Install and run in browser first

Extract the ZIP, open this folder in VS Code terminal:

```bash
npm install
npm start
```

Open `http://localhost:8100` after the Angular development server starts. This checks UI and API integration in a browser.

## 2. Configure backend address

Edit `src/app/config/app-config.ts`.

- Browser on same computer: `http://localhost:3000/api`
- Android emulator: `http://10.0.2.2:3000/api`
- Physical phone on same Wi-Fi: `http://YOUR_PC_LAN_IP:3000/api`
- Production: your HTTPS API URL

Also update `serverBaseUrl` to the matching backend origin (without `/api`).

The starter is set to `localhost` for browser testing. For Android, change both URLs to the emulator or phone address, then run `npm run android:sync`.

For physical phone testing, use your computer's LAN IPv4 address (run `ipconfig` on Windows). Ensure Windows Firewall allows incoming connections to the backend port and the backend listens on a reachable network interface. Both devices must be on the same Wi-Fi. Plain HTTP is only for local development; deploy HTTPS for production.

## 3. Android project setup

Install Android Studio. Open it once and install an Android SDK platform and Android SDK Build-Tools from SDK Manager. Create an emulator in Device Manager or connect a phone with USB debugging enabled.

From this project directory:

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

`npx cap add android` is required only the first time. If an `android/` folder already exists, do not repeat it.

In Android Studio, wait for Gradle sync. Select an emulator/device and click Run (green triangle).

## 4. After making code changes

```bash
npm run build
npx cap sync android
```

Then run the app again from Android Studio. `cap sync` copies the latest web build into the native Android project.

## 5. Features

- No customer login
- Product list from backend
- Product search
- Add to basket and quantity changes
- COD checkout and server-side stock validation
- Order/customer details are not saved by the current backend
- Separate page HTML/SCSS/TS files
- Mobile bottom navigation

## API expectations

- `GET /api/vegetables?search=...&page=1&limit=100` returns `{ data, pagination }`
- `POST /api/checkout/cod` accepts customer details and items
- Product images are served from `/uploads/...`

## Notes and limitations

- This starter contains customer shopping pages, not an admin screen. Continue managing products from the existing web admin dashboard.
- The current cart is in memory; it clears if the app is fully restarted.
- The checkout endpoint decrements stock but intentionally does not store order details.
- Local product image URLs must use the same backend origin as the API.
- For production, use HTTPS and add authentication to admin APIs before making admin features accessible from a public client.
