module.exports.setup = function(id, room) {
  Memory[id] = {
    queue: [],
    spawns: _.map(room.find(FIND_MY_SPAWNS), spawn => spawn.id),
    room: room.name,
    module: "spawnQueue",
  };
}

module.exports.run = function(id) {
  var queue = Memory[id].queue;
  if (queue.length == 0)
    return;
  for (var spawn of Memory[id].spawns) {
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
