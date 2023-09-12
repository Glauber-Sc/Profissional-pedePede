// import express, { json } from "express";
// import GNRequest from "./apis/profissional.js";
// import cors from "cors";
// import pkg from "pg";

// const { Client } = pkg;

// const app = express();

// app.use(json());
// app.use(cors()); // Isso permitirá todas as origens

// // Criando um cliente para conexão com o PostgreSQL
// const pgClient = new Client({
//   user: "postgres",
//   host: "localhost",
//   database: "pix",
//   password: "1234",
//   port: 5432, // Porta padrão do PostgreSQL
// });
// pgClient.connect(); // Conectando ao banco de dados

// app.set("view engine", "ejs");
// app.set("views", "src/views");

// const reqGNAlready = GNRequest({
//   clientID: process.env.GN_CLIENT_ID,
//   clientSecret: process.env.GN_CLIENT_SECRET,
// });


// app.post("/pix", async (req, res) => {
//   try {
//     const { nome, valor, finalPrice, deliveryTax } = req.body; // Certifique-se de que a propriedade 'valor' está no corpo da requisição
//     console.log(req.body);
//     const reqGN = await reqGNAlready;

//     const endpoint = `${process.env.GN_ENDPOINT}/v2/cob`;

//     const dataCob = {
//       calendario: {
//         expiracao: 3600,
//       },
//       devedor: {
//         cpf: "12345678909",
//         nome: nome,
//       },
//       valor: {
//         original: valor,
//       },
//       chave: "f64cf28a-bc46-48c0-b7a8-ef66597707b7",
//       solicitacaoPagador: "Informe o número ou identificador do pedido.",
//     };
//     const cobResponse = await reqGN.post("/v2/cob", dataCob);

//     const qrcodeResponse = await reqGN.get(
//       `/v2/loc/${cobResponse.data.loc.id}/qrcode`
//     );

//     // Calcula a data e hora de expiração
//     const expiracaoTimestamp = new Date(
//       Date.now() + dataCob.calendario.expiracao * 1000
//     );

//     const query = `
//       INSERT INTO transactions (txid, nome, valor, qrcode, expiracao)
//       VALUES ($1, $2, $3, $4, $5);`;

//     const values = [
//       cobResponse.data.txid,
//       nome,
//       valor,
//       qrcodeResponse.data.qrcode,
//       expiracaoTimestamp,
//     ];

//     await pgClient.query(query, values);

//     res.json({
//       qrcodeImage: qrcodeResponse.data.imagemQrcode,
//       qrcode: qrcodeResponse.data.qrcode,
//       valor: (finalPrice + deliveryTax).toFixed(2), // Passa o valor total formatado para o frontend
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Erro interno no servidor");
//   }
// });

// app.get("/cobrancas", async (req, res) => {
//   const reqGN = await reqGNAlready;

//   const now = new Date();
//   const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Uma hora atrás
//   const formattedNow = now.toISOString();
//   const formattedOneDayAgo = oneDayAgo.toISOString();

//   const cobResponse = await reqGN.get(
//     `/v2/cob?inicio=${formattedOneDayAgo}&fim=${formattedNow}`
//   );

//   // Gravando os dados no banco de dados PostgreSQL
//   try {
//     // Gravando os dados no banco de dados PostgreSQL
//     for (const cobData of cobResponse.data.cobs) {
//       const query = `
//         INSERT INTO cobs (
//           criacao,
//           expiracao,
//           txid,
//           revisao,
//           loc_id,
//           loc_location,
//           loc_tipoCob,
//           loc_criacao,
//           status,
//           devedor_cpf,
//           devedor_nome,
//           valor_original,
//           chave,
//           solicitacaoPagador
//         )
//         VALUES (
//           $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
//         );`;

//       const values = [
//         cobData.calendario.criacao,
//         cobData.calendario.expiracao,
//         cobData.txid,
//         cobData.revisao,
//         cobData.loc.id,
//         cobData.loc.location,
//         cobData.loc.tipoCob,
//         cobData.loc.criacao,
//         cobData.status,
//         cobData.devedor.cpf,
//         cobData.devedor.nome,
//         cobData.valor.original,
//         cobData.chave,
//         cobData.solicitacaoPagador,
//       ];

