const axios = require ('axios');
const {makeid} = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router()
const pino = require("pino");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    Browsers,
    makeCacheableSignalKeyStore
} = require("@whiskeysockets/baileys");

function removeFile(FilePath){
    if(!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true })
 };
router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
        async function getPaire() {
        const {
            state,
            saveCreds
        } = await useMultiFileAuthState('./temp/'+id)
     try {
            let session = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({level: "fatal"}).child({level: "fatal"})),
                },
                printQRInTerminal: false,
                logger: pino({level: "fatal"}).child({level: "fatal"}),
                browser: Browsers.macOS("Desktop"),
             });
             if(!session.authState.creds.registered) {
                await delay(1500);
                        num = num.replace(/[^0-9]/g,'');
                            const code = await session.requestPairingCode(num)
                 if(!res.headersSent){
                 await res.send({code});
                     }
                 }
            session.ev.on('creds.update', saveCreds)
            session.ev.on("connection.update", async (s) => {
                const {
                    connection,
                    lastDisconnect
                } = s;
  if (connection == "open") {
                await delay(5000);
    const data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`, 'utf8');
    const dd = '199,719,97,' + data;
    const output = await axios.post('http://paste.c-net.org/', new URLSearchParams({ data: dd }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
//  const cc = await Buffer.from(fs.readFileSync(__dirname + `/temp/${id}/creds.json`), 'utf8');
    const ccc = 'Midsoune@' + output.data.split('/')[3].trim();
    await delay(800);
    await session.sendMessage(session.user.id, { text: data });     await delay(800);
    await session.sendMessage(session.user.id, { text: ccc });     await delay(800);

     await delay(1000);
     await session.ws.close();
        return await removeFile('./temp/'+id);
            } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    getPaire();
                }
            });
        } catch (err) {
            console.log("service restated");
            await removeFile('./temp/'+id);
         if(!res.headersSent){
            await res.send({code:"Service Unavailable"});
         }
        }
    }
    return await getPaire()
});
module.exports = router
