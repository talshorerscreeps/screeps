var baseBody = [MOVE, CARRY, WORK];

module.exports.setup = function(unit, spawnQueue, buildQueue) {
  Memory[unit] = {
    creep: null,
    pendingPush: 0,
    spawnQueue: spawnQueue,
    buildQueue: buildQueue,
    paths: [],
    module: "roads",
  };
  var room = Game.rooms[Memory[buildQueue].room];
  var theSpawn = room.find(FIND_MY_SPAWNS)[0];
  Memory[unit].paths = [Room.serializePath(theSpawn.pos.findPathTo(
    room.controller))];
  room.find(FIND_SOURCES).forEach(
    source => Memory[unit].paths.push(Room.serializePath(
      theSpawn.pos.findPathTo(source))));
  Memory[spawnQueue].queue.push({
    body: baseBody,
    unit: unit,
  });
}

module.exports.creepSpawning = function(unit, creepName) {
  Memory[unit].creep = creepName;
  var room = Game.rooms[Memory[Memory[unit].buildQueue].room];
  Memory[unit].paths.forEach(path => Room.deserializePath(path).forEach(
    tile => room.createConstructionSite(tile.x, tile.y, STRUCTURE_ROAD)));
  room.find(FIND_STRUCTURES, {
    filter: { structureType: STRUCTURE_EXTENSION},
  }).forEach(function(target) {
    room.createConstructionSite(target.pos.x + 1, target.pos.y, STRUCTURE_ROAD);
    room.createConstructionSite(target.pos.x - 1, target.pos.y, STRUCTURE_ROAD);
    room.createConstructionSite(target.pos.x, target.pos.y + 1, STRUCTURE_ROAD);
    room.createConstructionSite(target.pos.x, target.pos.y - 1, STRUCTURE_ROAD);
  });
  Memory[unit].pendingPush = 2;
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
  if (memory.pendingPush != 0) {
    if (memory.pendingPush == 2) {
      memory.pendingPush = 1;
      return;
    }
    var buildQueue = Memory[memory.buildQueue];
    var queue = buildQueue.queue;
    var theSpawn = Game.rooms[Memory[Memory[unit].buildQueue].room].find(
      FIND_MY_SPAWNS)[0];
    Game.rooms[buildQueue.room].find(FIND_CONSTRUCTION_SITES, {
      filter: site => site.structureType == STRUCTURE_ROAD,
    }).sort((a, b) => a.pos.getRangeTo(theSpawn) -
      b.pos.getRangeTo(theSpawn)).forEach(site => queue.push(site.id));
    memory.pendingPush = 0;
  }
  var creep = memory.creep;
  if (creep !== null)
    require("lib.task").runCreep(unit, creep);
}

module.exports.getNextTask = function(unit, creep) {
  if (creep.carry.energy != 0) {
    if (creep.memory.task == "repair")
      return "build";
    else if (creep.memory.task == "build")
      return "upgrade";
    else
      return "repair";
  } else if (creep.memory.task == "withdraw") {
    return "idle";
  } else {
    return "withdraw";
  }
}
