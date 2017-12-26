module.exports.setup = function(unit, room) {
  Memory[unit] = {
    queue: [],
    spawns: _.map(room.find(FIND_MY_SPAWNS), spawn => spawn.id),
    room: room.name,
    module: "spawnQueue",
  };
}

module.exports.run = function(unit) {
  var queue = Memory[unit].queue;
  if (queue.length == 0)
    return;
  for (var spawn of Memory[unit].spawns) {
    if (spawn.spawning)
      continue;
    var name = require("lib.uuid")();
    if (Game.getObjectById(spawn).spawnCreep(queue[0].body, name) == OK) {
      Memory.creeps[name].task = "spawn";
      var unit = queue[0].unit;
      Memory.creeps[name].unit = unit;
      Units[unit].creepSpawning(unit, name);
      queue.shift();
    }
  }
}
