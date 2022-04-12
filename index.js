import express from "express";
import cors from "cors";
import { mongo } from "./mongoDb.js";
import { route as ownersRoute } from "./routes/owners.routes.js";
import { route as customerRoute } from "./routes/customers.routes.js";
import { route as propertyRoute } from "./routes/property.routes.js";
import { route as bookingRoute } from "./routes/booking.routes.js";

(async () => {
  try {
    const app = express();
    const PORT = process.env.PORT || 9000;

    app.use(cors());
    app.use(express.json());

    await mongo.connect();

    app.get("/", (req, res) => {
      res.send(
        `<h1 style="text-align: center;">GUEST ROOM BOOKING APPLICATION<h1>`
      );
    });

    app.use("/owner", ownersRoute);
    app.use("/customer", customerRoute);
    app.use("/property", propertyRoute);
    app.use("/booking", bookingRoute);

    app.listen(PORT, () => console.log("Server running at", 9000));
  } catch (err) {
    console.log("Error starting app");
    console.log(err);
  }
})();
