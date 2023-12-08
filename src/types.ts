export type Location = {
  x: number;
  y: number;
};

export type Load = {
  loadNumber: number;
  pickup: Location;
  dropoff: Location;
  time: number;
  isComplete: boolean;
};
