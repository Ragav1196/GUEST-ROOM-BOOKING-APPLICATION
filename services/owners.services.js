import { mongo as db } from "../mongoDb.js";
import { ownerSignup, ownerLogin } from "../helpers/owners.helpers.js";
import { commonHelpers } from "../helpers/common.helpers.js";
import bcrypt from "bcrypt";

export const services = {
  async ownerSignup(req, res) {
    try {
      const isAllFieldFilledErr = ownerSignup.isAllFieldFilled(req.body);
      if (isAllFieldFilledErr) {
        return commonHelpers.errorResponse(isAllFieldFilledErr, res);
      }

      const isPasswordValidErr = ownerSignup.isPasswordValid(req.body.password);
      if (isPasswordValidErr) {
        return commonHelpers.errorResponse(isPasswordValidErr, res);
      }

      const isEmailValidErr = ownerSignup.isEmailValid(req.body.email);
      if (isEmailValidErr) {
        return commonHelpers.errorResponse(isEmailValidErr, res);
      }

      const isOwnerExistErr = await ownerSignup.isOwnerExist(
        req.body.name,
        req.body.email
      );
      if (isOwnerExistErr) {
        return commonHelpers.errorResponse(isOwnerExistErr, res);
      }

      const hashedPassword = await ownerSignup.GenerateHash(req.body.password);

      const result = await db.owners.insertOne({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        mobile: req.body.mobile,
      });

      console.log("Owner signed up successfully");
      return commonHelpers.successResponse(result, res);
    } catch (err) {
      console.error("Error signing up owner");
      console.error(err);

      return commonHelpers.errorResponse("Cannot sign up the owner", res);
    }
  },

  async ownerLogin(req, res) {
    try {
      const isAllFieldFilledErr = ownerLogin.isAllFieldFilled(
        req.body.email,
        req.body.password
      );
      if (isAllFieldFilledErr) {
        return commonHelpers.errorResponse(isAllFieldFilledErr, res);
      }

      const isOwnerExist = await commonHelpers.GetOwnerByEmail(req.body.email);
      if (!isOwnerExist) {
        return commonHelpers.errorResponse("Invalid credentials", res, 401);
      }

      const ownerDetails = isOwnerExist;

      const isPasswordMatch = await bcrypt.compare(
        req.body.password,
        ownerDetails.password
      );

      if (!isPasswordMatch) {
        return commonHelpers.errorResponse("Invalid credentials", res, 401);
      }

      const token = ownerLogin.generateToken(req.body.email);
      return res
        .status(200)
        .send({ status: "Success", message: "Successfull login", token });
    } catch (err) {
      console.error("Error logging In the owner");
      console.error(err);
      return commonHelpers.errorResponse("Cannot log In the owner");
    }
  },
};
