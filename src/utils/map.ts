import { type INaviAnimOption } from "dabeeomaps/dist/src/model/map/INaviAnimOption";
import { TRANSPORTATION_REQUEST_TYPE, type IMarkerOption } from "dabeeomaps";
import type { INaviOptions } from "dabeeomaps/dist/src/model/map/INaviOptions";

const MAP_ICON_URL = {
  CURRENT_LOCATION_ICON: "/assets/svg/current-location-icon.svg",
  DESTINATION_POINT_ICON: "/assets/svg/destination-point-icon.svg",
  POSITION_MARKER_ICON: "/assets/svg/position-marker-icon.svg",
  START_POINT_ICON: "/assets/svg/start-point-icon.svg",
  WALKING_PERSON_ICON: "/assets/svg/walking-person-icon.svg",
};

export const mapMyLocationToMarker = (): IMarkerOption | undefined => {
  return {
    x: 1334.07,
    y: 1004.11,
    fixedSize: true,
    iconOption: {
      width: 80,
      height: 80,
      anchor: {
        x: 0.5,
        y: 0.55,
      },
      iconUrl: "/assets/svg/current-location-icon.svg",
    },
  };
};

export const generateGetRouteOptions = (
  selectedFloorId: string,
  position: { x: number; y: number }
) => {
  return {
    origin: {
      floorId: "c72a7926-1ea7-4b3e-862d-67cd52ba281a",
      position: {
        x: 1334.07,
        y: 1004.11,
      },
    },
    destination: {
      floorId: selectedFloorId,
      position: {
        x: position.x,
        y: position.y,
      },
    },
    type: [
      TRANSPORTATION_REQUEST_TYPE.RECOMMENDATION,
      TRANSPORTATION_REQUEST_TYPE.ELEVATOR,
      TRANSPORTATION_REQUEST_TYPE.ESCALATOR,
      TRANSPORTATION_REQUEST_TYPE.STAIRS,
    ],
  };
};

export const generateNavigationOptions = (): Partial<INaviOptions> => {
  return {
    defaultLineOption: {
      lineColor: "#0000ff",
      solidLineEnabled: true,
      solidLineWidth: 20,
    },

    origin: {
      markerOptions: {
        iconUrl: MAP_ICON_URL.START_POINT_ICON,
      },
    },
    destination: {
      markerOptions: {
        iconUrl: MAP_ICON_URL.DESTINATION_POINT_ICON,
      },
    },
  };
};

export const generateWalkingOptions = (): INaviAnimOption | undefined => {
  return {
    markerOptions: {
      iconUrl: MAP_ICON_URL.WALKING_PERSON_ICON,
    },
  };
};
