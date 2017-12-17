var roles = [
	require("role.harvester")
];

var getRoleModule = function(name) {
	for (var idx in roles) {
		var role = roles[idx];
		if (name == role.name) {
			return role;
		}
	}
	return undefined;
}

module.exports.loop = function () {
	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			var memory = Memory.creeps[name];
			getRoleModule(memory.role).cleanup(memory);
			delete Memory.creeps[name];
		}
	}

	var the_spawn = Game.spawns["Spawn1"];

	if (_.filter(Game.creeps, (creep) => creep.memory.role == roles[0].name).length < 6) {
		var name = "Harvester" + Game.time;
		if (the_spawn.spawnCreep([WORK,CARRY,MOVE], name, {
			memory: {role: roles[0].name},
		}) == OK) {
			console.log("Spawning new harvester: " + name);
			var creep = Game.creeps[name];
			getRoleModule(creep.memory.role).setup(creep.memory);
		}
	}

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
		getRoleModule(creep.memory.role).run(creep);
	}
}
