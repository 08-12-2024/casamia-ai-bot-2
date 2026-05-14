import express from "express";

const app = express();

app.use(express.json());

const VERIFY_TOKEN = "casamia_verify_token";

app.get("/", (req, res) => {
  res.send("CASAMIA WhatsApp AI Bot attivo");
});

app.get("/webhook", (req, res) => {

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Server attivo sulla porta 3000");
});
