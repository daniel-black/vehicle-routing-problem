import { getFilePath } from "./io.js";

// read a file path from the command line args
const path = getFilePath();
console.log("path: ", path);
