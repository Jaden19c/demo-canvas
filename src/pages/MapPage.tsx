import { Button } from "@/components/ui/button";
import { useMapEvents } from "@/hooks/map";
import { useMap } from "@/hooks/map/useMap";
import useThemeStore from "@/stores/theme";
import { mapPoiToMarker } from "@/utils/marker";
import { useEffect, useMemo, useRef, useState } from "react";

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  // Recreate map when layout width/height changes since the library doesn't support resize
  const didMountRef = useRef(false);
  const { isFullscreen } = useThemeStore();
  const mapConfig = useMemo(
    () => ({
      clientId: "fEuxPAfr4Fu9Xvoe2LnTYV",
      clientSecret: "0b855d1ba23ef069cd5d5e82a789eecb",
    }),
    []
  );
  const { initMap, cleanupMap, loading, currentMap } = useMap(mapConfig);
  const [markerIds, setMarkerIds] = useState<string[]>([]);

  useEffect(() => {
    if (mapRef.current) {
      initMap(mapRef);
    }
  }, [initMap]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (!mapRef.current) return;

    cleanupMap();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        initMap(mapRef);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen]);

  useMapEvents({
    mapContainer: mapRef,
    onPoiClick: async (data) => {
      const marker = mapPoiToMarker(data?.[0]);
      if (marker) {
        const ids = await currentMap?.markers?.set({ marker: [marker] });
        setMarkerIds((prev) => [...prev, ...(Array.isArray(ids) ? ids : [])]);
      }
    },
  });

  useEffect(() => {
    return () => {
      cleanupMap();
    };
  }, [cleanupMap]);
  return (
    <div
      className="relative h-full w-full
      flex flex-col"
    >
      <div className="h-[100px] w-full flex items-center justify-center gap-3">
        <div>
          <Button>Add Maker</Button>
        </div>
        <div>
          <Button
            onClick={() => {
              console.log(1111, markerIds);
              currentMap?.markers?.clearAll();
              // currentMap?.markers?.clear(markerIds);
              setMarkerIds([]);
            }}
          >
            Remove Marker
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <div className="h-[50%] w-full fullscreen:h-full">
          <div ref={mapRef} className="h-full w-full"></div>
        </div>
      </div>
      {loading && (
        <div className="absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center">
          loading....
        </div>
      )}
    </div>
  );
}
