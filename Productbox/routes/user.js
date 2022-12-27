const express = require("express");
const router = express.Router();
const controller = require("../controllers/user");

router.post("/created", controller.userCreated);
router.post("/generateOtp", controller.generateOtp);
router.get("/:userId/verifyOTP", controller.verifyOtp);

module.exports = router;
