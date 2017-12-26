var baseBody = [MOVE, CARRY, WORK];

module.exports.setup = function(unit, spawnQueue, buildQueue) {
  Memory[unit] = {
    creep: null,
    pendingPush: true,
    firstRun: true,
    spawnQueue: spawnQueue,
    buildQueue: buildQueue,
    module: "roads",
  };
  var room = Game.rooms[Memory[buildQueue].room];
  var theSpawn = room.find(FIND_MY_SPAWNS)[0];
  var paths = [theSpawn.pos.findPathTo(room.controller)];
  room.find(FIND_SOURCES).forEach(
    source => paths.push(theSpawn.pos.findPathTo(source)));
  paths.forEach(path => path.forEach(
    tile => room.createConstructionSite(tile.x, tile.y, STRUCTURE_ROAD)));
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
  var memory = Memory[unit];
  if (memory.pendingPush) {
    if (memory.firstRun) {
      memory.firstRun = undefined;
      return;
    }
    var buildQueue = Memory[memory.buildQueue];
    var queue = buildQueue.queue;
    Game.rooms[buildQueue.room].find(FIND_CONSTRUCTION_SITES, {
      filter: site => site.structureType == STRUCTURE_ROAD,
    }).forEach(site => queue.push(site.id));
    memory.pendingPush = undefined;
  }
  var creep = memory.creep;
  if (creep !== null)
    require("lib.task").runCreep(unit, creep);
}

module.exports.getNextTask = function(unit, creep) {
  if (creep.carry.energy != 0) {
    if (creep.memory.task == "repair")
      return "upgrade";
    else
      return "repair";
  } else if (creep.memory.task == "withdraw") {
    return "idle";
  } else {
    return "withdraw";
  }
}
