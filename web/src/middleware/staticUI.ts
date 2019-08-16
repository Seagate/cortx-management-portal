import { Router } from "express";
import express from "express";
import dotenv from "dotenv";

dotenv.config();


export const handleCSMUI = (router: Router) =>
    router.use('/', express.static("${CSM_UI_PATH}", { index: 'index.html' }));
