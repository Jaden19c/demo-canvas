import type { IDataFloor } from 'dabeeomaps/dist/src/model/map/IDataFloor';
import { useMemo } from 'react';

export const useConvertFloors = (floors: IDataFloor[], sortOrder: 'asc' | 'desc') => {
    const filteredFloors = useMemo(() => {
        if (!Array.isArray(floors)) return [];
        return floors.filter((floor) => floor?.id);
    }, [floors]);

    const sortedFloors = useMemo(() => {
        if (!Array.isArray(filteredFloors)) return [];
        return filteredFloors.sort((a, b) => (sortOrder === 'asc' ? a.order - b.order : b.order - a.order));
    }, [filteredFloors, sortOrder]);

    return { floors: filteredFloors, sortedFloors };
};
