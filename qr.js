const axios = require('axios');
const {makeid} = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const path = require('path');
const fs = require('fs');
let router = express.Router()
const pino = require("pino");
const {
	default: makeWASocket,
	useMultiFileAuthState,
	jidNormalizedUser,
	Browsers,
	delay,
	makeInMemoryStore,
} = require("@whiskeysockets/baileys");

function removeFile(FilePath) {
	if (!fs.existsSync(FilePath)) return false;
	fs.rmSync(FilePath, {
		recursive: true,
		force: true
	})
};
const {
	readFile
} = require("node:fs/promises")
router.get('/', async (req, res) => {
	const id = makeid();
	async function Getqr() {
		const {
			state,
			saveCreds
		} = await useMultiFileAuthState('./temp/' + id)
		try {
			let session = makeWASocket({
				auth: state,
				printQRInTerminal: false,
				logger: pino({
					level: "silent"
				}),
				browser: Browsers.macOS("Desktop"),
			});

			session.ev.on('creds.update', saveCreds)
			session.ev.on("connection.update", async (s) => {
				const {
					connection,
					lastDisconnect,
					qr
				} = s;
				if (qr) await res.end(await QRCode.toBuffer(qr));
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
					return await removeFile("temp/" + id);
				} else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
					await delay(10000);
					Getqr();
				}
			});
		} catch (err) {
			if (!res.headersSent) {
				await res.json({
					code: "Service Unavailable"
				});
			}
			console.log(err);
			await removeFile("temp/" + id);
		}
	}
	return await Getqr()
	//return //'qr.png', { root: "./" });
});
module.exports = router
