module.exports.build = function(energyCapacityAvailable) {
  return require("common").largeBody(
    [MOVE, CARRY, WORK], energyCapacityAvailable, 6);
}

module.exports.next = function(creep) {
  if (creep.carry.energy == 0)
    return "harvest";
  else if (creep.memory.state == "harvest")
    return "deposit";
  else if (creep.memory.state == "deposit")
    return "build";
  else if (creep.memory.state == "build")
    return "upgrade";
}
