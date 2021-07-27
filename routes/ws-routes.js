var router = require("express").Router();

router.ws("/checkUpdate", function (ws, req) {
  let trends = req.app.get("trends");

  ws.on("message", function (msg) {
    const parsedMessage = JSON.parse(msg);
    console.log(
      `User: ${req.socket.remoteAddress} requested hash for ${parsedMessage.woeid}`
    );
    let hashRegional = trends.provideCurrentHash(parsedMessage.woeid);
    let hashGlobal = trends.provideCurrentHash(1);
    const reply = {
      regional: hashRegional,
      global: hashGlobal,
    };
    ws.send(JSON.stringify(reply));
  });

  ws.on("close", () => {
    console.log(`User: ${req.socket.remoteAddress} disconnected!`);
  });
});

module.exports = router;
