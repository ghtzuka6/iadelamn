const Discord = require('discord.js');
const Client = require('./lib/Client.js');
const client = new Client();
const mongoose = require("mongoose");
const data = require("./utils/data.json");
let fs = require("fs");

fs.readdir(__dirname + "/commands", (err, files) => {
    if(err) {
        console.error(err);
        return;
    }

    let jsfiles = files.filter((f) => f.split(".").pop() === "js");
    if(jsfiles.length < 0) {
        Log.log("[WARN] No commands to load.");
        return;
    }

    console.log(`[INFO] Loaded ${jsfiles.length} commands.`);

    jsfiles.forEach((f, i) => {
        let fileName = f.substring(0, f.length - 3);
        let fileContents = require("./commands/" + f);
        //console.log(`Command ${f} loaded`);
        client.commands.set(fileName, fileContents);
        delete require.cache[require.resolve(`./commands/${fileName}.js`)];
    });
});

for(const file of fs.readdirSync("./events")) {
    if(file.endsWith("js")) {
        let fileName = file.substring(0, file.length - 3);
        let fileContents = require("./events/" + file);
        client.on(fileName, fileContents.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    }
}

 let uri = `mongodb+srv://${data.database.username}:${data.database.password}@${data.database.url}/emoji-manager?retryWrites=true&w=majority`;


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, function(err) {
    if(err) {
        console.error(`[ERROR] Error .\n${err}`);
        process.exit(1);
    }
    console.log(`[INFO] Connected to ${data.database.url} (MongoDB)`);
});


client.login(data.token.discord).then(() => {
    console.log(`[INFO] Logged in ${client.user.tag}.`);
}).catch((err) => {
    console.error(`[ERROR] Can't login. \n${err}`);
});
