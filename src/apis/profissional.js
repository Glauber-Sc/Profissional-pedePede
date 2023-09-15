import axios from "axios";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from 'url';
import { Agent } from "https";
import express, { json } from "express";
import cors from "cors";

import dotenv from 'dotenv';

// Convert the URL of the current module file to a filesystem path
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

// Load environment variables from .env file using dotenv

dotenv.config({ path: resolve(currentDirPath, '../../.env') });

const certPath = resolve(currentDirPath, `../../certs/${process.env.GN_CERT}`);
const cert = readFileSync(certPath);

const agent = new Agent({
  pfx: cert,
  passphrase: "",
});

const authenticate = ({ clientID, clientSecret }) => {
  const credentials = Buffer.from(
    `${clientID}:${clientSecret}`
  ).toString("base64");

  return axios({
    method: "POST",
    url: `${process.env.GN_ENDPOINT}/oauth/token`,
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    httpsAgent: agent,
    data: {
      grant_type: "client_credentials",
    },
  });
};

const GNRequest = async (credentials) => {
  const authResponse = await authenticate(credentials);
  //const accessToken = authResponse.data?.access_token;
  const accessToken = authResponse.data && authResponse.data.access_token;

  return axios.create({
    baseURL: process.env.GN_ENDPOINT,
    httpsAgent: agent,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};

export default GNRequest;














// import axios from "axios";
// import { readFileSync } from "fs";
// import { resolve, dirname } from "path";
// import { fileURLToPath } from "url";
// import { Agent } from "https";
// import express, { json } from "express";
// import cors from "cors";

// // Convert the URL of the current module file to a filesystem path
// const currentFilePath = fileURLToPath(import.meta.url);
// const currentDirPath = dirname(currentFilePath);

// // Load environment variables from .env file using dotenv
// import dotenv from "dotenv";
// dotenv.config({ path: resolve(currentDirPath, "../../.env") });

// const certPath = resolve(currentDirPath, `../../certs/${process.env.GN_CERT}`);
// const cert = readFileSync(certPath);

// const agent = new Agent({
//   pfx: cert,
//   passphrase: "",
// });

// let accessToken = null;

// const authenticate = ({ clientID, clientSecret }) => {
//   const credentials = Buffer.from(`${clientID}:${clientSecret}`).toString(
//     "base64"
//   );

//   return axios({
//     method: "POST",
//     url: `${process.env.GN_ENDPOINT}/oauth/token`,
//     headers: {
//       Authorization: `Basic ${credentials}`,
//       "Content-Type": "application/json",
//     },
//     httpsAgent: agent,
//     data: {
//       grant_type: "client_credentials",
//     },
//   });
// };

// const renewToken = async (credentials) => {
//   try {
//     const authResponse = await authenticate(credentials);
//     accessToken = authResponse.data?.access_token;

//     // Adicione um log para mostrar no console quando o token for renovado
//     console.log("Token renovado com sucesso:", new Date());
//   } catch (error) {
//     console.error("Erro ao renovar o token:", error);
//   }
// };

// // Renove o token a cada 1 minuto (60 segundos)
// setInterval(() => {
//   renewToken({ clientID: "seuClientID", clientSecret: "seuClientSecret" });
// }, 60000);

// const GNRequest = async (credentials) => {
//   if (!accessToken) {
//     await renewToken(credentials);
//   }

//   return axios.create({
//     baseURL: process.env.GN_ENDPOINT,
//     httpsAgent: agent,
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//   });
// };

// export default GNRequest;









// import axios from "axios";
// import { readFileSync } from "fs";
// import { resolve, dirname } from "path";
// import { fileURLToPath } from "url";
// import { Agent } from "https";
// import express, { json } from "express";
// import cors from "cors";

// // Convert the URL of the current module file to a filesystem path
// const currentFilePath = fileURLToPath(import.meta.url);
// const currentDirPath = dirname(currentFilePath);

// // Load environment variables from .env file using dotenv
// import dotenv from "dotenv";
// dotenv.config({ path: resolve(currentDirPath, "../../.env") });

// const certPath = resolve(currentDirPath, `../../certs/${process.env.GN_CERT}`);
// const cert = readFileSync(certPath);

// const agent = new Agent({
//   pfx: cert,
//   passphrase: "",
// });

// let accessToken = null;
// let tokenExpirationTime = null;

// const authenticate = ({ clientID, clientSecret }) => {
//   const credentials = Buffer.from(`${clientID}:${clientSecret}`).toString(
//     "base64"
//   );

//   return axios({
//     method: "POST",
//     url: `${process.env.GN_ENDPOINT}/oauth/token`,
//     headers: {
//       Authorization: `Basic ${credentials}`,
//       "Content-Type": "application/json",
//     },
//     httpsAgent: agent,
//     data: {
//       grant_type: "client_credentials",
//     },
//   });
// };

// const renewToken = async (credentials) => {
//   try {
//     const authResponse = await authenticate(credentials);
//     accessToken = authResponse.data?.access_token;

//     // Defina o tempo de expiração do token (1 hora a partir de agora)
//     tokenExpirationTime = new Date(Date.now() + 3600 * 1000); // 3600 segundos * 1000 ms/segundo

//     // Adicione um log para mostrar no console quando o token for renovado
//     console.log("Token renovado com sucesso:", new Date(), "Tempo de expiração do token:", tokenExpirationTime );
//     console.log("Token:", accessToken)
//   } catch (error) {
//     console.error("Erro ao renovar o token:", error);
//   }
// };

// // Renove o token se estiver prestes a expirar ou não existir
// const ensureAccessToken = async (credentials) => {
//   if (!accessToken || new Date() >= tokenExpirationTime) {
//     await renewToken(credentials);
//   }
// };

// const GNRequest = async (credentials) => {
//   // Certifique-se de que o token esteja atualizado antes de fazer a solicitação
//   await ensureAccessToken(credentials);

//   return axios.create({
//     baseURL: process.env.GN_ENDPOINT,
//     httpsAgent: agent,
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//   });
// };

// export default GNRequest;









// import axios from "axios";
// import { readFileSync } from "fs";
// import { resolve, dirname } from "path";
// import { fileURLToPath } from 'url';
// import { Agent } from "https";
// import express, { json } from "express";
// import cors from "cors";

// // Convert the URL of the current module file to a filesystem path
// const currentFilePath = fileURLToPath(import.meta.url);
// const currentDirPath = dirname(currentFilePath);

// // Load environment variables from .env file using dotenv
// import dotenv from 'dotenv';
// dotenv.config({ path: resolve(currentDirPath, '../../.env') });

// const certPath = resolve(currentDirPath, `../../certs/${process.env.GN_CERT}`);
// const cert = readFileSync(certPath);

// const agent = new Agent({
//   pfx: cert,
//   passphrase: "",
// });

// let accessToken = null;
// let refreshToken = null;

// const authenticate = ({ clientID, clientSecret }) => {
//   const credentials = Buffer.from(
//     `${clientID}:${clientSecret}`
//   ).toString("base64");

//   return axios({
//     method: "POST",
//     url: `${process.env.GN_ENDPOINT}/oauth/token`,
//     headers: {
//       Authorization: `Basic ${credentials}`,
//       "Content-Type": "application/json",
//     },
//     httpsAgent: agent,
//     data: {
//       grant_type: "client_credentials",
//     },
//   })
//   .then((response) => {
//     accessToken = response.data?.access_token;
//     refreshToken = response.data?.refresh_token; // Armazena o refresh token
//     console.log("Token obtido com sucesso:", new Date());
//   })
//   .catch((error) => {
//     console.error("Erro ao obter o token:", error);
//   });
// };

// const renewToken = async () => {
//   try {
//     if (!refreshToken) {
//       throw new Error('Token de atualização não disponível.');
//     }

//     const authResponse = await axios({
//       method: "POST",
//       url: `${process.env.GN_ENDPOINT}/oauth/token`,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       httpsAgent: agent,
//       data: {
//         grant_type: "refresh_token",
//         refresh_token: refreshToken, // Inclui o refresh token
//       },
//     });

//     accessToken = authResponse.data?.access_token;
//     console.log("Token renovado com sucesso:", new Date());
//   } catch (error) {
//     console.error("Erro ao renovar o token:", error);
//   }
// };

// // Chame a função de renovação de token assim que o servidor for iniciado
// renewToken();

// setInterval(() => {
//   renewToken();
// }, 1800000); // Renove o token a cada 30 minutos

// const GNRequest = async (credentials) => {
//   // Verifique se o token está disponível
//   if (!accessToken) {
//     await authenticate(credentials);
//   }

//   return axios.create({
//     baseURL: process.env.GN_ENDPOINT,
//     httpsAgent: agent,
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//   });
// };

// export default GNRequest;








// import axios from "axios";
// import { readFileSync } from "fs";
// import { resolve, dirname } from "path";
// import { fileURLToPath } from 'url';
// import { Agent } from "https";

// // Convert the URL of the current module file to a filesystem path
// const currentFilePath = fileURLToPath(import.meta.url);
// const currentDirPath = dirname(currentFilePath);

// // Load environment variables from .env file using dotenv
// import dotenv from 'dotenv';
// dotenv.config({ path: resolve(currentDirPath, '../../.env') });

// const certPath = resolve(currentDirPath, `../../certs/${process.env.GN_CERT}`);
// const cert = readFileSync(certPath);

// const agent = new Agent({
//   pfx: cert,
//   passphrase: "",
// });

// let accessToken = null;
// let refreshToken = null;

// const authenticate = async ({ clientID, clientSecret }) => {
//   const credentials = Buffer.from(
//     `${clientID}:${clientSecret}`
//   ).toString("base64");

//   try {
//     const response = await axios({
//       method: "POST",
//       url: `${process.env.GN_ENDPOINT}/oauth/token`,
//       headers: {
//         Authorization: `Basic ${credentials}`,
//         "Content-Type": "application/json",
//       },
//       httpsAgent: agent,
//       data: {
//         grant_type: "client_credentials",
//       },
//     });

//     accessToken = response.data?.access_token;
//     refreshToken = response.data?.refresh_token;
//     console.log("Token obtido com sucesso:", new Date());
//   } catch (error) {
//     console.error("Erro ao obter o token:", error);
//   }
// };

// const renewToken = async () => {
//   if (!refreshToken) {
//     console.error('Token de atualização não disponível.');
//     return;
//   }

//   try {
//     const response = await axios({
//       method: "POST",
//       url: `${process.env.GN_ENDPOINT}/oauth/token`,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       httpsAgent: agent,
//       data: {
//         grant_type: "refresh_token",
//         refresh_token: refreshToken,
//       },
//     });

//     accessToken = response.data?.access_token;
//     console.log("Token renovado com sucesso:", new Date());
//   } catch (error) {
//     console.error("Erro ao renovar o token:", error);
//   }
// };

// // Chame a função de autenticação assim que o servidor for iniciado
// authenticate({ clientID: process.env.YOUR_CLIENT_ID, clientSecret: process.env.YOUR_CLIENT_SECRET });

// // Chame a função de renovação de token em intervalos regulares (por exemplo, a cada 30 minutos)
// setInterval(renewToken, 30 * 60 * 1000);

// const GNRequest = (credentials) => {
//   // Aqui, você pode criar uma instância axios com as configurações padrão e o token atual
//   return axios.create({
//     baseURL: process.env.GN_ENDPOINT,
//     httpsAgent: agent,
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//   });
// };

// export default GNRequest;
