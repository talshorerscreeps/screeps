module.exports.cleanup = function(memory) {
  memory.target = undefined;
}

module.exports.act = function(creep, target) {
  return creep[this.action](target);
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
    if (this.act(creep, target) == ERR_NOT_IN_RANGE)
      creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
  }
}
