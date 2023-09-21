import axios from "axios";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { Agent } from "https";
import express, { json } from "express";
import cors from "cors";

// Convert the URL of the current module file to a filesystem path
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

// Load environment variables from .env file using dotenv

// import dotenv from 'dotenv';
// dotenv.config({ path: resolve(currentDirPath, '../../.env') });

import dotenv from "dotenv";
dotenv.config({ path: resolve(currentDirPath, "../../.env") });

const certPath = resolve(currentDirPath, `../../certs/${process.env.GN_CERT}`);
const cert = readFileSync(certPath);

const agent = new Agent({
  pfx: cert,
  passphrase: "",
});

const credentials = Buffer.from(
  `${process.env.GN_CLIENT_ID}:${process.env.GN_CLIENT_SECRET}`
).toString("base64");

const authenticate = () => {
  console.log("TOKEN");
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

export { GNRequest, authenticate };
