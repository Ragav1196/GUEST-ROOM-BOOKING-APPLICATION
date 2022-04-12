import { mongo as db } from "../mongoDb.js";

export const commonHelpers = {
  errorResponse(message, res, status) {
    res.status(status || 400).send({ status: "Failed", message });
  },

  successResponse(message, res, status) {
    res.status(status || 200).send({ status: "success", message });
  },

  async GetOwnerById(id) {
    try {
      const data = await db.owners.findOne({ _id: id });
      return data;
    } catch (err) {
      console.error("Error fetching owner name");
      console.error(err);
    }
  },

  async GetcustomerByName(name) {
    try {
      const data = await db.customers.findOne({ name });
      return data;
    } catch (err) {
      console.error("Error fetching customer by name");
      console.error(err);
    }
  },

  async GetcustomerByEmail(email) {
    try {
      const data = await db.customers.findOne({ email });
      return data;
    } catch (err) {
      console.error("Error fetching customer by E-mail");
      console.error(err);
    }
  },

  async getcustomerById(id) {
    try {
      const data = await db.customers.findOne({ _id: id });
      return data;
    } catch (err) {
      console.error("Error fetching customer by Id");
      console.error(err);
    }
  },

  async getPropertyById(id) {
    try {
      const data = await db.properties.findOne({ _id: id });
      return data;
    } catch (err) {
      console.log("Error fetching property by Id");
    }
  },
};
