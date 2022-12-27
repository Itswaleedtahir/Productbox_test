const { Users } = require("../models");
const moment = require("moment");

module.exports = {
  userCreated: async (req, res) => {
    try {
      const { name, phoneNumber } = req.body;
      if (!name || !phoneNumber) {
        throw { status: 400, message: "Fields cannot be empty" };
      }
      const ifUser = await Users.findOne({
        where: { phone_number: phoneNumber },
      });
      if (ifUser) {
        throw {
          status: 401,
          message: "User with this phone number already exists",
        };
      }
      const User = await Users.create({
        name: name,
        phone_number: phoneNumber,
      });
      res.status(200).json({ message: "User Created", User });
    } catch (err) {
      res.status(err.status || 500).json(err.message || err);
    }
  },
  generateOtp: async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        throw { status: 400, message: "Phone number is empty" };
      }
      const userFound = await Users.findOne({
        where: { phone_number: phoneNumber },
      });
      if (!userFound) {
        res
          .status(403)
          .json({ message: "User with this phone number does not exists" });
      }
      const otp = Math.floor(Math.random() * 10000);
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
      const { userId } = req.params;
      const { otp } = req.query;
      if (!otp) {
        throw { status: 400, message: "Otp is required" };
      }
      const User = await Users.findOne({ where: { id: userId } });
      console.log(User)
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
