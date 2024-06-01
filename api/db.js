import mysql from "mysql"

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "vitorISA2022$",
    database: "crud"
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
    } else {
        console.log("Conexão estabelecida com sucesso!");
    }
});