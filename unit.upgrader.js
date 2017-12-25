var baseBody = [MOVE, CARRY, WORK];

module.exports.setup = function(id, spawnQueue) {
  Memory[id] = {
    creep: null,
    spawnQueue: spawnQueue,
    module: "upgrader",
  };
  Memory[spawnQueue].queue.push({
    body: baseBody,
    unit: id,
  });
}

module.exports.creepSpawning = function(id, creepName) {
  Memory[id].creep = creepName;
}

module.exports.creepDied = function(id, creepName) {
  var memory = Memory[id];
  var spawnQueue = Memory[memory.spawnQueue];
  Memory[id].creep = null;
  spawnQueue.queue.push({
    unit: id,
    body: require("lib.body").largeBody(baseBody, spawnQueue, 2),
  });
}

module.exports.run = function(id) {
  var creep = Memory[id].creep;
  if (creep !== null)
    require("lib.task").runCreep(id, creep);
}

module.exports.getNextTask = function(id, creep) {
  if (creep.carry.energy != 0)
    return "upgrade";
  else if (creep.memory.task == "withdraw")
    return "idle";
  else
    return "withdraw";
}
