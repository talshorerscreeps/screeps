module.exports = _.clone(require("base.task.moveAct"));

module.exports.setup = function(creep) {
  var target = creep.room.memory.buildQueue[0];
  if (target === undefined) {
    return true;
  } else if (Game.getObjectById(target) === null) {
    creep.room.memory.buildQueue = creep.room.memory.buildQueue.splice(1);
    return this.setup(creep);
  } else {
    creep.memory.target = target;
  }
}

module.exports.resetCondition = target => target === null;

module.exports.stopCondition = creep => creep.carry.energy == 0;

module.exports.action = "build";
