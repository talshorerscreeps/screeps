module.exports.setup = function(unit, room) {
  Memory[unit] = {
    queue: [],
    room: room.name,
    extensionsChecked: 0,
    module: "buildQueue",
  };
}

var tryPlaceExtension = function(room, center, x, y) {
  const roomLimits = 50;
  const buffer = 4;
  x = center.x + x;
  if (x < buffer || x >= roomLimits - buffer)
    return;
  y = center.y + y;
  if (y < buffer || y >= roomLimits - buffer)
    return;
  if (room.getPositionAt(x, y).findInRange(FIND_SOURCES, 1).length != 0)
    return;
  if (room.createConstructionSite(x, y, STRUCTURE_EXTENSION) ==
      ERR_RCL_NOT_ENOUGH)
    return true;
}

var placeExtensions = function(room) {
  var x, y;
  var center = room.find(FIND_MY_SPAWNS)[0].pos;
  for (m = 1; m <= 5; m++) { /* set the limit to 3 for now */
    y = -m;
    for (x = -m; x <= m; x += 2)
      if (tryPlaceExtension(room, center, x, y))
        return;
    for (; y < m; y++) {
      x = m * 2 - Math.abs(y)
      if (tryPlaceExtension(room, center, -x, y))
        return;
      if (tryPlaceExtension(room, center, x, y))
        return;
    }
    for (x = -m; x <= m; x += 2)
      if (tryPlaceExtension(room, center, x, y))
        return;
  }
}

module.exports.run = function(unit) {
  var memory = Memory[unit];
  var room = Game.rooms[memory.room];
  if (memory.extensionsChecked == room.controller.level)
    return;
  if (memory.extensionsChecked == -1) {
    room.find(FIND_CONSTRUCTION_SITES, {
      filter: site => site.structureType == STRUCTURE_EXTENSION,
    }).forEach(site => memory.queue.push(site.id));
    memory.extensionsChecked = room.controller.level;
  } else {
    placeExtensions(room);
    memory.extensionsChecked = -1;
  }
}
