import type { Load, Location } from "./types.js";

export const DEPOT_LOCATION: Location = { x: 0, y: 0 } as const;

export class Driver {
  public canPickupMoreLoads: boolean;
  private timeDriven: number; // in minutes
  private deliveredLoads: Load[];
  private lastDeliveredLoad: Load | undefined;

  constructor() {
    this.canPickupMoreLoads = true;
    this.timeDriven = 0;
    this.deliveredLoads = [];
    this.lastDeliveredLoad = undefined;
  }

  getTotalTimeDriven(): number {
    return this.timeDriven;
  }

  // If no loads have been delivered, then driver is still at the depot.
  // If loads have been delivered, then the driver is at the dropoff location of the last load.
  getCurrentLocation(): Location {
    return this.deliveredLoads.length > 0
      ? this.lastDeliveredLoad.dropoff
      : DEPOT_LOCATION;
  }

  returnToDepot(): void {
    if (this.lastDeliveredLoad) {
      // Account for the time it takes to return from the last dropoff location.
      this.timeDriven += this.lastDeliveredLoad.returnTime;
    }

    this.canPickupMoreLoads = false;
  }

  deliverLoad(load: Load, timeFromDriverToPickup: number): void {
    // Don't add the load.returnTime yet because we might still be able to pick up more loads.
    this.timeDriven += timeFromDriverToPickup + load.transitTime;

    // Mark load as delivered so other driver's don't try to deliver it.
    load.isDelivered = true;

    this.deliveredLoads.push(load);
    this.lastDeliveredLoad = load;
  }

  isDoneWithRoute(): boolean {
    return (
      this.timeDriven > 0 &&
      this.deliveredLoads.length > 0 &&
      !this.canPickupMoreLoads
    );
  }

  getFormattedLoads(): string {
    const loadNumbers = this.deliveredLoads.map((load) => load.loadNumber);
    return `[${loadNumbers.join(",")}]`;
  }
}
