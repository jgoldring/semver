- [Semver Precedence check](#semver-precedence-check)
  * [Getting Started](#getting-started)
    + [Simple Use](#simple-use)
    + [File Use](#file-use)
    + [Stack Use](#stack-use)
    + [Raw Nodejs Use](#raw-nodejs-use)
  * [Tests](#tests)

# Semver Precedence Check

Node JS Class for determing the precedence of two input semvers <https://semver.org/spec/v2.0.0.html>

## Getting Started

Please choose from the following 4 ways to run the project:

**Note** the first two make use of Docker commands wrapped inside the bash scripts. If you have nodejs installed on your system, please see option 3.

### Simple use

In the project directory, simply run:

```bash
$ ./run.sh compare <semver> <semver>
```

The script will print the results to the terminal.

### File use

In order to compare a large number of semvers, you can also create a file in the project directory.

Each line must contain two semvers separated by a space.

**Note** the input file path must be relative to the project directory.

```bash
$ cat semvers.txt
1.1.2 1.1.1
1.1.1-alpha 1.1.1
1.2.3-beta.1 1.2.3-beta

$ ./run.sh comparefile semvers.txt
```

The script will print the results to the terminal, for each line in the input file.

### Stack Use

Starts up a simple Express/React app to compare two semvers! After the first run, it will reuse build artifacts.

**Note** this requires docker to build and run. The dependencies can take a few minutes to build, this is sped up somewhat by the use of tmpfs.

```bash
$ ./run.sh stack 3000
```

After startup, you should see:
TODO after github published

### Raw Nodejs Use

To make use of this option, please ensure you have Nodejs v15.0.1 or higher installed

```bash
node index.js compare <semver> <semver>
```

The node script will print the results to the terminal.

## Tests

In the project directory, simply run:

```bash
$ ./test.sh
```

The test script will run all of the unit tests, and print to the terminal using the default Mochajs reporter