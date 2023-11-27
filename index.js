import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { SerialPort } from "serialport";

const app = express();
let pathPort = "";
/*SerialPort.list()
    .then((ports) => {
        ports.forEach(function (port) {
            pathPort = port.path;
        });
        return pathPort;
    })
    .then((res) => {
        console.log(res);
        const port = new SerialPort({
            path: pathPort,
            baudRate: 9600,
        });
    });*/

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, function () {
    console.log("Aplicación escuchando en el puerto 3000!");
});
