import express from "express";
import OpenAI from "openai";

const app = express();

app.use(express.json());

const VERIFY_TOKEN = "casamia_verify_token";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

const SUPABASE_URL =
process.env.SUPABASE_URL;

const SUPABASE_ANON_KEY =
process.env.SUPABASE_ANON_KEY;

app.get("/", (req, res) => {
res.send("CASAMIA WhatsApp AI Bot attivo");
});

app.get("/webhook", (req, res) => {

const mode = req.query["hub.mode"];
const token = req.query["hub.verify_token"];
const challenge = req.query["hub.challenge"];

if(mode && token === VERIFY_TOKEN){
return res.status(200).send(challenge);
}

res.sendStatus(403);

});

app.post("/webhook", async (req, res) => {

try{

console.log("Webhook ricevuto");

const body = req.body;

const message =
body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

if(!message){
return res.sendStatus(200);
}

const phone = message.from;

const text =
message.text?.body || "";

console.log(phone, text);

await fetch(
`${SUPABASE_URL}/rest/v1/leads`,
{
method:"POST",
headers:{
apikey:SUPABASE_ANON_KEY,
Authorization:`Bearer ${SUPABASE_ANON_KEY}`,
"Content-Type":"application/json",
Prefer:"return=minimal"
},
body:JSON.stringify({
phone:phone,
message:text,
source:"whatsapp"
})
}
);

const completion =
await openai.chat.completions.create({
model:"gpt-4o-mini",
messages:[
{
role:"system",
content:`
Sei l'assistente AI di CASA MIA.

CASA MIA collega clienti,
imprese e artigiani in tutta Italia.

Se il cliente cerca lavori:
- raccogli città
- tipo lavoro
- urgenza
- telefono

Se è impresa:
- raccogli settore
- zona operativa
- esperienza

Tono:
professionale ma umano.
`
},
{
role:"user",
content:text
}
]
});

const aiReply =
completion.choices[0].message.content;

console.log(aiReply);

return res.sendStatus(200);

}catch(err){

console.log(err);

return res.sendStatus(500);

}

});

app.listen(3000, () => {
console.log("Server attivo sulla porta 3000");
});
