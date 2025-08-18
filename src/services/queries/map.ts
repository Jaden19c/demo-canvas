import { getMapData } from "@/lib/map";
import type { MapDataPayload } from "@/types/map";
import type { QueryKey, UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { DabeeoMapData } from "dabeeomaps";

export const useGetMapDataQuery = <TData = DabeeoMapData>(
  params: MapDataPayload,
  options?: Omit<
    UseQueryOptions<DabeeoMapData, unknown, TData, QueryKey>,
    "queryKey"
  >
) => {
  const { error, isError, ...rest } = useQuery<
    DabeeoMapData,
    unknown,
    TData,
    QueryKey
  >({
    queryKey: ["map-data", params],
    queryFn: async () => {
      const mapData = await getMapData(params);
      return mapData;
    },
    enabled: !!params?.clientId && !!params?.clientSecret,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    ...options,
  });

  return { error, isError, ...rest };
};
