const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
    try {
        const {
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            fullName,
            address,
            city,
            phone,
            orderItems,
        } = req.body;
        console.log("req.body.payment ", req.body);
        if (
            !paymentMethod ||
            !itemsPrice ||
            shippingPrice === undefined ||
            shippingPrice === null ||
            !totalPrice ||
            !fullName ||
            !address ||
            !city ||
            !phone ||
            !orderItems.length
        ) {
            return res.status(400).json({
                status: "ERR",
                message: "The input is required create order.",
            });
        }

        const product = await OrderService.createOrder(req.body);
        return res.status(200).json(product);
    } catch (e) {
        return res.status(500).json({
            message: "Order product failed",
            error: e.message,
        });
    }
};

const getAllOrderDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required",
            });
        }
        const response = await OrderService.getAllOrderDetails(userId);
        return res.status(200).json(response);
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e,
        });
    }
};

const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(200).json({
                status: "ERR",
                message: "The orderId is required",
                data: null,
            });
        }
        const response = await OrderService.getOrderDetails(orderId);
        console.log("Order Details Response:", response);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(404).json({
            message: e,
        });
    }
};

const cancelOrderDetails = async (req, res) => {
    try {
        const data = req.body.orderItems;
        const orderId = req.body.orderId;
        if (!orderId) {
            return res.status(200).json({
                status: "ERR",
                message: "The orderId is required",
            });
        }
        const response = await OrderService.cancelOrderDetails(orderId, data);
        return res.status(200).json(response);
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e,
        });
    }
};

const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder();
        return res.status(200).json(data);
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e,
        });
    }
};

module.exports = {
    createOrder,
    getAllOrderDetails,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder,
};
