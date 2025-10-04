const fs = require("fs");
const Notice = require("../Models/Notice.js");
const path=require("path");
const client = require("../Redis/redisClient.js");
const addNotice = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
      return res.status(400).send("No files were uploaded.");
    }

    const file = req.files.file;
    const hostel = req.user.hostel;
    const fileName = `${Date.now()}_${file.name}`;
    const uploadPath = `${__dirname}/../uploads/${fileName}`;

    file.mv(uploadPath, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      // Save notice details to MongoDB
      const newNotice = new Notice({
        file: `uploads/${fileName}`,
        hostel
      });
      await newNotice.save();

      // Invalidate the cache for notices
      client.del(`notices:${hostel}`);

      res.json({ message: "Notice added successfully", notice: newNotice });
    });
  } catch (error) {
    console.error("Error adding notice:", error);
    res.status(500).send("Failed to add notice. Please try again later.");
  }
};


// New function to get all notices
const getNotices = async (req, res) => {
  try {
    const hostel = req.user.hostel;
    const cacheKey = `notices:${hostel}`;

    // Promisify Redis client to avoid callback-based code
    const cachedNotices = await client.get(cacheKey);

    if (cachedNotices) {
      return res.json(JSON.parse(cachedNotices)); // Serve cached data if available
    } else {
      // Fetch from MongoDB if not in cache
      const notices = await Notice.find({ hostel });

      // Cache the notices with an expiration of 10 minutes
      await client.setEx(cacheKey, 10 * 60, JSON.stringify(notices));

      return res.json(notices);
    }
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).send("Failed to fetch notices. Please try again later.");
  }
};

const deleteNotice = async (req, res) => {
  try {
    const noticeId = req.params.id;
    const notice = await Notice.findById(noticeId);

    if (!notice) {
      return res.status(404).send("Notice not found.");
    }

    const filePath = path.join(__dirname, "..", notice.file);

    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).send("Failed to delete file.");
      }

      // Delete the notice from the database
      await Notice.findByIdAndDelete(noticeId);

      // Invalidate the cache for notices
      client.del(`notices:${notice.hostel}`);

      res.json({ message: "Notice deleted successfully" });
    });
  } catch (error) {
    console.error("Error deleting notice:", error);
    res.status(500).send("Failed to delete notice. Please try again later.");
  }
};
module.exports = {
  addNotice,
  getNotices,
  deleteNotice, // Export the new function
};





