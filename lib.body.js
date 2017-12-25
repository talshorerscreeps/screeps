module.exports.totalCost = function(parts) {
  return _.reduce(_.map(parts, a => BODYPART_COST[a]), (a, b) => (a + b));
}

module.exports.largeBody = function(parts, spawnQueue, limit) {
  var mult = Math.floor(Game.rooms[spawnQueue.room].energyCapacityAvailable /
    this.totalCost(parts));
  var ret = [];
  if (limit && mult > limit)
    mult = limit;
  for (var i = 0; i < mult; i++)
    ret = ret.concat(parts);
  return ret;
}
