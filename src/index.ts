import { getFilePath, getLoadsFromFileContent, readProblemFile } from "./io.js";

// read a file path from the command line args
const path = getFilePath();

// read the file data
const fileContent = readProblemFile(path);

// get loads from the data
const loads = getLoadsFromFileContent(fileContent);

console.log("path: ", path);
console.log("\nloads:\n", loads);
