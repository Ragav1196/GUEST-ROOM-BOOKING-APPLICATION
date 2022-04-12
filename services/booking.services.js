import { ObjectId } from "mongodb";
import { mongo as db } from "../mongoDb.js";
import { bookProperty } from "../helpers/booking.helpers.js";
import { commonHelpers } from "../helpers/common.helpers.js";

export const services = {
  async booking(req, res) {
    try {
      const isAllFieldFilledErr = bookProperty.isAllFieldFilled(req.body);
      if (isAllFieldFilledErr) {
        return commonHelpers.errorResponse(isAllFieldFilledErr, res);
      }

      const iscustomerExist = await commonHelpers.getcustomerById(
        ObjectId(req.body.customerId)
      );
      if (!iscustomerExist) {
        return commonHelpers.errorResponse(
          "Customer doesn't exist with the provided Id",
          res
        );
      }

      const isPropertyExist = await commonHelpers.getPropertyById(
        ObjectId(req.body.propertyId)
      );
      if (!isPropertyExist) {
        return commonHelpers.errorResponse(
          "Property dosn't exist with the provided Id",
          res
        );
      }

      const propertyDetails = isPropertyExist;
      const customerDetails = iscustomerExist;
      const rentStartingDate = new Date(
        `${req.body.rentStartingDate} 12:00:00`
      );
      const vacatingDate = new Date(`${req.body.vacatingDate} 12:00:00`);

      const isTimeSlotBookedErr = await bookProperty.isTimeSlotBooked(
        rentStartingDate
      );
      if (isTimeSlotBookedErr) {
        return commonHelpers.errorResponse(isTimeSlotBookedErr, res);
      }

      const isWithinPropertyTimePeriodeErr =
        bookProperty.isWithinPropertyTimePeriode(
          rentStartingDate,
          vacatingDate,
          propertyDetails
        );
      if (isWithinPropertyTimePeriodeErr) {
        return commonHelpers.errorResponse(isWithinPropertyTimePeriodeErr, res);
      }

      const hasCutomerAlreadyBookedErr =
        bookProperty.hasCutomerAlreadyBooked(customerDetails);
      if (hasCutomerAlreadyBookedErr) {
        return commonHelpers.errorResponse(hasCutomerAlreadyBookedErr, res);
      }

      await db.customers.updateOne(
        { _id: ObjectId(req.body.customerId) },
        {
          $set: {
            bookingDetail: {
              propertyId: ObjectId(req.body.propertyId),
              rentedDate: rentStartingDate,
              vacatingDate,
            },
          },
        }
      );

      await db.properties.updateOne(
        { _id: ObjectId(req.body.propertyId) },
        {
          $push: {
            bookingDetail: {
              customerId: ObjectId(req.body.customerId),
              rentedDate: rentStartingDate,
              vacatingDate,
            },
          },
        }
      );

      console.log("Booking is succesfully made");
      return commonHelpers.successResponse("Booking is succesfully made", res);
    } catch (err) {
      console.log("Error in booking a room for the customer");
      console.log(err);

      return commonHelpers.errorResponse(
        "Cannot book a room for the customer",
        res
      );
    }
  },
};
