export type Place = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  address?: string;
  tags?: string[];

  distanceKm?: number;
  thumbnailUrl?: string;
  openNowText?: string;
  reviewSummary?: string;
  signatureMenuText?: string;
  Introduce?: string;
};