//       await pgClient.query(query, values);
//     }
//     res.send(cobResponse.data);
//    // res.send("Dados gravados no banco de dados.");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Erro interno no servidor");
//   }

// //  res.send(cobResponse.data);

//   // const jsonFormatted = JSON.stringify(cobResponse.data, null, 2);
//   // console.log(jsonFormatted);
// });

// // app.post("/webhook(/pix)?", async (req, res) => {
// //   console.log(req.body)
// //   res.send('200');
// // });

// app.listen(4000, () => {
//   console.log("running");
// });

















// import express, { json } from "express";
// import GNRequest from "./apis/profissional.js";
// import cors from "cors";
// import pkg from "pg";

// const { Client } = pkg;

// const app = express();

// app.use(json());
// app.use(cors()); // Isso permitirá todas as origens

// // Criando um cliente para conexão com o PostgreSQL
// const pgClient = new Client({
//   user: "postgres",
//   host: "localhost",
//   database: "pix",
//   password: "1234",
//   port: 5432, // Porta padrão do PostgreSQL
// });
// pgClient.connect(); // Conectando ao banco de dados

// app.set("view engine", "ejs");
// app.set("views", "src/views");

// const reqGNAlready = GNRequest({
//   clientID: process.env.GN_CLIENT_ID,
//   clientSecret: process.env.GN_CLIENT_SECRET,
// });


// app.post("/pix", async (req, res) => {
//   try {
//     const { nome, valor, finalPrice, deliveryTax } = req.body; // Certifique-se de que a propriedade 'valor' está no corpo da requisição
//     console.log(req.body);
//     const reqGN = await reqGNAlready;

//     const endpoint = `${process.env.GN_ENDPOINT}/v2/cob`;

//     const dataCob = {
//       calendario: {
//         expiracao: 3600,
//       },
//       devedor: {
//         cpf: "12345678909",
//         nome: nome,
//       },
//       valor: {
//         original: valor,
//       },
//       chave: "f64cf28a-bc46-48c0-b7a8-ef66597707b7",
//       solicitacaoPagador: "Informe o número ou identificador do pedido.",
//     };
//     const cobResponse = await reqGN.post("/v2/cob", dataCob);

//     const qrcodeResponse = await reqGN.get(
//       `/v2/loc/${cobResponse.data.loc.id}/qrcode`
//     );

//     // Calcula a data e hora de expiração
//     const expiracaoTimestamp = new Date(
//       Date.now() + dataCob.calendario.expiracao * 1000
//     );

//     const query = `
//       INSERT INTO transactions (txid, nome, valor, qrcode, expiracao)
//       VALUES ($1, $2, $3, $4, $5);`;

//     const values = [
//       cobResponse.data.txid,
//       nome,
//       valor,
//       qrcodeResponse.data.qrcode,
//       expiracaoTimestamp,
//     ];

//     await pgClient.query(query, values);

//     res.json({
//       qrcodeImage: qrcodeResponse.data.imagemQrcode,
//       qrcode: qrcodeResponse.data.qrcode,
//       valor: (finalPrice + deliveryTax).toFixed(2), // Passa o valor total formatado para o frontend
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Erro interno no servidor");
//   }
// });


// app.get("/cobrancas", async (req, res) => {
//   const reqGN = await reqGNAlready;


//   const inicio = req.query.inicio; // Obtém o valor do parâmetro de consulta "inicio"
//   const fim = req.query.fim; // Obtém o valor do parâmetro de consulta "fim"

//   const cobResponse = await reqGN.get(`/v2/cob?inicio=${inicio}&fim=${fim}`);

