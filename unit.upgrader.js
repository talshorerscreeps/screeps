var baseBody = [MOVE, CARRY, WORK];

module.exports.setup = function(unit, spawnQueue) {
  Memory[unit] = {
    creep: null,
    spawnQueue: spawnQueue,
    module: "upgrader",
  };
  Memory[spawnQueue].queue.push({
    body: baseBody,
    unit: unit,
  });
}

module.exports.creepSpawning = function(unit, creepName) {
  Memory[unit].creep = creepName;
}

module.exports.creepDied = function(unit, creepName) {
  var memory = Memory[unit];
  var spawnQueue = Memory[memory.spawnQueue];
  Memory[unit].creep = null;
  spawnQueue.queue.push({
    unit: unit,
    body: require("lib.body").largeBody(baseBody, spawnQueue, 2),
  });
}

module.exports.run = function(unit) {
  var creep = Memory[unit].creep;
  if (creep !== null)
    require("lib.task").runCreep(unit, creep);
}

module.exports.getNextTask = function(unit, creep) {
  if (creep.carry.energy != 0)
    return "upgrade";
  else if (creep.memory.task == "withdraw")
    return "idle";
  else
    return "withdraw";
}
