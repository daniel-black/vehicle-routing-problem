import { getFilePath, readProblemFile, printDriverLoads } from "./io.js";
import { getDriveTime, getLoadsFromFileContent } from "./utils.js";
import { Driver } from "./driver.js";
import type { Load, LoadAndDriveTimeToPickup } from "./types.js";

// 12 * 60 for max drive time in minutes. Drivers must not drive more than MAX_DRIVE_TIME.
const MAX_DRIVE_TIME = 720 as const;

main();

function main() {
  // take file path as input
  const path = getFilePath();
  const fileContent = readProblemFile(path);

  // create loads from the file data
  const loads = getLoadsFromFileContent(fileContent);

  // keep track of our drivers
  const drivers: Driver[] = [];

  // determine which drivers take which loads
  vehicleRouter(loads, drivers);

  // output results
  printDriverLoads(drivers);
}

function vehicleRouter(loads: ReadonlyArray<Load>, drivers: Driver[]) {
  // the work isn't done until we've delivered every load
  while (loads.some((load) => !load.isDelivered)) {
    const driver = new Driver();

    while (driver.canPickupMoreLoads) {
      const nearestLoad = findNearestCompletableLoad(driver, loads);

      if (!nearestLoad) {
        driver.returnToDepot();
        break;
      }

      driver.deliverLoad(nearestLoad.load, nearestLoad.timeFromDriverToPickup);
    }

    if (driver.isDoneWithRoute()) {
      drivers.push(driver);
    }
  }
}

function findNearestCompletableLoad(
  driver: Driver,
  loads: ReadonlyArray<Load>
): LoadAndDriveTimeToPickup | undefined {
  // Returns undefined if it cannot find a nearby load that the driver could
  // complete while staying under the MAX_DRIVE_TIME
  let nearestLoad: LoadAndDriveTimeToPickup | undefined = undefined;

  const driverLocation = driver.getCurrentLocation();

  // find the nearest load that the driver could complete before their MAX_DRIVE_TIME is up
  for (let i = 0; i < loads.length; i++) {
    const load = loads[i];

    // skip already delivered loads
    if (load.isDelivered) {
      continue;
    }

    // compute how long it would take the driver to get to the pickup location
    const timeFromDriverToPickup = getDriveTime(driverLocation, load.pickup);

    const totalTimeToDeliverAndReturnToDepot =
      driver.getTotalTimeDriven() +
      timeFromDriverToPickup +
      load.transitTime +
      load.returnTime;

    if (totalTimeToDeliverAndReturnToDepot <= MAX_DRIVE_TIME) {
      if (
        !nearestLoad ||
        timeFromDriverToPickup < nearestLoad.timeFromDriverToPickup
      ) {
        // If the driver can drive to a nearby load, pick it up, deliver it, and return
        // to the depot, then we consider that our nearest load and return it out.
        nearestLoad = {
          load: load,
          timeFromDriverToPickup: timeFromDriverToPickup,
        };
      }
    }
  }

  return nearestLoad;
}