//   // Gravando os dados no banco de dados PostgreSQL
//   try {
//     // Gravando os dados no banco de dados PostgreSQL
//     for (const cobData of cobResponse.data.cobs) {
//       const query = `
//         INSERT INTO cobs (
//           criacao,
//           expiracao,
//           txid,
//           revisao,
//           loc_id,
//           loc_location,
//           loc_tipoCob,
//           loc_criacao,
//           status,
//           devedor_cpf,
//           devedor_nome,
//           valor_original,
//           chave,
//           solicitacaoPagador
//         )
//         VALUES (
//           $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
//         );`;

//       const values = [
//         cobData.calendario.criacao,
//         cobData.calendario.expiracao,
//         cobData.txid,
//         cobData.revisao,
//         cobData.loc.id,
//         cobData.loc.location,
//         cobData.loc.tipoCob,
//         cobData.loc.criacao,
//         cobData.status,
//         cobData.devedor.cpf,
//         cobData.devedor.nome,
//         cobData.valor.original,
//         cobData.chave,
//         cobData.solicitacaoPagador,
//       ];

//       await pgClient.query(query, values);
//     }
//     res.send(cobResponse.data);
//    // res.send("Dados gravados no banco de dados.");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Erro interno no servidor");
//   }

// //  res.send(cobResponse.data);

//   // const jsonFormatted = JSON.stringify(cobResponse.data, null, 2);
//   // console.log(jsonFormatted);
// });

// // app.post("/webhook(/pix)?", async (req, res) => {
// //   console.log(req.body)
// //   res.send('200');
// // });

// app.listen(4000, () => {
//   console.log("running");
// });












import express, { json } from "express";
import GNRequest from "./apis/profissional.js";
import cors from "cors";
import pkg from "pg";


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

//Criando um cliente para conexão com o PostgreSQL
const pgClient = new Client({
  user: "postgres",
  host: "pix.ckymwbkfxdvf.sa-east-1.rds.amazonaws.com",
  database: "demo",
  password: "12341234",
  port: 5432, // Porta padrão do PostgreSQL
});
pgClient.connect(); // Conectando ao banco de dados

app.set("view engine", "ejs");
app.set("views", "src/views");

const reqGNAlready = GNRequest({
  clientID: process.env.GN_CLIENT_ID,
  clientSecret: process.env.GN_CLIENT_SECRET,
});


