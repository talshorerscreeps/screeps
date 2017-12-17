var common = require("common");

var roles = [
	require("role.harvester"),
	require("role.worker"),
];

var getRoleModule = function(name) {
	return common.getByName(roles, name);
}

var doSpawn = function(spawn, descs) {
	for (var idx in descs) {
		desc = descs[idx];
		var role = desc[0];
		if (common.refCount(role.name) < desc[1]) {
			var name = role.name + Game.time;
			if (spawn.spawnCreep(desc[2], name, {memory: {
				role: role.name,
			}}) == OK) {
				console.log("Spawning new creep: " + name);
				var creep = Game.creeps[name];
				role.setup(creep);
				common.ref(role.name);
				return;
			}
		}
	}
}

module.exports.loop = function () {
	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			var memory = Memory.creeps[name];
			getRoleModule(memory.role).cleanup(memory);
			common.deref(memory.role);
			delete Memory.creeps[name];
		}
	}

	var the_spawn = Game.spawns["Spawn1"];

	doSpawn(the_spawn, [
		[roles[0], 3, [WORK, CARRY, MOVE]],
		[roles[1], 1, [WORK, CARRY, MOVE]],
	]);

	if (the_spawn.spawning) {
		var creep = Game.creeps[the_spawn.spawning.name];
		the_spawn.room.visual.text(
			"🛠️" + creep.memory.role,
			the_spawn.pos.x + 1,
			the_spawn.pos.y,
			{align: "left", opacity: 0.8});
	}

	for (var name in Game.creeps) {
		var creep = Game.creeps[name];
		if (getRoleModule(creep.memory.role) === undefined)
			creep.suicide();
		getRoleModule(creep.memory.role).run(creep);
	}
}
