import { DabeeoMap } from 'dabeeomaps';
import type { IControl } from 'dabeeomaps/dist/src/model/common/IControl';
import type { IVector2 } from 'dabeeomaps/dist/src/model/common/IVector2';
import { useCallback, useMemo } from 'react';

export const useMapControl = (newMap?: DabeeoMap) => {
    const handleControlMap = useCallback(
        (control: IControl) => {
            if (!newMap) return;

            newMap?.control?.set({
                transition: true,
                ...control,
            });
        },
        [newMap]
    );

    const handleMoveTo = useCallback(
        ({ transition = true, ...rest }: { position: IVector2; transition?: boolean; floorId?: string }) => {
            if (!newMap) return;
            newMap.control?.moveTo({ transition, ...rest });
        },
        [newMap]
    );

    const handleChangeZoom = useCallback(
        ({ zoom, transition = true }: { zoom: number; transition?: boolean }) => {
            if (!newMap) return;
            newMap.control?.changeZoom?.({ zoom, transition });
        },
        [newMap]
    );

    const currentCameraInfo = useMemo(() => {
        if (!newMap) return;
        return newMap?.control?.getCurrentCameraInfo?.();
    }, [newMap]);

    const handleResetMap = useCallback(() => {
        if (!newMap) return;
        newMap.control?.reset?.();
    }, [newMap]);

    return {
        handleControlMap,
        handleMoveTo,
        handleChangeZoom,
        handleResetMap,
        currentCameraInfo,
    };
};