app.post("/pix", async (req, res) => {
  try {
    const { nome, valor, finalPrice, deliveryTax } = req.body; // Certifique-se de que a propriedade 'valor' está no corpo da requisição
    console.log(req.body);
    const reqGN = await reqGNAlready;

    const endpoint = `${process.env.GN_ENDPOINT}/v2/cob`;

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

    await pgClient.query(query, values);

    res.json({
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
    const formattedDateTime = format(zonedDate, "yyyy-MM-dd HH:mm:ss", { timeZone: brasilTimeZone });
    
    console.log("Data e hora formatadas:", formattedDateTime); // Adicione este log

    // Faça uma consulta SQL para buscar as transações com base na data de criação (data_registro)
    const query = `
      SELECT id, txid, nome, valor, qrcode, expiracao
      FROM transactions
      WHERE DATE(data_registro) = $1;
    `;
    const { rows } = await pgClient.query(query, [formattedDate]);
    console.log("Registros encontrados:", rows); // Adicione este log

    res.json(rows); // Retorna as transações encontradas como uma resposta JSON
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno no servidor");
  }
});




// app.post("/webhook/pix", async (request, response) => {
//   if (request.socket.authorized) {
//     try {
//       const { txid } = request.body; // Supondo que o webhook envie o ID da transação (txid)
      
//       console.log(`Webhook recebido para txid: ${txid}`);

//       // Realize a verificação do pagamento e atualização do status no banco de dados
//       const updateQuery = `
//         UPDATE transactions
//         SET status = 'pago'
//         WHERE txid = $1;
//       `;
//       await pgClient.query(updateQuery, [txid]);

//       console.log(`Status atualizado para 'pago' para txid: ${txid}`);

//       response.status(200).end();
//     } catch (error) {
//       console.error(error);
//       response.status(500).end();
//     }
//   } else {
//     response.status(401).end();
//   }
// });





 
app.get("/cobrancas", async (req, res) => {
  const reqGN = await reqGNAlready;


  const inicio = req.query.inicio; // Obtém o valor do parâmetro de consulta "inicio"
  const fim = req.query.fim; // Obtém o valor do parâmetro de consulta "fim"

  const cobResponse = await reqGN.get(`/v2/cob?inicio=${inicio}&fim=${fim}`);

  // Gravando os dados no banco de dados PostgreSQL
  try {
    // Gravando os dados no banco de dados PostgreSQL
    for (const cobData of cobResponse.data.cobs) {
      const query = `
        INSERT INTO cobs (
          criacao,
          expiracao,
          txid,
          revisao,
          loc_id,
          loc_location,
          loc_tipoCob,
          loc_criacao,
          status,
          devedor_cpf,
          devedor_nome,
          valor_original,
          chave,
          solicitacaoPagador
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
        );`;

      const values = [
        cobData.calendario.criacao,
        cobData.calendario.expiracao,
        cobData.txid,
        cobData.revisao,
        cobData.loc.id,
        cobData.loc.location,
        cobData.loc.tipoCob,
        cobData.loc.criacao,
        cobData.status,
        cobData.devedor.cpf,
        cobData.devedor.nome,
        cobData.valor.original,
        cobData.chave,
        cobData.solicitacaoPagador,
      ];

      await pgClient.query(query, values);
    }
    res.send(cobResponse.data);
   // res.send("Dados gravados no banco de dados.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno no servidor");
  }

//  res.send(cobResponse.data);

  // const jsonFormatted = JSON.stringify(cobResponse.data, null, 2);
  // console.log(jsonFormatted);
});



// app.post("/webhook(/pix)?", async (req, res) => {
//   console.log(req.body)
//   res.send('200');
// });


// Função para verificar o status da transação
async function verificarStatus(txid) {
  const reqGN = await reqGNAlready;
  const endpoint = `${process.env.GN_ENDPOINT}/v2/cob`;

  try {
    const response = await reqGN.get(`${endpoint}/${txid}`);

    if (response.data.status === 'pago') {
      // Atualize o status no seu banco de dados para "pago"
      const updateQuery = `
        UPDATE transactions
        SET status = 'pago'
        WHERE txid = $1;
      `;
      await pgClient.query(updateQuery, [txid]);
      
      // Envia uma notificação ao cliente (opcional)
      console.log(`A transação com txid ${txid} foi paga.`);
    } else {
      console.log(`A transação com txid ${txid} ainda não foi paga.`);
    }
  } catch (error) {
    console.error(`Erro ao verificar status da transação com txid ${txid}:`, error);
  }
}


async function buscarTxidsDoBancoDeDados() {
  try {
    const query = `
      SELECT txid
      FROM transactions
      WHERE status = 'pendente'; -- Ou qualquer critério que você use para determinar quais transações verificar
    `;
    
    const { rows } = await pgClient.query(query);
    return rows.map(row => row.txid);
  } catch (error) {
    console.error('Erro ao buscar txids do banco de dados:', error);
    return [];
  }
}


// Chame essa função periodicamente para verificar o status
const tempoVerificacao = 60 * 1000; // 1 minuto em milissegundos

setInterval(async () => {
  const txids = await buscarTxidsDoBancoDeDados();

  for (const txid of txids) {
    verificarStatus(txid);
  }
}, tempoVerificacao);



// Rota para lidar com notificações do webhook
app.put('/webhook(/pix)?', async (req, res) => {
  try {
    const { txid, status } = req.body; // Suponha que a notificação contenha o txid e o status

    // Verifique se o status é "pago"
    if (status === 'pago') {
      // Atualize o status no seu banco de dados para "pago"
      const updateQuery = `
        UPDATE transactions
        SET status = 'pago'
        WHERE txid = $1;
      `;
      await pgClient.query(updateQuery, [txid]);

      console.log(`Status atualizado para 'pago' para txid: ${txid}`);
    }

    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});



app.listen(4000, () => {
  console.log("running");
});


