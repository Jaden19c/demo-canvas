import { DabeeoMap } from "dabeeomaps";
import type { IMarkersOption } from "dabeeomaps/dist/src/model/map/IMarkersOption";
import { useCallback, useState } from "react";

export const useMarker = (newMap?: DabeeoMap) => {
  const [loading, setLoading] = useState(false);
  const clearMarker = useCallback(
    (id: string[] | string) => {
      if (!newMap) return;

      newMap?.markers?.clear?.(id);
    },
    [newMap]
  );

  const clearAllMarker = useCallback(() => {
    if (!newMap) return;
    newMap?.markers?.clearAll?.();
  }, [newMap]);

  const addMarker = useCallback(
    async (options: IMarkersOption): Promise<string[]> => {
      try {
        setLoading(true);
        if (!newMap) {
          return [];
        }
        return await newMap?.markers?.set?.(options);
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [newMap]
  );

  return {
    clearMarker,
    clearAllMarker,
    loading,
    addMarker,
  };
};
