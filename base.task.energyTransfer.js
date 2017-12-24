module.exports.setup = function(creep) {
  var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: this.filter,
  });
  if (target === null)
    return true;
  else
    creep.memory.target = target.id;
}

module.exports.cleanup = function(memory) {
  memory.target = undefined;
}

module.exports.run = function(creep) {
  if (this.stopCondition(creep)) {
    return true;
  } else {
    var target = Game.getObjectById(creep.memory.target);
    if (this.resetCondition(target)) {
      if (this.setup(creep))
        return true;
      this.run(creep);
    }
    if (creep[this.action](target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
      creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
  }
}
