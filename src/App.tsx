import { useEffect, useMemo, useRef, useState } from "react";
import { useMap } from "./hooks/map/useMap";
import { Button } from "./components/ui/button";

export default function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(true);
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
    document.body.setAttribute(
      "data-screen-mode",
      isFullscreen ? "fullscreen" : ""
    );
  }, [isFullscreen]);

  // Recreate map when layout width/height changes since the library doesn't support resize
  const didMountRef = useRef(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [isFullscreen]);
  return (
    <div
      className="relative h-screen w-screen
    flex flex-col"
    >
      <div className="w-full h-[100px] bg-blue-100 flex items-center justify-center">
        <Button
          variant="outline"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          Toggle Width
        </Button>
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
