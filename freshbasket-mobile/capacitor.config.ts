import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.freshbasket.market',
  appName: 'FreshBasket',
  webDir: 'www/browser',
  bundledWebRuntime: false,
  server: {
    // Do not set a remote URL here: the Angular app is bundled into the Android app.
    androidScheme: 'https'
  }
};

export default config;
