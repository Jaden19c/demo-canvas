import type { DabeeoMap } from 'dabeeomaps';
import { useCallback } from 'react';

export const useMapContext = (currentMap?: DabeeoMap) => {
    const handleSetCanvasColor = useCallback(
        (color?: string) => {
            if (!currentMap || !color) return;
            currentMap.context?.setCanvasColor?.(color);
        },
        [currentMap]
    );

    return {
        handleSetCanvasColor,
    };
};
