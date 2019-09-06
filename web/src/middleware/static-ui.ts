import { Router } from "express";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const key = process.env.CSM_UI_PATH;
console.log("using ui path  " + key);
export const handleCSMUI = (router: Router) =>
    router.use('/', express.static(key+"", { index: 'index.html' }));
