import { DabeeoMap, DabeeoMapData, LANG_TYPE } from 'dabeeomaps';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useMapLanguage = (mapData?: DabeeoMapData, newMap?: DabeeoMap) => {
    const [selectedLanguage, setSelectedLanguage] = useState<LANG_TYPE | undefined>(undefined);

    const mapLanguages = useMemo(() => {
        const data = mapData?.dataMapInfo?.getLanguageSets?.();

        return data;
    }, [mapData?.dataMapInfo?.getLanguageSets?.()]);

    const handleChangeLanguage = useCallback(
        (lang?: LANG_TYPE) => {
            if (!newMap || !lang) return;

            newMap?.context?.changeLanguage?.(lang);
            setSelectedLanguage(lang);
        },
        [newMap]
    );

    useEffect(() => {
        if (!mapLanguages || !Array.isArray(mapLanguages) || !mapLanguages?.length) {
            return;
        }

        const filteredLanguages = mapLanguages.find((language) => language.defaultYn);
        if (!filteredLanguages) {
            setSelectedLanguage(mapLanguages[0]?.lang ?? '');
            return;
        }

        setSelectedLanguage(filteredLanguages?.lang ?? '');
    }, [mapLanguages]);

    return {
        mapLanguages,
        selectedLanguage,
        handleChangeLanguage,
    };
};
