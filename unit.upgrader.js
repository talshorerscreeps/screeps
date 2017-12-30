var baseBody = [MOVE, CARRY, WORK];

module.exports.setup = function(unit, spawnQueue) {
  Memory[unit] = {
    creeps: [],
    spawnQueue: spawnQueue,
    module: "upgrader",
    ncreeps: 1,
  };
  Memory[spawnQueue].queue.push({
    body: baseBody,
    unit: unit,
  });
}

module.exports.creepSpawning = function(unit, creepName) {
  Memory[unit].creeps.push(creepName);
}

var spawnCreep = function(unit) {
  var spawnQueue = Memory[Memory[unit].spawnQueue];
  spawnQueue.queue.push({
    unit: unit,
    body: require("lib.body").largeBody(baseBody, spawnQueue, 2),
  });
  Memory[unit].ncreeps++;
}

module.exports.creepDied = function(unit, creepName) {
  var memory = Memory[unit];
  _.pull(memory.creeps, creepName);
  memory.ncreeps--;
  if (memory.creeps.length == 0)
    spawnCreep(unit);
}

module.exports.run = function(unit) {
  require("lib.task").runCreeps(unit, Memory[unit].creeps);
  var room = Game.rooms[Memory[Memory[unit].spawnQueue].room];
  if (room.energyCapacityAvailable == room.energyAvailable &&
      Memory[unit].ncreeps < 4) /* too many upgraders will starve everything */
    spawnCreep(unit);
}

module.exports.getNextTask = function(unit, creep) {
  if (creep.carry.energy != 0) {
    return "upgrade";
  } else if (creep.memory.task == "withdraw") {
    if (Memory[unit].ncreeps > 1)
      return "suicide";
    else
      return "idle";
  } else {
    return "withdraw";
  }
}
