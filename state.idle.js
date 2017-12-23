module.exports.setup = function(creep) {
  creep.memory.idle = true;
}

module.exports.cleanup = function(memory) {
  memory.idle = undefined;
}

module.exports.run = function(creep) {
  if (!creep.memory.idle)
    return true;
  creep.memory.idle = false;
}
