import { readFileSync } from "fs";

export function getFilePath() {
  const commandLineArgs = process.argv;

  if (commandLineArgs.length < 3) {
    console.error(
      "Please include the file path to the VRP text file as a command line argument."
    );
    process.exit(1);
  }

  const path = commandLineArgs[2];

  if (!path) {
    console.error(
      "Please include the file path to the VRP text file as a command line argument."
    );
    process.exit(1);
  }

  return path;
}

export function readProblemFile(path: string) {
  try {
    const data = readFileSync(path, "utf-8");
    return data;
  } catch (err) {
    console.error("Error reading the file: ", err);
    process.exit(1);
  }
}

type Location = {
  x: number;
  y: number;
};

type Load = {
  loadNumber: number;
  pickup: Location;
  dropoff: Location;
};

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
  console.log(tokens);

  if (tokens.length !== 3) {
    console.error(
      "The selected file does not contain properly formatted input."
    );
    process.exit(1);
  }

  const load: Load = {
    loadNumber: parseInt(tokens[0]),
    pickup: parseLocation(tokens[1]),
    dropoff: parseLocation(tokens[2]),
  };

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
