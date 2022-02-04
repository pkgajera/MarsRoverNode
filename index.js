const linebyline = require("linebyline");

var rover = {
  boundX: 0,
  boundY: 0,
  N: 1,
  E: 2,
  S: 3,
  W: 4,
  posX: 0,
  posY: 0,
  directionFacing: 1,
};

const directionInitials = {
  1: "N",
  2: "E",
  3: "S",
  4: "W",
};

readFileLineByLine = () => {
  return new Promise((resolve, reject) => {
    let lines = [];

    let rl = linebyline("./input.txt");
    rl.on("line", function (line, lineCount, byteCount) {
      lines.push(line);
    })
      .on("error", function (e) {
        // something went wrong
        console.log("e", e);
        resolve([]);
      })
      .on("close", function () {
        // the stream is closed
        resolve(lines);
      });
  });
};

setRoverBoundaries = (boundX, boundY) => {
  boundX = Number(boundX);
  boundY = Number(boundY);
  if (boundX <= 0 || boundY <= 0)
    throw "Bound coordinates must be positive and greater than zero";
  rover.boundX = boundX;
  rover.boundY = boundY;
};

setRoverPositionWithDirection = (posX, posY, direction) => {
  rover.posX = Number(posX);
  rover.posY = Number(posY);
  rover.directionFacing = rover[direction];
};

turnLeftBy90 = () => {
  const leftDir = rover.directionFacing - 1;
  rover.directionFacing = leftDir < rover["N"] ? rover["W"] : leftDir;
};

turnRightBy90 = () => {
  const rightDir = rover.directionFacing + 1;
  rover.directionFacing = rightDir > rover["W"] ? rover["N"] : rightDir;
};

moveRoverOneStepAhead = () => {
  if (rover.directionFacing === rover["N"]) {
    // check whether rover is colliding with boundaries specified
    if (rover.posY < rover.boundY) rover.posY++;
    else
      console.log(
        `Rover can't move ahead of the boundary coordinates of the plateau in y coordinate`
      );
  } else if (rover.directionFacing === rover["E"]) {
    // check whether rover is colliding with boundaries specified
    if (rover.posX < rover.boundX) rover.posX++;
    else
      console.log(
        `Rover can't move ahead of the boundary coordinates of the plateau in x coordinate`
      );
  } else if (rover.directionFacing === rover["S"]) {
    rover.posY--;
  } else if (rover.directionFacing === rover["W"]) {
    rover.posX--;
  }
};

checkBoundariesCollision = () => {};

executeCommands = (commands) => {
  commands = commands.split("");
  commands.forEach((letter, i) => {
    if (letter === "L") {
      // turn rover facing direction to left by 90
      turnLeftBy90();
    } else if (letter === "R") {
      // turn rover facing direction to right by 90
      turnRightBy90();
    } else if (letter === "M") {
      // move rover a step ahead in it's facing direction
      moveRoverOneStepAhead();
    } else {
      // give error for Invalid Input
      console.log(`Rover direction commands can only be 'L', 'R' or 'M'`);
    }
  });
};

readFileLineByLine()
  .then((data) => {
    data.forEach((item, i) => {
      const itemSplit = item.split(" ");
      if (i === 0) {
        // set boundaries first
        setRoverBoundaries(itemSplit[0], itemSplit[1]);
      } else if (i % 2 === 0) {
        // move rover based on commands given if index is even
        executeCommands(itemSplit[0]);
        // print output
        console.log(
          "Rover's Final position",
          `${rover.posX} ${rover.posY} ${
            directionInitials[rover.directionFacing]
          }`
        );
      } else {
        // set rover initial position if index is odd
        setRoverPositionWithDirection(itemSplit[0], itemSplit[1], itemSplit[2]);
      }
    });
  })
  .catch((e) => {
    console.log("Error:", e);
  });
