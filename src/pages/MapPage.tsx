import { useMap } from "@/hooks/map/useMap";
import useThemeStore from "@/stores/theme";
import { useEffect, useMemo, useRef } from "react";

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  // Recreate map when layout width/height changes since the library doesn't support resize
  const didMountRef = useRef(false);
  const { isFullscreen } = useThemeStore();
  const mapConfig = useMemo(
    () => ({
      clientId: "8PHfV8LO4Ra8YcHnmz4UpY",
      clientSecret: "27d36e65fbc948e948fead7361a841e1",
    }),
    []
  );
  const { initMap, cleanupMap, loading } = useMap(mapConfig);

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
