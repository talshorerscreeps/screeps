var ref = require("lib.ref");

module.exports = _.clone(require("base.task.moveAct"));

module.exports.setup = function(creep) {
  var targets = creep.room.find(FIND_SOURCES_ACTIVE);
  if (targets.length == 0)
    return true;
  var best = targets[0].id;
  for (idx in targets) {
    var id = targets[idx].id;
    if (ref.count(id) < ref.count(best))
      best = id;
  }
  creep.memory.target = best;
  ref.get(creep.memory.target);
}

var baseCleanup = module.exports.cleanup;

module.exports.cleanup = function(memory) {
  ref.put(memory.target);
  baseCleanup(memory);
}

module.exports.resetCondition = target => target.energy == 0;

module.exports.stopCondition = creep => (
  creep.carry.energy == creep.carryCapacity);

module.exports.action = "harvest";
