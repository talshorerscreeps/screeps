module.exports.name = "harvest";

var common = require("common");

module.exports.setup = function(creep) {
	var sources = creep.room.find(FIND_SOURCES);
	var best = sources[0].id;
	for (idx in sources) {
		var id = sources[idx].id;
		if (common.refCount(id) < common.refCount(best))
			best = id;
	}
	creep.memory.source = best;
	common.ref(creep.memory.source);
}

module.exports.cleanup = function(memory) {
	common.deref(memory.source);
	memory.source = undefined;
}

module.exports.run = function(creep, done) {
	var source = Game.getObjectById(creep.memory.source);
	if (creep.carry.energy == creep.carryCapacity) {
		done(creep);
	} else if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
		creep.moveTo(source, {
			visualizePathStyle: {stroke: '#ffaa00'},
		});
	}
}
