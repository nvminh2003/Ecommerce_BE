const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const {
            name,
            image,
            type,
            price,
            countInStock,
            rating,
            description,
            selled,
            discount,
        } = newProduct;
        try {
            const checkProduct = await Product.findOne({
                name: name,
            });
            if (checkProduct !== null) {
                resolve({
                    status: "OK",
                    message: "The name of product is already",
                });
            }

            // console.log("hash:", hash);
            const newdProduct = await Product.create({
                name,
                image,
                type,
                price,
                countInStock,
                rating,
                description,
                selled,
                discount,
            });
            if (newProduct) {
                resolve({
                    status: "OK",
                    message: "Success",
                    data: newdProduct,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({ _id: id }); //_id
            console.log("checkProduct: ", checkProduct);
            if (checkProduct === null) {
                resolve({
                    status: "OK",
                    message: "The product is not defined",
                });
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, data, {
                new: true,
            });
            resolve({
                status: "OK",
                message: "Updata Product Success",
                data: updatedProduct,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({ _id: id }); //_id
            console.log("checkUser: ", checkProduct);
            if (checkProduct === null) {
                resolve({
                    status: "Error",
                    message: "The Product is not defined",
                });
            }

            await Product.findByIdAndDelete(id);
            resolve({
                status: "OK",
                message: "Delete product successfully",
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteManyProduct = (ids) => {
    console.log("_ids: ", ids);
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids });
            resolve({
                status: "OK",
                message: "Delete product successfully",
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllProduct = (limit, page, sort, filter) => {
    // console.log("sort", sort);
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments();
            let allProduct = [];
            // console.log("filter", filter);
            // Kiểm tra và áp dụng filter
            if (filter) {
                const allProductFilter = await Product.find({
                    [filter[0]]: { $regex: filter[1], $options: "i" },
                })
                    .limit(limit)
                    .skip(page * limit);
                resolve({
                    status: "OK",
                    message: " All product successfully",
                    data: allProductFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit),
                });
            }
            // Kiểm tra và áp dụng sort
            if (sort) {
                // console.log("oko");
                const objectSort = {};
                objectSort[sort[1]] = sort[0];
                // console.log("objectSort", objectSort);
                const allProductSort = await Product.find()
                    .limit(limit)
                    .skip(page * limit)
                    .sort(objectSort);
                resolve({
                    status: "OK",
                    message: " All product successfully",
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit),
                });
            }
            if (!limit) {
                allProduct = await Product.find();
            } else {
                // Nếu không có filter hoặc sort, lấy tất cả sản phẩm
                allProduct = await Product.find()
                    .limit(limit)
                    .skip(page * limit);
            }

            resolve({
                status: "OK",
                message: " All product successfully",
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit),
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({ _id: id }); //_id
            if (product === null) {
                resolve({
                    status: "Error",
                    message: "The product is not defined",
                });
            }

            resolve({
                status: "OK",
                message: "Product successfully",
                data: product,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllTypes = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct("type");
            resolve({
                status: "OK",
                message: "Type Product successfully",
                data: allType,
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllTypes,
};
