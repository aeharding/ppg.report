import { setup } from "axios-cache-adapter";
import localforage from "localforage";

// Cache because data changes rarely, and we want to be nice
function createAxiosCached() {
  const forageStore = localforage.createInstance({
    // Prefix to prevent conflicts
    name: "ppg-report-axios-cache",
  });

  return setup({
    cache: {
      maxAge: 15 * 60 * 1000, // invalidate after 15 minutes
      exclude: { query: false }, // cache requests with ?page=x
      store: forageStore,
    },
  });
}

export default createAxiosCached();
