var ref = require("ref");

var stateSpawn = require("state.spawn");

var getStateModule = function(memory) {
	return require("state." + memory.state);
}

var getRoleModule = function(role) {
	return require("role." + role);
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
			if (spawn.spawnCreep(
				getRoleModule(role).build(
					spawn.room.energyCapacityAvailable),
				name, {memory: {
					role: role,
					state: "spawn",
					refPrefix: prefix,
				}
			}) == OK) {
				console.log("Spawning new creep: " + name);
				ref.get(refName);
				return;
			}
		}
	}
}

var tryPlaceExtension = function(room, center, x, y) {
	const roomLimits = 50;
	const buffer = 4;
	x = center.x + x * 2;
	if (x < buffer || x >= roomLimits - buffer)
		return;
	y = center.y + y * 2;
	if (y < buffer || y >= roomLimits - buffer)
		return;
	var look = room.lookAt(x, y);
	if (look.length > 1 || room.lookForAtArea(LOOK_SOURCES, y - 1, x - 1,
			y + 1, x + 1, true).length != 0)
		return;
	if (look[0].terrain == "plain" || look[0].terrain == "swamp")
		return {x: x, y: y}
}

var findPlaceForExtension = function(room, center) {
	for (m = 1; m <= 3; m++) { /* set the limit to 3 for now */
		var x, y;
		y = -m;
		x = -m;
		for (; x < m; x++) {
			var pos = tryPlaceExtension(room, center, x, y);
			if (pos)
				return pos;
		}
		for (; y < m; y++) {
			var pos = tryPlaceExtension(room, center, x, y);
			if (pos)
				return pos;
		}
		for (; x > -m; x--) {
			var pos = tryPlaceExtension(room, center, x, y);
			if (pos)
				return pos;
		}
		for (; y > -m; y--) {
			var pos = tryPlaceExtension(room, center, x, y);
			if (pos)
				return pos;
		}
	}
}

var doRoom = function(room) {
	var spawns = room.find(FIND_MY_SPAWNS);
	var the_spawn = spawns[0];

	doSpawn(the_spawn, [
		["worker", 4],
		["upgrader", 1],
	], room.name);

	if (room.memory.extensionsChecked < room.controller.level) {
		var extensions = room.find(FIND_MY_STRUCTURES, {
			filter: {structureType: STRUCTURE_EXTENSION},
		});
		if (extensions.length == CONTROLLER_STRUCTURES[
				STRUCTURE_EXTENSION][room.controller.level]) {
			room.memory.extensionsChecked = room.controller.level;
		} else {
			var pos = findPlaceForExtension(room, the_spawn.pos);
			if (pos && room.createConstructionSite(pos.x, pos.y,
					STRUCTURE_EXTENSION) ==
					ERR_RCL_NOT_ENOUGH) {
				room.memory.extensionsChecked = room.controller.level;
			}
		}
	}

	for (var creep of room.find(FIND_MY_CREEPS)) {
		if (getStateModule(creep.memory).run(creep)) {
			getStateModule(creep.memory).cleanup(creep.memory);
			while (true) {
				creep.memory.state = getRoleModule(
					creep.memory.role).next(creep);
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
		the_room.memory = {
			extensionsChecked: 1,
		};
	}

	for (var name in Memory.rooms) {
		doRoom(Game.rooms[name]);
	}
}
