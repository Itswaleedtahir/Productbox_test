const { Users } = require("../models");
const moment = require("moment");
const otpGenerator = require('otp-generator')

module.exports = {
  userCreated: async (req, res) => {
    try {
      const { name, phonenumber } = req.body;
      if (!name || !phonenumber) {
        throw { status: 400, message: "Fields cannot be empty" };
      }
      const user = await Users.findOne({
        where: { phone_number: phonenumber },
      });
      if (user) {
        throw {
          status: 401,
          message: "User with this phone number already exists",
        };
      }
      const User = await Users.create({
        name: name,
        phone_number: phonenumber,
      });
      res.status(200).json({ message: "User Created", User });
    } catch (err) {
      res.status(err.status || 500).json(err.message || err);
    }
  },
  generateOtp: async (req, res) => {
    try {
      const { phonenumber } = req.body;
      if (!phonenumber) {
        throw { status: 400, message: "Phone number is empty" };
      }
      const userFound = await Users.findOne({
        where: { phone_number: phonenumber },
      });
      if (!userFound) {
        res
          .status(403)
          .json({ message: "User with this phone number does not exists" });
      }
      const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
      const userOtpGenerated = await userFound.update({
        otp: otp,
        otp_expiration_date: moment().unix() + 300,
      });
      res.status(200).json({
        otp: userOtpGenerated.otp,
        userid:userFound.id,
      });
    } catch (err) {
      res.status(err.status || 500).json(err.message || err);
    }
  },
  verifyOtp: async (req, res) => {
    try {
      const { user_id } = req.params;
      const { otp } = req.query;
      if (!otp) {
        throw { status: 400, message: "Otp is required" };
      }
      const User = await Users.findOne({ where: { id: user_id } });
      if (!User) {
        throw { status: 404, message: "user not found" };
      }
      if (moment().unix() > User.otp_expiration_date || User.otp != otp) {
        res.status(401).json({ message: "otp expired or wrong" });
      } else {
        res.status(200).json(User);
      }
    } catch (err) {
      console.log(err);
      res.status(err.status || 500).json(err.message || err);
    }
  },
};
