var ref = require("ref");

var stateSpawn = require("state.spawn");

var getStateModule = function(memory) {
	return require("state." + memory.state);
}

var doSpawn = function(spawn, descs, prefix) {
	if (spawn.spawning) {
		var creep = Game.creeps[spawn.spawning.name];
		spawn.room.visual.text(
			"🛠️" + creep.memory.role,
			spawn.pos.x + 1,
			spawn.pos.y,
			{align: "left", opacity: 0.8});
		return;
	}
	for (var idx in descs) {
		desc = descs[idx];
		var role = desc[0];
		var refName = prefix + role;
		if (ref.count(refName) < desc[1]) {
			var name = spawn.name + "_" + role + "_" + Game.time;
			if (spawn.spawnCreep(desc[2], name, {memory: {
				role: role,
				state: "spawn",
				refPrefix: prefix,
			}}) == OK) {
				console.log("Spawning new creep: " + name);
				ref.get(refName);
				return;
			}
		}
	}
}

var doRoom = function(room) {
	var spawns = room.find(FIND_MY_SPAWNS);
	var the_spawn = spawns[0];

	doSpawn(the_spawn, [
		["worker", 4, [WORK, CARRY, MOVE]],
		["upgrader", 1, [WORK, CARRY, MOVE]],
	], room.name);

	for (var creep of room.find(FIND_MY_CREEPS)) {
		if (getStateModule(creep.memory).run(creep)) {
			getStateModule(creep.memory).cleanup(creep.memory);
			while (true) {
				creep.memory.state = require(
					"role." + creep.memory.role).next(creep);
				var stateModule = getStateModule(creep.memory);
				if (!stateModule.setup(creep)) {
					stateModule.run(creep);
					break;
				}
			}
		}
		creep.say(creep.memory.state);
	}
}

module.exports.loop = function () {
	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			var memory = Memory.creeps[name];
			getStateModule(memory).cleanup(memory);
			ref.put(memory.refPrefix + memory.role);
			delete Memory.creeps[name];
		}
	}

	if (Memory.rooms === undefined) {
		var the_room;
		for (var name in Game.spawns) {
			the_room = Game.spawns[name].room;
			break;
		}
		the_room.memory = {};
	}

	for (var name in Memory.rooms) {
		doRoom(Game.rooms[name]);
	}
}
