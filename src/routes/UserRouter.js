const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.post("/sign-up", UserController.createUser);
router.post("/sign-in", UserController.loginUser);
router.post("/sign-in-admin", UserController.loginAdmin);

router.put("/update-user/:id", UserController.updateUser);
router.delete("/delete-user/:id", UserController.deleteUser);
router.get("/getAll", UserController.getAllUser);
router.get("/get-details/:id", UserController.getDetailUser);
router.get("/get-search", UserController.getSearchUser);
router.get("/pagination", UserController.pagination);
// router.post("/refresh-token", UserController.refreshToken);

module.exports = router;
