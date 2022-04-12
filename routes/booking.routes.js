import express from "express";
import { services } from "../services/booking.services.js";

const route = express.Router();

route.post("/", services.booking);

export { route };
