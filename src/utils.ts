import type { Load, Location } from "./types.js";

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

  return loads;
}

// line looks like: "2 (161.69338827025,10.536541785902418) (80.7723838826288,45.61928131030916)"
function parseLoad(line: string) {
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
  const time = getEuclideanDistance(pickup, dropoff);

  const load: Load = { loadNumber, pickup, dropoff, time, isComplete: false };

  return load;
}

// locationStr looks like: "(161.69338827025,10.536541785902418)"
function parseLocation(locationStr: string) {
  const [xStr, yStr] = locationStr
    .substring(1, locationStr.length - 1)
    .split(",");

  const location: Location = {
    x: parseFloat(xStr),
    y: parseFloat(yStr),
  };

  return location;
}

function getEuclideanDistance(l1: Location, l2: Location) {
  return Math.sqrt(Math.pow(l2.x - l1.x, 2) + Math.pow(l2.y - l1.y, 2));
}
