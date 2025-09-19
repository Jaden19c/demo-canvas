import type { DabeeoMap } from 'dabeeomaps';
import type { IPoiOption } from 'dabeeomaps/dist/src/model/map/IPoiOption';
import { useCallback } from 'react';

export const usePoi = (currentMap?: DabeeoMap) => {
    const setPoi = useCallback(
        (options: IPoiOption) => {
            if (!currentMap) return;
            currentMap.pois.set(options);
        },
        [currentMap]
    );

    const resetPoi = useCallback(
        (id?: string | string[]) => {
            if (!currentMap) return;
            currentMap.pois.reset(id);
        },
        [currentMap]
    );

    return {
        setPoi,
        resetPoi,
    };
};
