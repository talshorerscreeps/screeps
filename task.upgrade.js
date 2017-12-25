module.exports = _.clone(require("base.task.moveAct"));

module.exports.setup = function(creep) {
  creep.memory.target = creep.room.controller.id;
}

module.exports.resetCondition = target => false;

module.exports.stopCondition = creep => creep.carry.energy == 0;

module.exports.action = "upgradeController";
