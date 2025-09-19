import type { DabeeoMap, INavigationResponse } from "dabeeomaps";
import type { INaviAnimOption } from "dabeeomaps/dist/src/model/map/INaviAnimOption";
import type { INaviOptions } from "dabeeomaps/dist/src/model/map/INaviOptions";
import { useCallback, useState } from "react";

export const useRouteSimulation = (currentMap?: DabeeoMap) => {
  const [loading, setLoading] = useState(false);
  const drawRouteSimulation = useCallback(
    async (
      navigation?: Partial<INavigationResponse>,
      naviOption?: Partial<INaviOptions>
    ) => {
      if (!currentMap) {
        return;
      }
      try {
        setLoading(true);
        await currentMap?.routeSimulation?.set?.(navigation, naviOption);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    },
    [currentMap]
  );

  const startRouteSimulation = useCallback(
    (animationOptions?: INaviAnimOption) => {
      if (!currentMap) {
        return;
      }

      currentMap?.routeSimulation?.start(animationOptions);
    },
    [currentMap]
  );

  const stopRouteSimulation = useCallback(() => {
    if (!currentMap) {
      return;
    }
    currentMap?.routeSimulation?.stop();
  }, [currentMap]);

  const clearRouteSimulation = useCallback(() => {
    if (!currentMap) {
      return;
    }
    currentMap?.routeSimulation?.clear();
  }, [currentMap]);

  const pauseRouteSimulation = useCallback(() => {
    if (!currentMap) {
      return;
    }
    currentMap?.routeSimulation?.pause();
  }, [currentMap]);

  const resumeRouteSimulation = useCallback(() => {
    if (!currentMap) {
      return;
    }
    currentMap?.routeSimulation?.resume();
  }, [currentMap]);

  return {
    loading,
    drawRouteSimulation,
    startRouteSimulation,
    stopRouteSimulation,
    clearRouteSimulation,
    pauseRouteSimulation,
    resumeRouteSimulation,
  };
};
