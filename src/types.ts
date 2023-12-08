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
  isComplete: boolean;
};

export type Driver = {
  currentLocation: Location;
  loadsCompleted: number[]; // array of loadNumbers
  timeDriven: number;
  hasReturned: boolean;
};
