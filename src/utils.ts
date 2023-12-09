import { DEPOT_LOCATION } from "./driver.js";
import type { Load, Location } from "./types.js";

// We consider the distance between two points to be the drive time in minutes
export function getDriveTime(l1: Location, l2: Location) {
  return Math.sqrt(Math.pow(l2.x - l1.x, 2) + Math.pow(l2.y - l1.y, 2));
}

export function getLoadsFromFileContent(fileContent: string) {
  const lines = fileContent.split("\n");

  if (lines.length < 2) {
    console.error(
      "The selected file does not contain properly formatted input."
    );
    process.exit(1);
  }

  const loads: Load[] = [];

  for (let i = 1; i < lines.length - 1; i++) {
    if (lines[i]) {
      loads.push(parseLoad(lines[i]));
    }
  }

  // Don't allow the returned array to be mutated. The Load objects
  // within the array can be mutated but the array itself cannot.
  return loads as ReadonlyArray<Load>;
}

// input string example: "2 (161.69338827025,10.536541785902418) (80.7723838826288,45.61928131030916)"
function parseLoad(line: string): Load {
  const tokens = line.split(" ");

  if (tokens.length !== 3) {
    console.error(
      "The selected file does not contain properly formatted input."
    );
    process.exit(1);
  }

  const loadNumber = parseInt(tokens[0]);
  const pickup = parseLocation(tokens[1]);
  const dropoff = parseLocation(tokens[2]);

  // We will need the time it takes to go from pickup to dropoff multiple times throughout
  // the program so we compute it once and to save on computation.
  const transitTime = getDriveTime(pickup, dropoff);

  // When evaluating whether or not a driver can complete a pickup, we always have to check
  // whether they can make it from the dropoff location back to the depot so we will compute
  // that value once here and reuse it.
  const returnTime = getDriveTime(dropoff, DEPOT_LOCATION);

  return {
    loadNumber,
    pickup,
    dropoff,
    transitTime,
    returnTime,
    isDelivered: false,
  };
}

// input string example: "(161.69338827025,10.536541785902418)"
function parseLocation(locationStr: string): Location {
  const [xStr, yStr] = locationStr.slice(1, -1).split(",");
  return {
    x: parseFloat(xStr),
    y: parseFloat(yStr),
  };
}
