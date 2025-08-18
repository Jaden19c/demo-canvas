import type { MapDataPayload } from "@/types/map";
import { DabeeoMapData, Maps } from "dabeeomaps";

class MapInstance {
  private static instance: Maps | null = null;

  public static getInstance(): Maps {
    if (!this.instance) {
      this.instance = new Maps();
    }
    return this.instance;
  }

  public static async getMapData({
    clientId,
    clientSecret,
  }: MapDataPayload): Promise<DabeeoMapData> {
    const Maps = this.getInstance();
    const mapData = await Maps.getMapData({
      clientId,
      clientSecret,
    });

    return mapData;
  }
}

export const getMapsInstance = () => MapInstance.getInstance();
export const getMapData = async (params: MapDataPayload) => {
  try {
    const mapData = await MapInstance.getMapData(params);
    return mapData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
