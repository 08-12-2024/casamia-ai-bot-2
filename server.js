import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("CASAMIA WhatsApp AI Bot attivo");
});

app.listen(3000, () => {
  console.log("Server attivo sulla porta 3000");
});
