import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../config/swagger.json";
import clientSwaggerDocument from "../config/client_swagger.json";

export const handleAPIDocs = (router: Router) => {
  const options = {
    customCssUrl: '/public/custom.css',
    customJs: '/public/custom.js'
  };
  router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
  router.use("/client-api-docs", swaggerUi.serve, swaggerUi.setup(clientSwaggerDocument, options));
}