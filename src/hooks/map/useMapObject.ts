import type { DabeeoMap, DabeeoMapData, IObjectOption } from "dabeeomaps";
import type { IObject } from "dabeeomaps/dist/src/model/map/IObject";
import { useCallback } from "react";

export const useMapObject = (
  currentMap?: DabeeoMap,
  mapData?: DabeeoMapData
) => {
  const hideObject = useCallback(
    (id?: string | string[]) => {
      if (!currentMap) return;
      currentMap.objects.hide(id);
    },
    [currentMap]
  );

  const showObject = useCallback(
    (id?: string | string[]) => {
      if (!currentMap) return;
      currentMap.objects.show(id);
    },
    [currentMap]
  );

  const resetObject = useCallback(
    (id?: string | string[]) => {
      if (!currentMap) return;
      currentMap.objects.reset(id);
    },
    [currentMap]
  );

  const setObject = useCallback(
    (options: IObjectOption): IObjectOption[] | undefined => {
      if (!currentMap) return;
      return currentMap.objects.set(options);
    },
    [currentMap]
  );

  const getMapObjectByFloorId = useCallback(
    (floorId?: string): IObject[] => {
      if (!mapData) return [];
      const result = mapData?.dataObject?.getObjects?.(floorId);
      return result;
    },
    [mapData]
  );

  return {
    hideObject,
    showObject,
    resetObject,
    setObject,
    getMapObjectByFloorId,
  };
};
