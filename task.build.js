module.exports = _.clone(require("base.task.moveAct"));

module.exports.setup = function(creep) {
  var queue = Memory[Memory[creep.memory.unit].buildQueue].queue
  var target = queue[0];
  if (target === undefined) {
    return true;
  } else if (Game.getObjectById(target) === null) {
    queue.shift();
    return this.setup(creep);
  } else {
    creep.memory.target = target;
  }
}

module.exports.resetCondition = target => target === null;

module.exports.stopCondition = creep => creep.carry.energy == 0;

module.exports.action = "build";
