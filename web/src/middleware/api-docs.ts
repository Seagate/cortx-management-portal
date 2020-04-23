import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../config/swagger.json";
import clientSwaggerDocument from "../config/client_swagger.json";

export const handleAPIDocs = (router: Router) => {
  router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  router.use("/client-api-docs", swaggerUi.serve, swaggerUi.setup(clientSwaggerDocument));
}