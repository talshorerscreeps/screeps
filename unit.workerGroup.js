var baseBody = [MOVE, CARRY, WORK];

module.exports.setup = function(id, spawnQueue, buildQueue) {
  Memory[id] = {
    creeps: [],
    spawnQueue: spawnQueue,
    buildQueue: buildQueue,
    module: "workerGroup",
  };
  for (var i = 0; i < 6; i++)
    Memory[spawnQueue].queue.push({
      body: baseBody,
      unit: id,
    });
}

module.exports.creepSpawning = function(id, creepName) {
  Memory[id].creeps.push(creepName);
}

module.exports.creepDied = function(id, creepName) {
  var memory = Memory[id];
  _.pull(memory.creeps, creepName);
  var spawnQueue = Memory[memory.spawnQueue];
  spawnQueue.queue.unshift({
    unit: id,
    body: require("lib.body").largeBody(baseBody, spawnQueue, 6),
  });
}

module.exports.run = function(id) {
  require("lib.task").runCreeps(id, Memory[id].creeps);
}

module.exports.getNextTask = function(id, creep) {
  if (creep.carry.energy == 0)
    return "harvest";
  else if (creep.memory.task == "harvest")
    return "deposit";
  else if (creep.memory.task == "deposit")
    return "build";
  else if (creep.memory.task == "build")
    return "upgrade";
}
