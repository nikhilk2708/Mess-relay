const express = require("express");
const router = express.Router();
const complaintController = require("../Controllers/Complaintcontroller.js");
const {resolveComplaint}=require("../Controllers/Complaintcontroller.js");
const { authenticateUser } = require("../Middleware/Auth.js");
// POST /api/complaints - Submit a new complaint
const {likeComplaint}=require("../Controllers/Complaintcontroller.js");
router.use(authenticateUser);
router.post("/", complaintController.submitComplaint);

// GET /api/complaints/getcomplaints - Get all complaints
router.get("/getcomplaints", complaintController.getAllComplaints);

// PUT /api/complaints/:complaintId/resolve - Resolve a complaint by ID
router.put("/:complaintId/resolve", complaintController.resolveComplaint);

// POST /api/complaints/:complaintId/like - Like a complaint by ID
router.post("/like/:complaintId", likeComplaint);

// POST /api/complaints/:complaintId/dislike - Dislike a complaint by ID
router.post("/dislike/:complaintId", complaintController.dislikeComplaint);
router.put('/resolve/:id', resolveComplaint);
module.exports = router;
