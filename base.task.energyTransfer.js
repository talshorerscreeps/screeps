module.exports = _.clone(require("base.task.moveAct"));

module.exports.setup = function(creep) {
  var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: this.filter,
  });
  if (target === null)
    return true;
  else
    creep.memory.target = target.id;
}
