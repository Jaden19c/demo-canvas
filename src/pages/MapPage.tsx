import { Button } from "@/components/ui/button";
import { MOCK_ROUTES } from "@/constants/mock-data";
import {
  useFloor,
  useMapEvents,
  useRouteDirection,
  useRouteSimulation,
} from "@/hooks/map";
import { useMap } from "@/hooks/map/useMap";
import useThemeStore from "@/stores/theme";
import { formatData } from "@/utils/format-data";
import {
  generateGetRouteOptions,
  generateNavigationOptions,
} from "@/utils/map";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide, type SwiperRef } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const didMountRef = useRef(false);
  const { isFullscreen } = useThemeStore();
  const mapConfig = useMemo(
    () => ({
      clientId: "fEuxPAfr4Fu9Xvoe2LnTYV",
      clientSecret: "0b855d1ba23ef069cd5d5e82a789eecb",
    }),
    []
  );
  const [destinationPoint, setDestinationPoint] = useState<any>(null);
  const [routes, setRoutes] = useState<any>(null);
  const { initMap, cleanupMap, loading, currentMap, mapData } =
    useMap(mapConfig);
  const { selectedFloorId, floors, handleChangeFloor } = useFloor(
    mapData,
    currentMap
  );

  const swiperRef = useRef<SwiperRef>(null);
  const [isDisabledPrev, setIsDisabledPrev] = useState(true);
  const [isDisabledNext, setIsDisabledNext] = useState(true);

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

  const handleToggleTheme = () => {};

  const { getRouteDirection } = useRouteDirection(mapData);
  const {
    clearRouteSimulation,
    drawRouteSimulation,
    pauseRouteSimulation,
    resumeRouteSimulation,
    startRouteSimulation,
    stopRouteSimulation,
  } = useRouteSimulation(currentMap);

  const handleGetRouteDirections = useCallback(async () => {
    console.log(1111, selectedFloorId);
    const routeDirections = await getRouteDirection(
      generateGetRouteOptions(selectedFloorId, destinationPoint.position)
    );
    console.log(2222, routeDirections);
    setRoutes(routeDirections);
  }, [getRouteDirection, destinationPoint, selectedFloorId]);

  const handleSlideChange = useCallback(() => {
    if (!swiperRef.current) return;
    const swiper = swiperRef.current.swiper;
    setIsDisabledPrev(swiper.isBeginning);
    setIsDisabledNext(swiper.isEnd);
  }, []);

  const handlePoiClick = useCallback(
    async (data: any) => {
      if (!Array.isArray(data) || !data?.length) {
        return;
      }
      setDestinationPoint(data[0]);
    },
    [setDestinationPoint]
  );

  useMapEvents({
    mapContainer: mapRef,
    onPoiClick: handlePoiClick,
  });

  const handleDrawRoute = useCallback(async () => {
    await drawRouteSimulation(
      routes?.recommendation,
      generateNavigationOptions()
    );
  }, [routes, drawRouteSimulation]);

  const handleStart = useCallback(() => {
    startRouteSimulation();
  }, [startRouteSimulation]);
  const handleStop = useCallback(() => {
    stopRouteSimulation();
  }, [stopRouteSimulation]);
  const handlePause = useCallback(() => {
    pauseRouteSimulation();
  }, [pauseRouteSimulation]);
  const handleResume = useCallback(() => {
    resumeRouteSimulation();
  }, [resumeRouteSimulation]);
  const handleClear = useCallback(() => {
    clearRouteSimulation();
  }, [clearRouteSimulation]);

  useEffect(() => {
    console.log("mock data: ", formatData(MOCK_ROUTES));
  }, []);
  return (
    <div
      className="relative h-full w-full
      flex flex-col"
    >
      <div className="h-[100px] w-full bg-amber-50 flex items-center justify-center gap-3">
        <Button variant="outline" onClick={handleToggleTheme}>
          Toggle Theme
        </Button>

        <Button onClick={handleGetRouteDirections}>Get Routes</Button>
        <Button onClick={handleDrawRoute}>Draw</Button>
        <Button onClick={handleStart}>Start</Button>
        <Button onClick={handleStop}>Stop</Button>
        <Button onClick={handlePause}>Pause</Button>
        <Button onClick={handleResume}>Resume</Button>
        <Button onClick={handleClear}>Clear</Button>
      </div>
      <div className="flex h-[50px] items-center justify-center gap-3 bg-amber-100">
        {Array.isArray(floors) &&
          floors.map((item) => (
            <Button
              key={item?.id}
              variant={item?.id === selectedFloorId ? "outline" : "secondary"}
              onClick={async () => await handleChangeFloor(item?.id)}
            >
              {item.name[0].text}
            </Button>
          ))}
      </div>
      <div className="flex-1 flex">
        <div className="w-[300px] bg-purple-100 h-full flex items-center justify-center">
          <Swiper
            className="h-[300px] flex flex-col gap-2 overflow-y-auto"
            direction={"vertical"}
            centerInsufficientSlides
            slidesPerGroup={5}
            slidesPerView={5}
            loop={false}
            ref={swiperRef}
            onSlideChange={handleSlideChange}
            onInit={handleSlideChange}
          >
            {Array.isArray(floors) &&
              floors.map((item) => (
                <SwiperSlide className="w-fit">
                  <Button>{item.name[0].text}</Button>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
        <div ref={mapRef} className="h-full w-full flex-1"></div>
      </div>
      {loading && (
        <div className="absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center">
          loading....
        </div>
      )}
    </div>
  );
}
