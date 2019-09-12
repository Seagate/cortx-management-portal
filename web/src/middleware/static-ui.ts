import { Router } from "express";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const csmUIPath = process.env.CSM_UI_PATH;
console.log("using ui path  " + csmUIPath);
export const handleCSMUI = (router: Router) =>
    router.use('/', express.static(csmUIPath+"", { index: 'index.html' }));
