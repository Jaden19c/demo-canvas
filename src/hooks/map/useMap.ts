import { BuildingType } from "@/enums/building";
import { getMapsInstance } from "@/lib/map";
import { useGetMapDataQuery } from "@/services/queries/map";
import type { MapDataPayload } from "@/types/map";
import { mapMyLocationToMarker } from "@/utils/map";
import { DabeeoMap, type MapOptions } from "dabeeomaps";
import type { IBuilding } from "dabeeomaps/dist/src/model/map/IBuilding";
import cloneDeep from "lodash.clonedeep";
import { type RefObject, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Error = {
  isError: boolean;
  message: string;
};

export const useMap = <T extends HTMLElement>(
  config: MapDataPayload,
  clearOutdoorBuildings: boolean = true
) => {
  const [searchParams] = useSearchParams();

  const studioFloorID = searchParams.get("studioFloorID");
  const studioPoiId = searchParams.get("studioPoiId");
  const floorGuideType = searchParams.get("floorGuideType");

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

  const removeBuilding = useCallback(
    (buildingId: string, newMap: DabeeoMap) => {
      if (!newMap) return;
      newMap.context?.removeBuilding?.(buildingId);
    },
    []
  );

  const addBuilding = useCallback(
    async (buildingId?: string, newMap?: DabeeoMap) => {
      try {
        if (!newMap || !buildingId) {
          return;
        }

        await newMap.context?.addBuilding?.(buildingId);
      } catch (error) {
        setError({
          isError: true,
          message: "Failed to add building",
        });
        console.error(error);
      }
    },
    []
  );

  const initBuildings = useCallback(
    async (buildings: IBuilding[], newMap?: DabeeoMap) => {
      try {
        if (!newMap || !Array.isArray(buildings) || !buildings?.length) {
          return;
        }

        for (const building of buildings) {
          removeBuilding(building.id, newMap);
        }

        await addBuilding(buildings[0].id, newMap);
      } catch (error) {
        setError({
          isError: true,
          message: "Failed to initialize buildings",
        });
        console.error(error);
      }
    },
    [removeBuilding, addBuilding]
  );

  const filterBuildings = useCallback(
    (buildings?: IBuilding[]) => {
      if (!buildings || !Array.isArray(buildings)) {
        return [];
      }

      if (clearOutdoorBuildings) {
        return buildings.filter(
          (building) => building.buildingType !== BuildingType.OUTDOOR
        );
      }

      return buildings;
    },
    [clearOutdoorBuildings]
  );

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

        const mapInfo = clonedMapData?.dataMapInfo?.getMapInfo?.();
        const hasBuildings =
          Array.isArray(mapInfo?.buildings) && mapInfo?.buildings?.length
            ? true
            : false;

        const newMap = await getMapsInstance().showMap(
          container.current,
          {
            framerate: 60,
            showWaterMarker: false,
            enableGeoreferencing: true,

            ...options,
          },
          mapData
        );
        newMap?.context.addAllBuilding();
        const markers = mapMyLocationToMarker();
        await newMap?.markers.set({ marker: markers ? [markers] : [] });

        if (!newMap) {
          setError({
            isError: true,
            message: "Failed to initialize map",
          });
          setIsMapReady(false);
          return;
        }

        if (hasBuildings && clearOutdoorBuildings) {
          initBuildings(filterBuildings(mapInfo?.buildings), newMap);
        }

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
    [mapData, initBuildings, filterBuildings, clearOutdoorBuildings]
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
