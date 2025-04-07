const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

//Cross-Origin Resource Sharing) là một cơ chế bảo mật trong trình duyệt mà ngăn không cho các trang web từ một nguồn (origin) khác truy cập tài nguyên từ một nguồn khác.
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); // Lưu trữ cookie

routes(app);

mongoose
    .connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log(
            `Connected to MongoDB Database: ${mongoose.connection.name} : ${mongoose.connection.host}`
        );
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB   - ", err);
    });
// console.log("process.env.PAYPAL_CLIENT_ID: ", process.env.PAYPAL_CLIENT_ID);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
