const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");
const {
    authMiddleware,
    authUserMiddleware,
} = require("../middleware/authMiddleware");

router.post("/create-payment/:id", orderController.createOrder);
router.get(
    "/get-all-order/:id",
    authUserMiddleware,
    orderController.getAllOrderDetails
);
router.get("/get-details-order/:id", orderController.getDetailsOrder);

router.delete(
    "/cancel-order/:id",
    authUserMiddleware,
    orderController.cancelOrderDetails
);
router.get("/get-all-order", authMiddleware, orderController.getAllOrder);

module.exports = router;
