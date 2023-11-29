import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

const app = express();

app.use(express.json());
app.use(bodyParser.json());

let pathPort = "";
var grado = 0;
var interval;
var port = "";

SerialPort.list()
    .then((ports) => {
        ports.forEach(function (port) {
            pathPort = port.path;
        });
        return pathPort;
    })
    .then((res) => {
        console.log(res);
        port = new SerialPort({
            path: res,
            baudRate: 115200,
        });

        return port;
    })
    .then((port) => {
        interval = setInterval(() => {
            port.write(`${grado}\n`),
                (err) => {
                    if (err) {
                        console.log(err.message);
                    }
                };
        }, 500);

        const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));
        parser.on("data", function (data) {
            console.log(data);
        });
    });

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/serial", function (req, res) {
    const dato = req.body.dato;
    grado = dato;
    let analog = parseInt((dato * 1023) / 270);
    clearInterval(interval);
    interval = setInterval(() => {
        port.write(`${analog}\n`),
            (err) => {
                if (err) {
                    console.log(err.message);
                }
            };
    }, 500);
    res.sendStatus(200);
});

app.listen(3000, function () {
    console.log("Aplicación escuchando en el puerto 3000!");
});
