import { DabeeoMap, DabeeoMapData } from 'dabeeomaps';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useFloor = (mapData?: DabeeoMapData, newMap?: DabeeoMap, selectedBuildingId?: string) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedFloorId, setSelectedFloorId] = useState<string>('');

    const floors = useMemo(() => {
        if (!mapData) return [];

        const buildings = mapData?.dataBuilding?.getBuildings?.();
        const filteredBuildings = buildings?.find((building) => building.id === selectedBuildingId);

        if (!filteredBuildings) {
            return mapData?.dataMapInfo?.getMapInfo?.()?.floors ?? [];
        }

        return filteredBuildings?.floors ?? [];
    }, [mapData?.dataMapInfo?.getMapInfo?.()?.floors, selectedBuildingId, mapData?.dataBuilding?.getBuildings?.()]);

    const handleChangeFloor = useCallback(
        async (floorId?: string) => {
            try {
                if (!newMap || !floorId) return;
                setLoading(true);
                await newMap.context?.changeFloor(floorId ?? '');

                setSelectedFloorId(floorId ?? '');
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        },
        [newMap]
    );

    useEffect(() => {
        if (!Array.isArray(floors)) {
            return;
        }
        setSelectedFloorId(floors.find((floor) => floor.defaultYn)?.id ?? '');
    }, [floors]);

    return {
        floors,
        selectedFloorId,
        setSelectedFloorId,
        handleChangeFloor,
        loading,
    };
};
