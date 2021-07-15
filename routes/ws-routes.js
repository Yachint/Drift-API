var router = require("express").Router();

router.ws("/checkUpdate", function (ws, req) {
  let trends = req.app.get("trends");

  ws.on("message", function (msg) {
    console.log(`New user connected! : ${req.socket.remoteAddress}`);
    const parsedMessage = JSON.parse(msg);
    let hash = trends.provideCurrentHash(parsedMessage.woeid);
    const reply = { hash };
    ws.send(JSON.stringify(reply));
  });

  ws.on("close", () => {
    console.log(`Client disconnected! ${req.socket.remoteAddress}`);
  });
});

module.exports = router;
