const express = require("express");
const router = express.Router();
const {addNotice, getNotices, deleteNotice} = require("../Controllers/NoticeController");
const { authenticateUser } = require("../Middleware/Auth");
router.use(authenticateUser)
// POST /notices
router.post("/", addNotice);
router.get("/getnotice",getNotices)
router.delete("/:id", deleteNotice); 
module.exports = router;
