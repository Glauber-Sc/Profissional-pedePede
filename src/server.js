import express, { json } from "express";
import {GNRequest} from "./apis/profissional.js";
import cors from "cors";
import pkg from "pg";

import { authenticate } from "./apis/profissional.js";

import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

import cron from "node-cron"; // Importe o node-cron para agendar tarefas.

const { Client } = pkg;

const app = express();

app.use(json());
app.use(cors()); // Isso permitirá todas as origens

// // Criando um cliente para conexão com o PostgreSQL
// const pgClient = new Client({
//   user: "postgres",
//   host: "localhost",
//   database: "pix",
//   password: "1234",
//   port: 5432, // Porta padrão do PostgreSQL
// });
// pgClient.connect(); // Conectando ao banco de dados

// const pgClientCodeburguer = new Client({
//   user: "postgres",
//   host: "localhost",
//   database: "codeburguer",
//   password: "1234",
//   port: 5432,
// });
// pgClientCodeburguer.connect();



// //Criando um cliente para conexão com o PostgreSQL
// const pgClient = new Client({
//   user: "postgres",
//   host: "postgres.ckymwbkfxdvf.sa-east-1.rds.amazonaws.com",
//   database: "postgres",
//   password: "12341234",
//   port: 5432, // Porta padrão do PostgreSQL
//   ssl: {
//     rejectUnauthorized: false, // Desativa a verificação do certificado
//   },
// });
// pgClient.connect(); // Conectando ao banco de dados


//Criando um cliente para conexão com o PostgreSQL
const pgClientCodeburguer = new Client({
  user: "codeburguer",
  host: "codeburguer.ckymwbkfxdvf.sa-east-1.rds.amazonaws.com",
  database: "codeburguer",
  password: "12341234",
  port: 5432, // Porta padrão do PostgreSQL
  ssl: {
    rejectUnauthorized: false, // Desativa a verificação do certificado
  },
});
pgClientCodeburguer.connect(); // Conectando ao banco de dados



app.set("view engine", "ejs");
app.set("views", "src/views");

const reqGNAlready = GNRequest({
  clientID: process.env.GN_CLIENT_ID,
  clientSecret: process.env.GN_CLIENT_SECRET,
});



app.post("/pix", async (req, res) => {
  try {
    const { nome, valor, finalPrice, deliveryTax } = req.body; //Certifique-se de que a propriedade 'valor' está no corpo da requisição
    console.log("AAAAAAAAA", req.body);


    //const reqGN = await reqGNAlready;
    const endpoint = `${process.env.GN_ENDPOINT}/v2/cob`;

    const reqGN = await GNRequest()

    const dataCob = {
      calendario: {
        expiracao: 3600,
      },
      devedor: {
        cpf: "12345678909",
        nome: nome,
      },
      valor: {
        original: valor,
      },
      chave: "f64cf28a-bc46-48c0-b7a8-ef66597707b7",
      solicitacaoPagador: "Informe o número ou identificador do pedido.",
    };
    const cobResponse = await reqGN.post("/v2/cob", dataCob);

    const qrcodeResponse = await reqGN.get(
      `/v2/loc/${cobResponse.data.loc.id}/qrcode`
    );

    // Calcula a data e hora de expiração
    const expiracaoTimestamp = new Date(
      Date.now() + dataCob.calendario.expiracao * 1000
    );

    const query = `
      INSERT INTO transactions (txid, nome, valor, qrcode, expiracao)
      VALUES ($1, $2, $3, $4, $5);`;

    const values = [
      cobResponse.data.txid,
      nome,
      valor,
      qrcodeResponse.data.qrcode,
      expiracaoTimestamp,
    ];

    await pgClientCodeburguer.query(query, values);

    res.json({
      txid: cobResponse.data.txid,
      qrcodeImage: qrcodeResponse.data.imagemQrcode,
      qrcode: qrcodeResponse.data.qrcode,
      valor: (finalPrice + deliveryTax).toFixed(2), // Passa o valor total formatado para o frontend
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno no servidor");
  }
});

app.get("/pix", async (req, res) => {
  try {
    const { data } = req.query; // Obtém a data da consulta de parâmetro de consulta
    console.log("Data recebida:", data); // Adicione este log

    // Verifica se a data foi fornecida
    if (!data) {
      return res.status(400).json({ error: "A data é obrigatória" });
    }

    // Converte a data para o formato "yyyy-MM-dd"
    const formattedDate = format(new Date(data), "yyyy-MM-dd");
    console.log("Data formatada:", formattedDate); // Adicione este log

    // Aqui você define o fuso horário do Brasil (Belém, Pará)
    const brasilTimeZone = "America/Belem";

    // Converte a data local para a hora do Brasil
    const zonedDate = utcToZonedTime(new Date(formattedDate), brasilTimeZone);

    // Formate a data e hora no fuso horário do Brasil
    const formattedDateTime = format(zonedDate, "yyyy-MM-dd HH:mm:ss", {
      timeZone: brasilTimeZone,
    });

    console.log("Data e hora formatadas:", formattedDateTime); // Adicione este log

    // Faça uma consulta SQL para buscar as transações com base na data de criação (data_registro)
    const query = `
      SELECT id, txid, nome, valor, qrcode, expiracao
      FROM transactions
      WHERE DATE(data_registro) = $1;
    `;
    const { rows } = await pgClientCodeburguer.query(query, [formattedDate]);
    console.log("Registros encontrados:", rows); // Adicione este log

    res.json(rows); // Retorna as transações encontradas como uma resposta JSON
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno no servidor");
  }
});




app.post("/webhook(/pix)?", async (req, res) => {
  console.log(req.body);
  res.send("200");
});



// app.post('/webhook(/pix)?', async (req, res) => {
//   try {
//     const { pix } = req.body;

//     // Verifique se há notificações no campo "pix"
//     if (pix && pix.length > 0) {
//       for (const notification of pix) {
//         const { txid } = notification;
//         console.log("Webhook received txid:", txid); // Registre o txid recebido

//         // Verifique se o txid existe na tabela 'transactions'
//         const checkQuery = "SELECT txid FROM transactions WHERE txid = $1";
//         const { rows } = await pgClientCodeburguer.query(checkQuery, [txid]);
//         console.log("Webhook received rows:", rows); // Registre o txid recebido

//         if (rows.length > 0) {
//           // Se o txid existe na tabela 'transactions', atualize o 'status_payment' para 'true' na tabela 'orders'
//           const updateQuery = `
//             UPDATE orders
//             SET status_payment = true
//             WHERE txid = $1; 
//             `;

//           await pgClientCodeburguer.query(updateQuery, [txid]);

//           console.log(`Status atualizado para 'true' para txid: ${txid}`);
//         } else {
//           console.error(`txid não encontrado na tabela "transactions".`);
//         }
//       }
//     }

//     res.status(200).end();
//   } catch (error) {
//     console.error(error);
//     res.status(500).end();
//   }
// });


//  WHERE txid = $1;

app.post('/webhook(/pix)?', async (req, res) => {
  try {
    // Atualize o status_payment em todos os registros da tabela orders para true
    const updateQuery = `
      UPDATE orders
      SET status_payment = true;
    `;

    await pgClientCodeburguer.query(updateQuery);

    console.log(`Status atualizado para 'true' em todos os registros da tabela orders.`);

    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});








app.listen(4000, () => {
  console.log("running");
});
