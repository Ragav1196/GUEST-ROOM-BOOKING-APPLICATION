import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const ownerSignup = {
  isAllFieldFilled({ name, email, password, mobile }) {
    let error;

    if (!name) {
      error = "Name must be provided";
    } else if (!email) {
      error = "email must be provided";
    } else if (!password) {
      error = "password must be provided";
    } else if (!mobile) {
      error = "mobile must be provided";
    }

    return error;
  },

  isPasswordValid(password) {
    let error;

    if (password.length < 8) {
      error = "Password must be longer";
    }
    if (
      !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#%&]).{8,}$/g.test(password)
    ) {
      error = "Password pattern doesn't match";
    }

    return error;
  },

  isEmailValid(email) {
    let error;

    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      error = "Email pattern doesn't match";
    }

    return error;
  },

  async isOwnerExist(name, email) {
    const ownerName = await commonHelpers.GetOwnerByName(name);
    const ownerEmail = await commonHelpers.GetOwnerByEmail(email);

    let error;

    if (ownerName && ownerEmail) {
      error = "Name and E-mail already exists";
    } else if (ownerName) {
      error = "Name already exists";
    } else if (ownerEmail) {
      error = "Email already exists";
    }

    return error;
  },

  async GenerateHash(password) {
    const NO_OF_ROUNDS = 10;
    const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  },
};

export const ownerLogin = {
  isAllFieldFilled(email, password) {
    let error;

    if (!email) {
      error = "email must be provided";
    } else if (!password) {
      error = "password must be provided";
    }

    return error;
  },

  generateToken(email) {
    const tokenId = email;
    const token = jwt.sign({ id: tokenId }, process.env.SECRET_KEY);
    return token;
  },
};
