const express = require("express");

const router = express.Router();

router.post("/", (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "Name, email, subject and message are required." });
  }

  // For now we just log the request server-side; plug in email/DB as needed later.
  console.log("New contact request:", { name, email, subject, message });

  return res.json({
    status: "success",
    message: "Thanks for reaching out. We'll get back to you soon.",
  });
});

module.exports = router;
