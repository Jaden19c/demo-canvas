import { BuildingType } from '@/enums/building';
import { DabeeoMap, DabeeoMapData } from 'dabeeomaps';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useBuilding = (mapData?: DabeeoMapData, newMap?: DabeeoMap) => {
    const [selectedBuildingId, setSelectedBuildingId] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const buildings = useMemo(() => {
        if (!mapData) return [];
        const buildings = mapData.dataMapInfo.getMapInfo()?.buildings ?? [];
        if (!Array.isArray(buildings) || !buildings?.length) return [];
        return buildings.filter((building) => building.buildingType !== BuildingType.OUTDOOR);
    }, [mapData?.dataMapInfo?.getMapInfo()?.buildings, mapData]);

    const removeBuilding = useCallback(
        (buildingId: string) => {
            if (!newMap) return;

            newMap.context?.removeBuilding?.(buildingId);
        },
        [newMap]
    );

    const addBuilding = useCallback(
        async (buildingId?: string, floorId?: string) => {
            try {
                setLoading(true);
                if (!newMap || !buildingId) {
                    setLoading(false);
                    return;
                }

                await newMap.context?.addBuilding?.(buildingId, floorId);
                setSelectedBuildingId(buildingId);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        },
        [newMap]
    );

    useEffect(() => {
        if (!Array.isArray(buildings) || !buildings?.length) {
            return;
        }
        setSelectedBuildingId(buildings[0].id);
    }, [buildings]);
    return {
        buildings,
        removeBuilding,
        addBuilding,
        selectedBuildingId,
        setSelectedBuildingId,
        loading,
    };
};
