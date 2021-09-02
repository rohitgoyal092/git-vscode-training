export interface City {
  id: string;
  country: string;
  name: string;
  lat: number;
  lng: number;
}

export interface GetCities {
  getCities: City[];
}
