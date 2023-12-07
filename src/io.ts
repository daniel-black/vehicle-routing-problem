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
