import { mongo as db } from "../mongoDb.js";
import { customerSignup, customerLogin } from "../helpers/customers.helpers.js";
import { commonHelpers } from "../helpers/common.helpers.js";
import bcrypt from "bcrypt";

export const services = {
  async customerSignup(req, res) {
    try {
      const isAllFieldFilledErr = customerSignup.isAllFieldFilled(req.body);
      if (isAllFieldFilledErr) {
        return commonHelpers.errorResponse(isAllFieldFilledErr, res);
      }

      const isPasswordValidErr = customerSignup.isPasswordValid(
        req.body.password
      );
      if (isPasswordValidErr) {
        return commonHelpers.errorResponse(isPasswordValidErr, res);
      }

      const isEmailValidErr = customerSignup.isEmailValid(req.body.email);
      if (isEmailValidErr) {
        return commonHelpers.errorResponse(isEmailValidErr, res);
      }

      const iscustomerExistErr = await customerSignup.iscustomerExist(
        req.body.name,
        req.body.email
      );
      if (iscustomerExistErr) {
        return commonHelpers.errorResponse(iscustomerExistErr, res);
      }

      const hashedPassword = await customerSignup.GenerateHash(
        req.body.password
      );

      const result = await db.customers.insertOne({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        mobile: req.body.mobile,
      });

      console.log("customer added to database");
      return commonHelpers.successResponse(result, res);
    } catch (err) {
      console.error("Error adding customer to database");
      console.error(err);

      return commonHelpers.errorResponse(
        "Cannot add customer to database",
        res
      );
    }
  },

  async customerLogin(req, res) {
    const isAllFieldFilledErr = customerLogin.isAllFieldFilled(
      req.body.email,
      req.body.password
    );
    if (isAllFieldFilledErr) {
      return commonHelpers.errorResponse(isAllFieldFilledErr, res);
    }

    const iscustomerExist = await commonHelpers.GetcustomerByEmail(
      req.body.email
    );
    if (!iscustomerExist) {
      return commonHelpers.errorResponse("Invalid credentials", res, 401);
    }

    const customerDetails = iscustomerExist;

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      customerDetails.password
    );

    if (!isPasswordMatch) {
      return commonHelpers.errorResponse("Invalid credentials", res, 401);
    }

    const token = customerLogin.generateToken(req.body.email);
    return res
      .status(200)
      .send({ status: "Success", message: "Successfull login", token });
  },
};
