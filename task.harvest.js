var ref = require("lib.ref");

module.exports.setup = function(creep) {
  var sources = creep.room.find(FIND_SOURCES);
  var best = sources[0].id;
  for (idx in sources) {
    var id = sources[idx].id;
    if (ref.count(id) < ref.count(best))
      best = id;
  }
  creep.memory.source = best;
  ref.get(creep.memory.source);
}

module.exports.cleanup = function(memory) {
  ref.put(memory.source);
  memory.source = undefined;
}

module.exports.run = function(creep) {
  var source = Game.getObjectById(creep.memory.source);
  if (creep.carry.energy == creep.carryCapacity) {
    return true;
  } else if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
    creep.moveTo(source, {
      visualizePathStyle: {stroke: '#ffaa00'},
    });
  }
}
