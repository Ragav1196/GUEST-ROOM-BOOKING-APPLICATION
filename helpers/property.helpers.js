import { mongo as db } from "../mongoDb.js";

export const addProperty = {
  isAllFieldFilled({
    ownerId,
    roomNo,
    floor,
    address,
    minimumPeriod,
    maximumPeriod,
    amtPerDay,
  }) {
    let error;

    if (!ownerId) {
      error = "Owner Id must be provided";
    }
    if (!roomNo) {
      error = "Room No must be provided";
    }
    if (!floor) {
      error = "Floor must be provided";
    }
    if (!address) {
      error = "Address must be provided";
    }
    if (!minimumPeriod) {
      error = "Minimum period must be provided";
    }
    if (!maximumPeriod) {
      error = "Maximum period must be provided";
    }
    if (!amtPerDay) {
      error = "Amount per day must be provided";
    }

    return error;
  },

  async isPropertyExist(ownerId, roomNo, floor, address) {
    try {
      const property = await db.properties.findOne({
        $and: [{ ownerId }, { roomNo }, { floor }, { address }],
      });

      let error;

      if (property) {
        error = "Property already exists";
      }
      return error;
    } catch (err) {
      console.log("Error fetching property details");
      console.log(err);
    }
  },
};

export const editProperty = {
  async isPropertyExistWithId(id) {
    try {
      const property = await db.properties.findOne({ _id: id });

      let error;

      if (!property) {
        error = "Property doesn't exists";
      }
      return error;
    } catch (err) {
      console.log("Error fetching property details");
      console.log(err);
    }
  },
};
