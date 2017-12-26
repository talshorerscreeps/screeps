var getTaskModule = function(memory) {
  return require("task." + memory.task);
}

module.exports.runCreep = function(unit, name) {
  creep = Game.creeps[name];
  if (creep === undefined) {
    var memory = Memory.creeps[name];
    getTaskModule(memory).cleanup(memory);
    Units[unit].creepDied(unit, name);
    delete Memory.creeps[name];
    return;
  }
  if (getTaskModule(creep.memory).run(creep)) {
    getTaskModule(creep.memory).cleanup(creep.memory);
    while (true) {
      creep.memory.task = Units[unit].getNextTask(unit, creep);
      var taskModule = getTaskModule(creep.memory);
      if (!taskModule.setup(creep)) {
        taskModule.run(creep);
        break;
      }
    }
  }
  creep.say(creep.memory.task);
}

module.exports.runCreeps = function(unit, creeps) {
  for (var name of creeps) {
    this.runCreep(unit, name);
  }
}
