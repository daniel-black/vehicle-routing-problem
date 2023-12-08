import { getFilePath, readProblemFile } from "./io.js";
import { getLoadsFromFileContent } from "./utils.js";
// import type { Location } from "./types.js";

// const MAX_DRIVE_TIME = 720 as const; // 12 * 60 for max time in minutes

// read a file path from the command line args
const path = getFilePath();

// read the file data
const fileContent = readProblemFile(path);

// get loads from the data
const loads = getLoadsFromFileContent(fileContent);

console.log("\nloads:\n", loads);

// const depot: Location = { x: 0, y: 0 } as const;
