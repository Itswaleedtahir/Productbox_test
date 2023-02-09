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
      // const user = await Users.findOne({
      //   where: { phone_number: phonenumber },
      // });
      // if (user) {
      //   throw {
      //     status: 401,
      //     message: "User with this phone number already exists",
      //   };
      // }
      const User = await Users.create({
        where:{phone_number:phonenumber},
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



// migration 
// "use strict";

// const table = "total_data";

// module.exports = {
//   up: async function (queryInterface, Sequelize) {
//     await queryInterface.createTable(table, {
//       the_key: {
//         type: Sequelize.INTEGER,
//         allowNull: true,
//       },
//       timestamp:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       reklamer:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       adresseid:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       adgangsadresseid:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       Firmanavn:{
//         type: Sequelize.BLOB,
//         allowNull:true,
//         get(){
//           return this.getDataValue('Firmanavn')?.toString('utf8');
//         }
//       },
//       cvr_nr:{
//         type: Sequelize.INTEGER,
//         allowNull:true
//       },
//       antalPenheder:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       ansatte:{
//         type: Sequelize.INTEGER,
//         allowNull:true
//       },
//       ansatte_interval:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       ansatte_date:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       vejkode:{
//         type: Sequelize.INTEGER,
//         allowNull:true
//       },
//       vejnavn:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       husnr:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       bogstav:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       etage:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       door:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       postnr:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       postnrnavn:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       kommunenavn:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       kommunekode:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       region:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       telefonnummer:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       email:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       virksomhedsform:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       virksomhedsform_type:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       virksomhedsformkode:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       branchekode_primær:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       branchebetegnelse_primær:{
//         type: Sequelize.BLOB,
//         allowNull:true,
//         get(){
//           return this.getDataValue('branchebetegnelse_primær')?.toString('utf8');
//         }
//       },
//       branche_group:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       branchekode1:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       branchebetegnelse1:{
//         type: Sequelize.BLOB,
//         allowNull:true,
//         get(){
//           return this.getDataValue('branchebetegnelse1')?.toString('utf8');
//         }
//       },
//       branchekode2:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       branchebetegnelse2:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       branchekode3:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       branchebetegnelse3:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       last_update:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       x:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       y:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       x:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       longitude:{
//         type: Sequelize.INTEGER,
//         allowNull:true
//       },
//       latitude:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       sammenstatus:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       stiftelsesDato:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       hjemmeside:{
//         type: Sequelize.BLOB,
//         allowNull:true,
//         get(){
//           return this.getDataValue('hjemmeside')?.toString('utf8');
//         }
//       },
//       yearly_report_start:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       yearly_report_end:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       yearly_result:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       scrapped:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       right_the_key:{
//         type: Sequelize.INTEGER,
//         allowNull:true
//       },
//       right_cvr_nr:{
//         type: Sequelize.INTEGER,
//         allowNull:true
//       },
//       cvr_navn:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_nr:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_navn:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_ansatte:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_ansatte_interval:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_ansatte_date:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_adresseid:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_vejkode:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_vejnavn:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_husnr:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_bogstav:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_etage:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_door:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_postnr:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_postnrnavn:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_kommunenavn:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_kommunekode:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_region:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_sammensatStatus:{
//         type: Sequelize.STRING,
//         allowNull:true
//       },
//       p_last_update:{
//         type: Sequelize.STRING,
//         allowNull:true
//       }    
//     }).then(()=>queryInterface.addIndex('total_data',['Firmanavn']))
//     .then(()=>queryInterface.addIndex('total_data',['virksomhedsform']))
//     .then(()=>queryInterface.addIndex('total_data',['branchebetegnelse_primær']))
//     .then(()=>queryInterface.addIndex('total_data',['ansatte']))
//     .then(()=>queryInterface.addIndex('total_data',['antalPenheder']))
//     .then(()=>queryInterface.addIndex('total_data',['yearly_result']))
//     .then(()=>queryInterface.addIndex('total_data',['p_kommunenavn']))
//     .then(()=>queryInterface.addIndex('total_data',['p_region']))
//   },
//   down: async function (queryInterface) {
//     await queryInterface.dropTable(table);
//   },
// };
