module.exports.setup = function(creep) {
	var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	if (targets.length > 0)
		creep.memory.target = targets[0].id;
	else
		return true;
}

module.exports.cleanup = function(memory) {
	memory.target = undefined;
}

module.exports.run = function(creep) {
	if (creep.carry.energy == 0) {
		return true;
	} else {
		target = Game.getObjectById(creep.memory.target);
		var err = creep.build(target);
		if (err == ERR_NOT_IN_RANGE) {
			creep.moveTo(target, {
				visualizePathStyle: {stroke: '#ffffff'},
			});
		} else if (err == ERR_INVALID_TARGET) {
			return true;
		}
	}
}