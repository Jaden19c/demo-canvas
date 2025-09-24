import { getMapsInstance } from "@/lib/map";
import { useGetMapDataQuery } from "@/services/queries/map";
import type { MapDataPayload } from "@/types/map";
import { CAMERA_TYPE, DabeeoMap, type MapOptions } from "dabeeomaps";
import cloneDeep from "lodash.clonedeep";
import { type RefObject, useCallback, useEffect, useState } from "react";

type Error = {
  isError: boolean;
  message: string;
};

export const useMap = <T extends HTMLElement>(
  config: MapDataPayload,
  clearOutdoorBuildings: boolean = true
) => {
  const [currentMap, setCurrentMap] = useState<DabeeoMap | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>({
    isError: false,
    message: "",
  });
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  const { data: mapData, isFetching, isError } = useGetMapDataQuery(config);

  const initMap = useCallback(
    async (container: RefObject<T | null>, options?: Partial<MapOptions>) => {
      try {
        setLoading(true);
        setIsMapReady(false);
        setError({
          isError: false,
          message: "",
        });

        if (!container.current) {
          setError({
            isError: true,
            message: "Map container is not initialized",
          });
          setIsMapReady(false);
          return;
        }

        if (!mapData) {
          setError({
            isError: true,
            message: "Map data is not available",
          });
          setIsMapReady(false);
          return;
        }

        const clonedMapData = cloneDeep(mapData);

        const newMap = await getMapsInstance().showMap(
          container.current,
          {
            camera: CAMERA_TYPE.D2,
            enableGeoreferencing: true,
            framerate: 60,
            showWaterMarker: false,
            showPoi: true,
            spriteEnable: false,

            ...options,
          },
          clonedMapData
        );

        if (!newMap) {
          setError({
            isError: true,
            message: "Failed to initialize map",
          });
          setIsMapReady(false);
          return;
        }

        await newMap?.context.addAllBuilding();

        setCurrentMap(newMap);
        setError({
          isError: false,
          message: "",
        });
        setIsMapReady(true);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setError({
          isError: true,
          message: errorMessage,
        });
        setIsMapReady(false);
        return;
      } finally {
        setLoading(false);
      }
    },
    [mapData]
  );

  const cleanupMap = useCallback(() => {
    if (currentMap && currentMap?.context?.cleanup) {
      currentMap?.context?.cleanup?.();
      setCurrentMap(undefined);
      setIsMapReady(false);
    }
  }, [currentMap]);

  useEffect(() => {
    if (isError) {
      setError({
        isError: true,
        message: "Map data is not available",
      });
      setIsMapReady(false);
    }
  }, [isError]);

  return {
    initMap,
    cleanupMap,
    currentMap,
    mapData,
    loading: isFetching || loading,
    error,
    isMapReady,
  };
};
