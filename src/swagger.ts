import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import fs from "fs";
import path from "path";
import yaml from "yaml";

export const setupSwagger = (app: Application) => {
  const swaggerDocument = yaml.parse(
    fs.readFileSync(path.join(__dirname, "../docs/v1/openapi.yaml"), "utf8")
  );

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get("/api-docs.json", (req, res) => res.json(swaggerDocument));
  console.log("Swagger disponible sur /api-docs");
};