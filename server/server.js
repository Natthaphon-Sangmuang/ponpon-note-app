// โหลด module
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

//ดึง noteRoutes มาจากไฟล์ ./routes/notes"
const noteRoutes = require("./routes/notes");

//กำหนด port และ ตำแหน่งขของ database ที่จะใช้
const PORT = process.env.PORT || 4000;

// ใช้ express สร้าง app
const app = express();

// middleware เป็น express.json เป็นการบอกว่าในการส่ง data ผ่าน routes ต่างๆ จะส่งเป็น file json (อันนี้แหล่ะที่ทำให้ส่งภาพขึ้น mongodb ไม่ได้)
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/notes", noteRoutes);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// เชื่อมต่อ mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to database");
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log("listening for requests on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
