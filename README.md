# Vehicle Routing Problem

This project is a solution to the [vehicle routing problem](https://en.wikipedia.org/wiki/Vehicle_routing_problem). It aims to efficiently assign loads to an unbounded number of drivers.

The goal is to provide a solution that yields a low total cost and runs quickly.

## To Build and Run

After cloning the repo to your local machine, install the dependencies:

```bash
npm install
```

Then run:

```bash
npm run build
```

A directly named `/dist` will be created and contain the transpiled JavaScript file, `index.js`.

To run the program against a test file, run:

```bash
node dist/index.js <path-to-test-file>
```

Expect an output like:

```
[1,4,5,8]
[10,2]
[7]
[6]
[3]
[9]
```

to appear in the terminal.
