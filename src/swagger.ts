import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { Application } from "express";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Spotifew API - MV Project v1",
      version: "1.2.0",
    },
  },
  apis: ["./docs/v1/openapi.yaml"], // chemin du fichier YAML
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  app.get("/api-docs.json", (req, res) => res.json(specs));
  console.log("Swagger disponible sur /api-docs");
};