/*const redis = require("redis");

const client = redis.createClient({
    url: "redis://localhost:6379",
});

client.on("error", (error) => 
    console.log(`Redis error: ${error}`)
);

async function main() {
    await client.connect();

    await client.set("name", "Lahari", { EX: 10 });

    console.log(`Data available: ${await client.get("name")}`);
}

main();

setInterval(async () => {
    console.log(`Data available: ${await client.get("name")}`);
}, 10000);

module.exports = client;*/