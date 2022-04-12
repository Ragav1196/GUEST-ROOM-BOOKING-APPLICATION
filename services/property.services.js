import { ObjectId } from "mongodb";
import { mongo as db } from "../mongoDb.js";
import { addProperty, editProperty } from "../helpers/property.helpers.js";
import { commonHelpers } from "../helpers/common.helpers.js";

export const services = {
  async addProperty(req, res) {
    try {
      const isAllFieldFilledErr = addProperty.isAllFieldFilled(req.body);
      if (isAllFieldFilledErr) {
        return commonHelpers.errorResponse(isAllFieldFilledErr, res);
      }

      const isOwnerExist = await commonHelpers.GetOwnerById(
        ObjectId(req.body.ownerId)
      );
      if (!isOwnerExist) {
        return commonHelpers.errorResponse(
          "Owner doesn't exist with the provided Id",
          res
        );
      }

      const isPropertyExistErr = await addProperty.isPropertyExist(
        ObjectId(req.body.ownerId),
        req.body.roomNo,
        req.body.floor,
        req.body.address
      );
      if (isPropertyExistErr) {
        return commonHelpers.errorResponse(isPropertyExistErr, res);
      }

      const result = await db.properties.insertOne({
        ownerId: ObjectId(req.body.ownerId),
        roomNo: req.body.roomNo,
        floor: req.body.floor,
        address: req.body.address,
        minimumPeriod: req.body.minimumPeriod,
        maximumPeriod: req.body.maximumPeriod,
        amtPerDay: req.body.amtPerDay,
      });

      await db.owners.updateOne(
        { _id: ObjectId(req.body.ownerId) },
        { $push: { propertyOwned: result.insertedId } }
      );

      console.log("Property added to database");
      return commonHelpers.successResponse(result, res);
    } catch (err) {
      console.error("Error adding property to database");
      console.error(err);

      return commonHelpers.errorResponse(
        "Cannot add property to database",
        res
      );
    }
  },

  async editProperty(req, res) {
    try {
      const { id } = req.params;

      const isAllFieldFilledErr = addProperty.isAllFieldFilled(req.body);
      if (isAllFieldFilledErr) {
        return commonHelpers.errorResponse(isAllFieldFilledErr, res);
      }

      const isOwnerExist = await commonHelpers.GetOwnerByName(
        req.body.ownerName
      );
      if (!isOwnerExist) {
        return commonHelpers.errorResponse(
          "Owner doesn't exist with the provided name",
          res
        );
      }

      const isPropertyExistWithIdErr = await editProperty.isPropertyExistWithId(
        ObjectId(id)
      );
      if (isPropertyExistWithIdErr) {
        return commonHelpers.errorResponse(isPropertyExistWithIdErr, res);
      }

      const isPropertyExistErr = await addProperty.isPropertyExist(
        req.body.ownerName,
        req.body.roomNo,
        req.body.floor,
        req.body.address,
        req.body.minimumPeriod,
        req.body.maximumPeriod,
        req.body.amtPerDay
      );
      if (isPropertyExistErr) {
        return commonHelpers.errorResponse(isPropertyExistErr, res);
      }

      const result = await db.properties.updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            ownerName: req.body.ownerName,
            roomNo: req.body.roomNo,
            floor: req.body.floor,
            address: req.body.address,
            minimumPeriod: req.body.minimumPeriod,
            maximumPeriod: req.body.maximumPeriod,
            amtPerDay: req.body.amtPerDay,
          },
        }
      );

      console.log("Property updated to database");
      return commonHelpers.successResponse(result, res);
    } catch (err) {
      console.error("Error updating property to database");
      console.error(err);

      return commonHelpers.errorResponse(
        "Cannot update property to database",
        res
      );
    }
  },

  async deleteProperty(req, res) {
    try {
      const { propertyId, ownerId } = req.params;

      const isPropertyExistErr = await editProperty.isPropertyExistWithId(
        ObjectId(propertyId)
      );
      if (isPropertyExistErr) {
        return commonHelpers.errorResponse(isPropertyExistErr, res);
      }

      await db.properties.deleteOne({ _id: ObjectId(propertyId) });
      await db.owners.updateOne(
        { _id: ObjectId(ownerId) },
        { $pull: { propertyOwned: ObjectId(propertyId) } }
      );
      console.log("Property deleted from database");
      return commonHelpers.successResponse(
        "Property deleted from database",
        res
      );
    } catch (err) {
      console.error("Error deleting property from database");
      console.error(err);

      return commonHelpers.errorResponse(
        "Cannot delete property from database",
        res
      );
    }
  },

  async getProperty(req, res) {
    try {
      const result = await db.properties.find().toArray();
      console.log("All Properties fetched successfully ");
      return res.status(200).send({ status: "success", data: result });
    } catch (err) {
      console.error("Error fetching properties from database");
      console.error(err);

      return commonHelpers.errorResponse(
        "Cannot fetch properties from database",
        res
      );
    }
  },
};
