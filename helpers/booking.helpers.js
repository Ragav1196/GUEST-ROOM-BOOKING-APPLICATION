import { mongo as db } from "../mongoDb.js";

export const bookProperty = {
  isAllFieldFilled({ customerId, propertyId, rentStartingDate, vacatingDate }) {
    let error;

    if (!customerId) {
      error = "customer Id must be provided";
    }

    if (!propertyId) {
      error = "property Id must be provided";
    }

    if (!rentStartingDate) {
      error = "Rent starting date must be provided";
    }

    if (!vacatingDate) {
      error = "Vacating date must be provided";
    }

    return error;
  },

  async isTimeSlotBooked(rentStartingDate) {
    let error;

    const isTimeSlotBooked = await db.properties.findOne({
      bookingDetail: {
        $elemMatch: {
          $and: [
            { rentedDate: { $lte: rentStartingDate } },
            { vacatingDate: { $gte: rentStartingDate } },
          ],
        },
      },
    });

    if (isTimeSlotBooked) {
      error = "Selected time slot is not available";
    }
    return error;
  },

  isWithinPropertyTimePeriode(rentStartingDate, vacatingDate, propertyDetails) {
    let error;

    const numberofDaysStay =
      (vacatingDate.getTime() - rentStartingDate.getTime()) /
      (1000 * 60 * 60 * 24);

    if (numberofDaysStay < propertyDetails.minimumPeriod) {
      error = `minimum of ${propertyDetails.minimumPeriod} ${
        propertyDetails.minimumPeriod === 1 ? "day" : "days"
      } is mandatory`;
    }

    if (numberofDaysStay > propertyDetails.maximumPeriod) {
      error = `Maximum of ${propertyDetails.maximumPeriod} days is only allowed to stay`;
    }

    return error;
  },

  hasCutomerAlreadyBooked(customerDetails) {
    let error;

    if (customerDetails?.bookingDetail) {
      error = "Customer Has already booked a room";
    }
    return error;
  },
};
