import express from "express";
import { services } from "../services/property.services.js";
import { mongo as db } from "../mongoDb.js";

const route = express.Router();

route.get("/get-property", services.getProperty);

route.post("/add-property", services.addProperty);

route.put("/edit-property/:id", services.editProperty);

route.delete("/delete-property/:propertyId/:ownerId", services.deleteProperty);

route.delete("/delete-all-property/", (req, res) => {
  db.properties.deleteMany();
  res.send({ message: "deleted" });
});

export { route };
