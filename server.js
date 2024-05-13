import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import env from "dotenv";

const app = express();
const port = 3000;

env.config();

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new pg.Client({
    connectionString: process.env.PG_URL,
});
db.connect();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    const result = await db.query(
        "SELECT * FROM listaaniversario ORDER BY datanasc ASC"
    );
    const data = result.rows;
    const datas = data.map((el) => el.datanasc);

    const datasOfc = datas.map((data) =>
        new Intl.DateTimeFormat("pt-BR").format(data)
    );
    console.log(datasOfc);
    res.render("index.ejs", { aniversariantes: data, datasOfc: datasOfc });
});

app.post("/novo", (req, res) => {
    db.query("INSERT INTO listaaniversario (nome, datanasc) VALUES ($1, $2)", [
        req.body.nome,
        req.body.datanasc,
    ]);

    res.redirect("/");
});

app.post("/deletar", (req, res) => {
    db.query("DELETE FROM listaaniversario WHERE id = $1", [
        req.body.idDeletar,
    ]);

    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server on port ${port}`);
});
