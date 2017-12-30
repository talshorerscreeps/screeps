var baseBody = [MOVE, CARRY, WORK];

module.exports.setup = function(unit, spawnQueue, buildQueue) {
  Memory[unit] = {
    creeps: [],
    spawnQueue: spawnQueue,
    buildQueue: buildQueue,
    module: "workerGroup",
  };
  for (var i = 0; i < 6; i++)
    Memory[spawnQueue].queue.push({
      body: baseBody,
      unit: unit,
    });
}

module.exports.creepSpawning = function(unit, creepName) {
  Memory[unit].creeps.push(creepName);
}

module.exports.creepDied = function(unit, creepName) {
  var memory = Memory[unit];
  _.pull(memory.creeps, creepName);
  var spawnQueue = Memory[memory.spawnQueue];
  spawnQueue.queue.unshift({
    unit: unit,
    body: require("lib.body").largeBody(baseBody, spawnQueue,
      memory.creeps.length ? 6 : 1),
  });
}

module.exports.run = function(unit) {
  require("lib.task").runCreeps(unit, Memory[unit].creeps);
}

module.exports.getNextTask = function(unit, creep) {
  if (creep.carry.energy == 0) {
    if (creep.memory.task == "harvest")
      return "idle";
    else
      return "harvest";
  } else if (creep.memory.task == "harvest") {
    return "deposit";
  } else if (creep.memory.task == "deposit") {
    return "build";
  } else if (creep.memory.task == "build") {
    return "upgrade";
  }
}
