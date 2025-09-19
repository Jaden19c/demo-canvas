import {
  generateGetRouteOptions,
  generateNavigationOptions,
  generateWalkingOptions,
} from "@/utils/map";
import type { DabeeoMap, DabeeoMapData } from "dabeeomaps";
import { useCallback, useState } from "react";
import { useRouteDirection } from "./useRouteDirection";
import { useRouteSimulation } from "./useRouteSimulation";

export const useRouteNavigation = (
  mapData?: DabeeoMapData,
  currentMap?: DabeeoMap
) => {
  const [destinationPoint, setDestinationPoint] = useState<any>(null);
  const [routes, setRoutes] = useState<any>(null);

  const { getRouteDirection } = useRouteDirection(mapData);
  const {
    clearRouteSimulation,
    drawRouteSimulation,
    pauseRouteSimulation,
    resumeRouteSimulation,
    startRouteSimulation,
    stopRouteSimulation,
  } = useRouteSimulation(currentMap);

  const handleGetRouteDirections = useCallback(async () => {
    const routeDirections = await getRouteDirection(
      generateGetRouteOptions(
        destinationPoint.floorId,
        destinationPoint.position
      )
    );
    setRoutes(routeDirections);
  }, [getRouteDirection, destinationPoint]);

  const handleDrawRoute = useCallback(async () => {
    await drawRouteSimulation(
      routes?.recommendation,
      generateNavigationOptions()
    );
  }, [drawRouteSimulation, routes]);

  const handleStart = useCallback(() => {
    startRouteSimulation(generateWalkingOptions());
  }, [startRouteSimulation]);

  const handleStop = useCallback(() => {
    stopRouteSimulation();
  }, [stopRouteSimulation]);

  const handlePause = useCallback(() => {
    pauseRouteSimulation();
  }, [pauseRouteSimulation]);

  const handleResume = useCallback(() => {
    resumeRouteSimulation();
  }, [resumeRouteSimulation]);

  const handleClear = useCallback(() => {
    clearRouteSimulation();
  }, [clearRouteSimulation]);

  return {
    handleGetRouteDirections,
    handleDrawRoute,
    handleStart,
    handleStop,
    handlePause,
    handleResume,
    handleClear,
    setDestinationPoint,
  };
};
