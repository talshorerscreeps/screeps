var ref = require("ref");

var stateSpawn = require("state.spawn");

var getStateModule = function(memory) {
	return require("state." + memory.state);
}

var doSpawn = function(spawn, descs) {
	for (var idx in descs) {
		desc = descs[idx];
		var role = desc[0];
		if (ref.count(role) < desc[1]) {
			var name = role + Game.time;
			if (spawn.spawnCreep(desc[2], name, {memory: {
				role: role,
			}}) == OK) {
				console.log("Spawning new creep: " + name);
				var creep = Game.creeps[name];
				creep.memory.state = "spawn";
				ref.get(role);
				return;
			}
		}
	}
}

module.exports.loop = function () {
	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			var memory = Memory.creeps[name];
			getStateModule(memory).cleanup(memory);
			ref.put(memory.role);
			delete Memory.creeps[name];
		}
	}

	var the_spawn = Game.spawns["Spawn1"];

	doSpawn(the_spawn, [
		["worker", 4, [WORK, CARRY, MOVE]],
		["upgrader", 1, [WORK, CARRY, MOVE]],
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
		if (getStateModule(creep.memory).run(creep)) {
			getStateModule(creep.memory).cleanup(creep.memory);
			while (true) {
				creep.memory.state = require(
					"role." + creep.memory.role).next(creep);
				if (!getStateModule(creep.memory).setup(creep))
					break;
			}
		}
		creep.say(creep.memory.state);
	}
}
