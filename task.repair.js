module.exports = _.clone(require("base.task.energyTransfer"));

var resetCondition = target => target.hits == target.hitsMax;

module.exports.filter = target => !resetCondition(target);

module.exports.resetCondition = resetCondition;

module.exports.stopCondition = creep => creep.carry.energy == 0;

module.exports.action = "repair";
