import { MAP_ICON_URL } from "@/constants/icon";
import type { IMarkerOption } from "dabeeomaps";

export const mapPoiToMarker = (poiItem?: any): IMarkerOption | undefined => {
  if (!poiItem) {
    return undefined;
  }
  return {
    x: poiItem?.position?.x,
    y: poiItem?.position?.y,
    floorId: poiItem?.floorId,
    fixedSize: true,
    iconOption: {
      width: 35,
      height: 48,
      anchor: {
        x: 0.5,
        y: -0.15,
      },
      iconUrl: MAP_ICON_URL.POSITION_MARKER_ICON,
    },
  };
};
