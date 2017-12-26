var the_room;
for (var name in Game.spawns) {
  the_room = Game.spawns[name].room;
  break;
}
var uuid = require("lib.uuid");
var spawnQueue = uuid();
var buildQueue = uuid();
var workerGroup = uuid();
var upgrader = uuid();
var roads = uuid();
require("unit.spawnQueue").setup(spawnQueue, the_room);
require("unit.buildQueue").setup(buildQueue, the_room);
require("unit.workerGroup").setup(workerGroup, spawnQueue, buildQueue);
require("unit.upgrader").setup(upgrader, spawnQueue);
require("unit.roads").setup(roads, spawnQueue, buildQueue);
Memory.units = [spawnQueue, buildQueue, workerGroup, upgrader, roads];
