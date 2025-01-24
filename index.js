const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Serve the frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Endpoint to log visitor data
app.post("/log", (req, res) => {
  const data = req.body;

  // Read the existing data from visitors.json
  fs.readFile("visitors.json", (err, fileData) => {
    let visitors = [];

    if (!err && fileData.length > 0) {
      visitors = JSON.parse(fileData); // Parse existing JSON data
    }

    // Add the new visitor data
    visitors.push({
      userAgent: data.userAgent,
      location: data.location,
      timestamp: new Date().toISOString(),
    });

    // Write the updated data back to visitors.json
    fs.writeFile(
      "visitors.json",
      JSON.stringify(visitors, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Error saving visitor data:", writeErr);
          return res.status(500).send("Server error");
        }
        console.log("Visitor data saved:", data);
        res.status(200).send("Logged successfully");
      },
    );
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
