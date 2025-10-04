const Complaint = require("../Models/ComplainModel.js");
const mongoose=require('mongoose');

const submitComplaint = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
      return res.status(400).send("No files were uploaded.");
    }

    const { title, description } = req.body;
    const file = req.files.file; // Access the uploaded file

    // Move the uploaded file to the uploads directory
    const fileName = `${Date.now()}_${file.name}`;
 const hostel=req.user.hostel;
    // Ensure the 'uploads' directory exists
    const uploadPath = `${__dirname}/../uploads/${fileName}`;
    file.mv(uploadPath, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      // Save complaint details to MongoDB
      const newComplaint = new Complaint({
        title,
        description,
        hostel,
        file: `/uploads/${fileName}`, // Store the file path
      });
      await newComplaint.save();

      res.json({ message: "Complaint submitted successfully", complaint: newComplaint });
    });
  } catch (error) {
    console.error("Error submitting complaint:", error);
    res.status(500).send("Failed to submit complaint. Please try again later.");
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const hostel=req.user.hostel;
    const complaints = await Complaint.find({hostel});
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const likeComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const studentId = req.user._id; // Assuming studentId comes from the authenticated user
    console.log({complaintId,studentId});
    
    // Validate complaintId
    if (!mongoose.isValidObjectId(complaintId)) {
      return res.status(400).json({ message: 'Invalid complaint ID' });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.likes.includes(studentId)) {
      // Student has already liked this complaint
      return res.status(400).json({ message: 'You have already liked this complaint' });
    }

    // Remove studentId from dislikes if it exists
    if (complaint.dislikes.includes(studentId)) {
      complaint.dislikes = complaint.dislikes.filter(id => id.toString() !== studentId.toString());
    }

    // Add studentId to likes
    complaint.likes.push(studentId);
    await complaint.save();

    res.status(200).json({ message: 'Complaint liked successfully', complaint });
  } catch (error) {
    console.error('Error liking complaint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const resolveComplaint = async (req, res) => {
  const { id } = req.params;
  const { resolutionDescription } = req.body;

  try {
    console.log({id});
    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    complaint.resolutionDescription = resolutionDescription;
    complaint.isResolved = true;

    await complaint.save();

    res.json(complaint);
  } catch (error) {
    console.error('Error resolving complaint:', error);
    res.status(500).json({ error: 'Unable to resolve complaint' });
  }
};


const dislikeComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { studentId } = req.body;

    const complaint = await Complaint.findById(complaintId);
    

    if (complaint.dislikes.includes(studentId)) {
      return res.status(400).json({ message: 'You have already disliked this complaint' });
    }

    if (complaint.likes.includes(studentId)) {
      // Remove from likes if already liked
      complaint.likes = complaint.likes.filter(id => id.toString() !== studentId);
    }

    complaint.dislikes.push(studentId);
    await complaint.save();

    res.status(200).json({ message: 'Complaint disliked successfully', complaint });
  } catch (error) {
    console.error('Error disliking complaint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
;

module.exports = {
  submitComplaint,
  resolveComplaint,
  getAllComplaints,
  likeComplaint,
  dislikeComplaint,
};
