import express from "express";
import { services } from "../services/customers.services.js";

const route = express.Router();

route.post("/sign-up", services.customerSignup);

route.post("/login", services.customerLogin);

export { route };
