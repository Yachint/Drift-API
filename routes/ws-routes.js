var router = require("express").Router();

router.ws("/checkUpdate", function (ws, req) {
  let trends = req.app.get("trends");

  ws.on("message", function (msg) {
    const parsedMessage = JSON.parse(msg);
    console.log(
      `User: ${req.socket.remoteAddress} requested hash for ${parsedMessage.woeid}`
    );
    let hash = trends.provideCurrentHash(parsedMessage.woeid);
    const reply = { hash };
    ws.send(JSON.stringify(reply));
  });

  ws.on("close", () => {
    console.log(`User: ${req.socket.remoteAddress} disconnected!`);
  });
});

module.exports = router;
