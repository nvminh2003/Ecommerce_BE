const Order = require("../models/OrderProductModel");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailService");

// const createOrder = (newOrder) => {
//     return new Promise(async (resolve, reject) => {
//         // console.log("newOrder", newOrder);
//         const {
//             orderItems,
//             paymentMethod,
//             itemsPrice,
//             shippingPrice,
//             totalPrice,
//             fullName,
//             address,
//             city,
//             phone,
//             user,
//             isPaid,
//             paidAt,
//             email,
//         } = newOrder;
//         try {
//             // console.log("orderItems", orderItems);
//             const promises = orderItems.map(async (order) => {
//                 const productData = await Product.findOneAndUpdate(
//                     {
//                         _id: order.product,
//                         countInStock: { $gte: order.amount },
//                     },
//                     {
//                         $inc: {
//                             countInStock: -order.amount,
//                             selled: +order.amount,
//                         },
//                     },
//                     { new: true }
//                 );
//                 console.log("productData: ", productData);
//                 if (productData) {
//                     const createdOrder = await Order.create({
//                         orderItems,
//                         shippingAddress: {
//                             fullName,
//                             address,
//                             city,
//                             phone,
//                         },
//                         paymentMethod,
//                         itemsPrice,
//                         shippingPrice,
//                         totalPrice,
//                         user: user,
//                         isPaid,
//                         paidAt,
//                     });
//                     if (createdOrder) {
//                         // await EmailService.sendEmailCreateOrder(email, orderItems);
//                         return {
//                             status: "OK",
//                             message: "success",
//                             // data: createdOrder,
//                         };
//                     }
//                 } else {
//                     return {
//                         status: "ERR",
//                         message: "Error creating order",
//                         id: order.product,
//                     };
//                 }
//             });
//             const results = await Promise.all(promises);
//             const newData = results && results.filter((item) => item.id);
//             if (newData.length) {
//                 resolve({
//                     status: "OK",
//                     message: `San pham voi id ${newData.join(
//                         ","
//                     )} khong du hang`,
//                 });
//             }
//             resolve({
//                 status: "OK",
//                 message: "Create Order Success",
//             });
//             console.log("results: ", results);
//         } catch (e) {
//             console.log("e", e);
//             reject(e);
//         }
//     });
// };

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const {
            orderItems,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            fullName,
            address,
            city,
            phone,
            user,
            isPaid,
            paidAt,
            email,
        } = newOrder;

        try {
            // Xử lý từng sản phẩm trong orderItems
            for (const order of orderItems) {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }, // Kiểm tra tồn kho
                    },
                    {
                        $inc: {
                            countInStock: -order.amount, // Giảm số lượng tồn kho
                            selled: +order.amount, // Tăng số lượng đã bán
                        },
                    },
                    { new: true }
                );
                if (!productData) {
                    // Nếu sản phẩm không đủ hàng, trả lỗi
                    return resolve({
                        status: "ERR",
                        message: `Sản phẩm với ID ${order.product} không đủ hàng.`,
                    });
                }
            }

            // Tạo đơn hàng chỉ 1 lần với toàn bộ sản phẩm trong orderItems
            const createdOrder = await Order.create({
                orderItems, // Tất cả sản phẩm được lưu trong một mảng
                shippingAddress: {
                    fullName,
                    address,
                    city,
                    phone,
                },
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                user,
                isPaid,
                paidAt,
            });
            if (createdOrder) {
                // Gửi email xác nhận nếu cần
                await EmailService.sendEmailCreateOrder(email, orderItems);
                resolve({
                    status: "OK",
                    message: "Tạo đơn hàng thành công!",
                    data: createdOrder,
                });
            } else {
                resolve({
                    status: "ERR",
                    message: "Không thể tạo đơn hàng.",
                });
            }
        } catch (e) {
            console.log("Error:", e);
            reject(e);
        }
    });
};

const getAllOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id,
            }).sort({ createdAt: -1, updatedAt: -1 });
            if (order === null) {
                resolve({
                    status: "ERR",
                    message: "The order is not defined",
                });
            }

            resolve({
                status: "OK",
                message: "SUCESSS",
                data: order,
            });
        } catch (e) {
            // console.log('e', e)
            reject(e);
        }
    });
};

const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id,
            });
            if (order === null) {
                resolve({
                    status: "ERR",
                    message: "The order is not defined",
                });
            }

            resolve({
                status: "OK",
                message: "SUCESSS",
                data: order,
            });
        } catch (e) {
            // console.log('e', e)
            reject(e);
        }
    });
};

const cancelOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = [];
            const promises = data.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        selled: { $gte: order.amount },
                    },
                    {
                        $inc: {
                            countInStock: +order.amount,
                            selled: -order.amount,
                        },
                    },
                    { new: true }
                );
                if (productData) {
                    order = await Order.findByIdAndDelete(id);
                    if (order === null) {
                        resolve({
                            status: "ERR",
                            message: "The order is not defined",
                        });
                    }
                } else {
                    return {
                        status: "OK",
                        message: "ERR",
                        id: order.product,
                    };
                }
            });
            const results = await Promise.all(promises);
            const newData = results && results[0] && results[0].id;

            if (newData) {
                resolve({
                    status: "ERR",
                    message: `San pham voi id: ${newData} khong ton tai`,
                });
            }
            resolve({
                status: "OK",
                message: "success",
                data: order,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find().sort({
                createdAt: -1,
                updatedAt: -1,
            });
            resolve({
                status: "OK",
                message: "Success",
                data: allOrder,
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder,
};
