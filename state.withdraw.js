module.exports = new (require("state.base.energyTransfer"))();

var resetCondition = target => target.energy == 0;

module.exports.filter = target => (!resetCondition(target) && (
  target.structureType == STRUCTURE_EXTENSION ||
  target.structureType == STRUCTURE_SPAWN
));

module.exports.resetCondition = resetCondition;

module.exports.stopCondition = creep => (
  creep.carry.energy == creep.carryCapacity);

module.exports.action = "withdraw";
