import type { DabeeoMapData, IRouteOption } from "dabeeomaps";
import type { INavigationResponseData } from "dabeeomaps/dist/src/model/map/INavigationResponse";
import { useCallback, useState } from "react";

export const useRouteDirection = (mapData?: DabeeoMapData) => {
  const [loading, setLoading] = useState(false);
  const getRouteDirection = useCallback(
    async (
      routeOptions: IRouteOption
    ): Promise<INavigationResponseData | undefined> => {
      if (!mapData) {
        return undefined;
      }
      try {
        setLoading(true);
        const directions = await mapData?.getRoute(routeOptions);

        setLoading(false);
        return directions;
      } catch (error) {
        console.error(error);
        setLoading(false);
        return undefined;
      }
    },
    [mapData]
  );

  return {
    loading,
    getRouteDirection,
  };
};
