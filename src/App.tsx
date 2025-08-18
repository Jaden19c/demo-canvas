import { useEffect, useRef } from "react";
import { useMap } from "./hooks/map/useMap";

export default function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { initMap, loading } = useMap({
    clientId: "8PHfV8LO4Ra8YcHnmz4UpY",
    clientSecret: "27d36e65fbc948e948fead7361a841e1",
  });

  useEffect(() => {
    if (mapRef.current) {
      initMap(mapRef);
    }
  }, [initMap]);
  return (
    <div className="relative h-screen w-screen">
      <div className="h-[50%] w-full md:h-full">
        <div ref={mapRef} className="h-full w-full"></div>
      </div>
      {loading && (
        <div className="absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center">
          loading....
        </div>
      )}
    </div>
  );
}
