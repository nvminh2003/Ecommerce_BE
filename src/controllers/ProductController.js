const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
    try {
        const {
            name,
            image,
            type,
            price,
            countInStock,
            rating,
            description,
            discount,
        } = req.body;
        // console.log("req.body", req.body);
        if (!name || !image || !type || !price || !countInStock) {
            return res
                .status(200)
                .json({ status: "ERR", message: "The input is required." });
        }

        const product = await ProductService.createProduct(req.body);
        return res.status(200).json(product);
    } catch (e) {
        return res.status(404).json({
            message: "Product creation failed",
            error: e.message,
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const data = req.body;
        if (!productId) {
            return res.status(200).json({
                status: "ERR",
                message: "The productId is required",
            });
        }
        // console.log("productId", productId);
        const user = await ProductService.updateProduct(productId, data);

        return res.status(200).json(user);
    } catch (e) {
        return res.status(404).json({
            message: "! User updated failed !",
            error: e.message,
        });
    }
};

const getDetailsProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        if (!productId) {
            return res.status(200).json({
                status: "ERR",
                message: "The productId is required",
            });
        }
        const product = await ProductService.getDetailsProduct(productId);

        return res.status(200).json(product);
    } catch (e) {
        return res.status(404).json({
            message: "! User creation failed 'SOS'!",
            error: e.message,
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(200).json({
                status: "ERR",
                message: "The productId is required",
            });
        }
        const user = await ProductService.deleteProduct(productId);

        return res.status(200).json(user);
    } catch (e) {
        return res.status(404).json({
            message: "! Delete Product failed !",
            error: e.message,
        });
    }
};

// const deleteMany = async (req, res) => {
//     console.log("reqqqqqq", req.body);
//     try {
//         const ids = req.body.ids;

//         if (!ids) {
//             return res.status(200).json({
//                 status: "ERR",
//                 message: "The ids is required",
//             });
//         }
//         const user = await ProductService.deleteManyProduct(ids);

//         return res.status(200).json(user);
//     } catch (e) {
//         return res.status(404).json({
//             message: "! Delete Product failed !",
//             error: e.message,
//         });
//     }
// };

const deleteMany = async (req, res) => {
    console.log("Request Body:", req.body); // Log toàn bộ req.body
    try {
        const ids = req.body.ids;

        // Kiểm tra nếu ids không tồn tại hoặc không phải là mảng
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(200).json({
                status: "ERR",
                message:
                    "The ids is required and should be an array with at least one element",
            });
        }

        console.log("IDs to delete:", ids); // Log mảng ids

        const result = await ProductService.deleteManyProduct(ids);

        return res.status(200).json(result);
    } catch (e) {
        return res.status(404).json({
            message: "! Delete Product failed !",
            error: e.message,
        });
    }
};

const getAllProduct = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query;
        // console.log("req.query", req.query);
        const product = await ProductService.getAllProduct(
            Number(limit) || null,
            Number(page) || 0,
            sort,
            filter
        );
        return res.status(200).json(product);
    } catch (e) {
        return res.status(404).json({
            error: e.message,
        });
    }
};

const getAllTypes = async (req, res) => {
    try {
        const product = await ProductService.getAllTypes();
        return res.status(200).json(product);
    } catch (e) {
        return res.status(404).json({
            error: e.message,
        });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteMany,
    getAllTypes,
};
