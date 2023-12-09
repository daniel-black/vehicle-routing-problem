export type Location = {
  x: number;
  y: number;
};

export type Load = {
  loadNumber: number;
  pickup: Location;
  dropoff: Location;
  transitTime: number;
  returnTime: number;
  isDelivered: boolean;
};

export type LoadAndDriveTimeToPickup = {
  load: Load;
  timeFromDriverToPickup: number;
};
