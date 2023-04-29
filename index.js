const fs = require("fs");
const express = require("express");
const app = express();

// Serve static files from the 'public' directory
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Route for the root URL
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

app.post("/submit-email", (req, res) => {
  const { email } = req.body;
  if (!validateEmail(email)) {
    res.redirect(`/?message=Invalid Email Address`);
    return;
  }
  fs.readFile(__dirname + "/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to read file." });
      return;
    }

    const json = JSON.parse(data);
    json.emails.push(email);

    fs.writeFile("db.json", JSON.stringify(json), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save email." });
        return;
      }
      res.redirect("/?message=Submitted Successfully");
    });
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
