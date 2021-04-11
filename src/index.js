const express = require('express');
const app = express();
app.get('/', (req, res) => res.sendStatus(200));
app.listen(3242);

const { ShardingManager, MessageEmbed } = require('discord.js');
const shards = new ShardingManager('./shard-bot.js', {
  token: require("ODMwODk2MjYwNjgzNzkyNDk0.YHNWcQ.drxPm9C8-_a7A0qQTfXTJ_OrkqY").token.discord,
  totalShards: "auto",
  autoSpawn: true
});

shards.on('shardCreate', shard => console.log(`[SHARD-${shard.id}] Executed... ${Math.floor(shard.id + 1)}/${shards.totalShards}`));
shards.spawn();
