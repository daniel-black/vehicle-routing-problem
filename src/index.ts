import { getFilePath, readProblemFile } from "./io.js";
import { getDriveTime, getLoadsFromFileContent } from "./utils.js";
import type { Driver, Load } from "./types.js";

const MAX_DRIVE_TIME = 720 as const; // 12 * 60 for max time in minutes

// read a file path from the command line args
const path = getFilePath();

// read the file data
const fileContent = readProblemFile(path);

// get loads from the data
const loads = getLoadsFromFileContent(fileContent);

const drivers: Driver[] = [];

// while there are incomplete loads...
while (loads.some((load) => !load.isComplete)) {
  // start with a driver
  const driver: Driver = {
    currentLocation: { x: 0, y: 0 },
    loadsCompleted: [],
    timeDriven: 0,
    hasReturned: false,
  };

  while (!driver.hasReturned) {
    const nearestLoad = findNearestAvailableValidLoad(driver, loads);

    if (!nearestLoad) {
      const deliveredLoads = driver.loadsCompleted;

      if (deliveredLoads.length > 0) {
        const lastDeliveredLoadNumber =
          deliveredLoads[deliveredLoads.length - 1];
        const lastDeliveredLoad = loads.find(
          (l) => l.loadNumber === lastDeliveredLoadNumber
        );

        // add the time it takes to return from the last delivered load
        driver.timeDriven += lastDeliveredLoad.returnTime;

        // update the driver's location so they are back at the depot
        driver.currentLocation.x = 0;
        driver.currentLocation.y = 0;

        driver.hasReturned = true; // end the driver while loop
        break;
      }
    }

    // we have a valid nearest load
    // add to drivers drive time
    driver.timeDriven +=
      nearestLoad.timeFromDriverToPickup +
      loads[nearestLoad.indexOfLoad].transitTime; // don't include the return time bc we might still be able to get more loads

    // mark load as complete and add it to drivers list of completed load load numbers
    loads[nearestLoad.indexOfLoad].isComplete = true;
    driver.loadsCompleted.push(loads[nearestLoad.indexOfLoad].loadNumber);

    // update drivers location to be the dropoff of the nearest load
    driver.currentLocation.x = loads[nearestLoad.indexOfLoad].dropoff.x;
    driver.currentLocation.y = loads[nearestLoad.indexOfLoad].dropoff.y;
  }

  if (driver.timeDriven > 0 && driver.hasReturned) {
    drivers.push(driver);
  }
}

for (let i = 0; i < drivers.length; i++) {
  console.log("loads: ");
  console.log(drivers[i].loadsCompleted);
  console.log("timeDriven: ", drivers[i].timeDriven);
  console.log();
}

type NearestLoad = {
  indexOfLoad: number; // gives us the index into the loads array (never change order of loads array)
  timeFromDriverToPickup: number;
};

// find the load with the nearest pickup location that could be succesfully delivered
// either returns indexOfNearest and timeFromDriverToPickup or undefined
function findNearestAvailableValidLoad(
  driver: Driver,
  loads: Load[]
): NearestLoad | undefined {
  let indexOfNearestLoad = -1;
  let shortestTimeFromDriverToPickup = Infinity;

  // loop through all the loads
  for (let i = 0; i < loads.length; i++) {
    // ignore completed loads
    if (loads[i].isComplete) {
      continue;
    }

    // compute how long it would take the driver to get to the pickup location
    const timeFromDriverToPickup = getDriveTime(
      driver.currentLocation,
      loads[i].pickup
    );

    // keep looking if getting to the load or delivering it would take too long
    if (
      driver.timeDriven + timeFromDriverToPickup > MAX_DRIVE_TIME ||
      driver.timeDriven + timeFromDriverToPickup + loads[i].transitTime >
        MAX_DRIVE_TIME
    ) {
      continue;
    }

    // keep looking if delivering the load and returning to the depot would take too long
    if (
      driver.timeDriven +
        timeFromDriverToPickup +
        loads[i].transitTime +
        loads[i].returnTime >
      MAX_DRIVE_TIME
    ) {
      continue;
    }

    // first time we find a valid, retrievable load
    if (indexOfNearestLoad === -1) {
      indexOfNearestLoad = i;
      shortestTimeFromDriverToPickup = timeFromDriverToPickup;

      continue;
    }

    if (timeFromDriverToPickup < shortestTimeFromDriverToPickup) {
      indexOfNearestLoad = i;
      shortestTimeFromDriverToPickup = timeFromDriverToPickup;
    }
  }

  // didn't find a load :(
  if (
    indexOfNearestLoad === -1 &&
    shortestTimeFromDriverToPickup === Infinity
  ) {
    return undefined;
  }

  const nearestLoad: NearestLoad = {
    indexOfLoad: indexOfNearestLoad,
    timeFromDriverToPickup: shortestTimeFromDriverToPickup,
  };

  return nearestLoad;
}
