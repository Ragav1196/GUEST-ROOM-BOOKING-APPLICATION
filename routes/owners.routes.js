import express from "express";
import { services } from "../services/owners.services.js";

const route = express.Router();

route.post("/sign-up", services.ownerSignup);

route.post("/login", services.ownerLogin);

export { route };
