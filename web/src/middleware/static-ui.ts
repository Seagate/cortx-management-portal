import { Router } from "express";
import express from "express";

require("dotenv").config({ path: __dirname + "/../.env" })
const csmUIPath = process.env.CSM_UI_PATH;
console.log("using ui path  " + csmUIPath);
export const handleCSMUI = (router: Router) =>
    router.use('/', express.static(csmUIPath+"", { index: 'index.html' }));
