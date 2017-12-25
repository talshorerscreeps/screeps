module.exports.setup = function(id, room) {
  Memory[id] = {
    queue: [],
    room: room.name,
    extensionsChecked: 0,
    module: "buildQueue",
  };
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

module.exports.run = function(id) {
  var memory = Memory[id];
  var room = Game.rooms[memory.room];
  if (memory.extensionsChecked == room.controller.level)
    return;
  var extensions = room.find(FIND_MY_STRUCTURES, {
    filter: {structureType: STRUCTURE_EXTENSION},
  });
  if (extensions.length == CONTROLLER_STRUCTURES[
      STRUCTURE_EXTENSION][room.controller.level]) {
    memory.extensionsChecked = room.controller.level;
  } else {
    var pos = findPlaceForExtension(room, room.find(FIND_MY_SPAWNS)[0].pos);
    if (pos && room.createConstructionSite(pos.x, pos.y,
        STRUCTURE_EXTENSION) ==
        ERR_RCL_NOT_ENOUGH) {
      room.find(FIND_CONSTRUCTION_SITES, {
        filter: site => site.structureType == STRUCTURE_EXTENSION,
      }).forEach(site => memory.queue.push(site.id));
      memory.extensionsChecked = room.controller.level;
    }
  }
}
