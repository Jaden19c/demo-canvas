import { DabeeoMaps } from "dabeeomaps/dist/src/DabeeoMaps";

declare global {
  interface Window {
    dabeeo: {
      Maps: typeof DabeeoMaps;
    };
  }
}
