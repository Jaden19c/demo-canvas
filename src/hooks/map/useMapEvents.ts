import { type RefObject, useEffect } from "react";

type EventMap = {
  "poi-click": any[] | undefined;
  "navi-complete": any[] | undefined;
  "marker-click": any | undefined;
};

type EventCallbacks = {
  onPoiClick?: (data: any[]) => void;
  onNavigationComplete?: (data: any[]) => void;
  onMarkerClick?: (data: any) => void;
};

type Props<T extends HTMLElement> = {
  mapContainer?: RefObject<T | null>;
};

type HybridProps<T extends HTMLElement> = Props<T> & EventCallbacks;

export const useMapEvents = <T extends HTMLElement>({
  mapContainer,
  onPoiClick,
  onNavigationComplete,
  onMarkerClick,
}: HybridProps<T>) => {
  useEffect(() => {
    if (!mapContainer?.current) return;

    const eventConfigs: {
      eventName: keyof EventMap;
      callback: ((val: any) => void) | undefined;
      transform: (detail: any) => any;
    }[] = [
      { eventName: "poi-click", callback: onPoiClick, transform: (d) => d },
    ];

    if (onNavigationComplete) {
      eventConfigs.push({
        eventName: "navi-complete",
        callback: onNavigationComplete,
        transform: (d) => d,
      });
    }

    if (onMarkerClick) {
      eventConfigs.push({
        eventName: "marker-click",
        callback: onMarkerClick,
        transform: (d) => d,
      });
    }

    const cleanups: (() => void)[] = [];

    eventConfigs.forEach(({ eventName, callback, transform }) => {
      if (callback) {
        const handler = (e: CustomEvent) => callback(transform(e.detail));
        mapContainer.current!.addEventListener(
          eventName,
          handler as EventListener
        );
        cleanups.push(() =>
          mapContainer.current?.removeEventListener(
            eventName,
            handler as EventListener
          )
        );
      }
    });

    return () => cleanups.forEach((fn) => fn());
  }, [mapContainer, onPoiClick, onNavigationComplete, onMarkerClick]);
};
