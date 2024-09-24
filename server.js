const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 5000;
const db = new sqlite3.Database("./reviews.db");

// Initialize database and create tables
db.serialize(() => {
  // Create the reviews table if it does not exist
  db.run(
    "CREATE TABLE IF NOT EXISTS reviews (id INTEGER PRIMARY KEY, title TEXT, poster TEXT, text TEXT, director TEXT, release_year INTEGER, reviewer_name TEXT, publication_date TEXT, likes INTEGER DEFAULT 0, bottomline TEXT, rating INTEGER DEFAULT 1)" // Added bottomline column
  );

  // Create the likes table if it does not exist
  db.run(
    "CREATE TABLE IF NOT EXISTS likes (id INTEGER PRIMARY KEY, review_id INTEGER, user_id TEXT, FOREIGN KEY (review_id) REFERENCES reviews(id))"
  );
});

// Hardcoded user credentials
const user = {
  username: "gordonblake",
  password: bcrypt.hashSync("5h9bXo4sTRrV0U0ewQzk", 10),
};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Authentication route
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (
    username === user.username &&
    bcrypt.compareSync(password, user.password)
  ) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ token });
  }
  return res.status(401).json({ error: "Invalid username or password" });
});

// Token verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Failed to authenticate token" });
    }
    req.user = decoded;
    next();
  });
};

// Get all reviews with like counts
app.get("/api/reviews", (req, res) => {
  db.all(
    `SELECT reviews.*, 
            (SELECT COUNT(*) FROM likes WHERE review_id = reviews.id) AS likes 
     FROM reviews`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.json(rows); // Ensure that each row includes the likes property
    }
  );
});

// Get a specific review by ID
app.get("/api/reviews/:id", (req, res) => {
  const reviewId = parseInt(req.params.id);
  db.get("SELECT * FROM reviews WHERE id = ?", [reviewId], (err, row) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: "Review not found." });
    }
    res.json(row);
  });
});

// Add a new review
app.post("/api/reviews", verifyToken, (req, res) => {
  const {
    title,
    poster,
    text,
    director,
    releaseYear,
    reviewerName,
    publicationDate,
    bottomline,
    rating, // Add bottomline to the request body
  } = req.body;

  db.run(
    "INSERT INTO reviews (title, poster, text, director, release_year, reviewer_name, publication_date, bottomline, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      title,
      poster,
      text,
      director,
      releaseYear,
      reviewerName,
      publicationDate,
      bottomline,
      rating,
    ], // Include bottomline in the values
    function (err) {
      if (err) {
        console.error("Error uploading review:", err.message);
        return res.status(500).json({ message: "Failed to upload review." });
      }
      res.status(201).json({
        id: this.lastID,
        title,
        poster,
        text,
        director,
        releaseYear,
        reviewerName,
        publicationDate,
        bottomline, // Include bottomline in the response
        likes: 0,
        rating: rating || 1, // Initialize likes to 0
      });
    }
  );
});

// Update a review
app.put("/api/reviews/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const {
    title,
    poster,
    text,
    director,
    releaseYear,
    reviewerName,
    publicationDate,
    bottomline,
    rating, // Add bottomline to the request body
  } = req.body;

  db.run(
    "UPDATE reviews SET title = ?, poster = ?, text = ?, director = ?, release_year = ?, reviewer_name = ?, publication_date = ?, bottomline = ?, rating = ? WHERE id = ?",
    [
      title,
      poster,
      text,
      director,
      releaseYear,
      reviewerName,
      publicationDate,
      bottomline,
      rating,
      id,
    ],
    function (err) {
      if (err) {
        console.error("Error updating review:", err.message);
        return res.status(500).json({ message: "Failed to update review." });
      }
      res.status(200).json({ message: "Review updated successfully!" });
    }
  );
});

// Like a review
app.post("/api/reviews/:id/like", verifyToken, (req, res) => {
  const reviewId = parseInt(req.params.id);
  const userId = req.user.username; // Assuming username is used as user ID

  // Check if the user has already liked the review
  db.get(
    "SELECT * FROM likes WHERE review_id = ? AND user_id = ?",
    [reviewId, userId],
    (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to check like status." });
      }

      if (row) {
        // User has already liked the review, so remove the like
        db.run(
          "DELETE FROM likes WHERE review_id = ? AND user_id = ?",
          [reviewId, userId],
          function (err) {
            if (err) {
              return res
                .status(500)
                .json({ message: "Failed to remove like." });
            }
            // Get the updated like count
            db.get(
              "SELECT COUNT(*) as count FROM likes WHERE review_id = ?",
              [reviewId],
              (err, row) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ message: "Failed to get like count." });
                }
                // Decrement the likes count in the reviews table
                db.run(
                  "UPDATE reviews SET likes = likes - 1 WHERE id = ?",
                  [reviewId],
                  (err) => {
                    if (err) {
                      return res
                        .status(500)
                        .json({ message: "Failed to update like count." });
                    }
                    res
                      .status(200)
                      .json({ message: "Like removed.", likes: row.count });
                  }
                );
              }
            );
          }
        );
      } else {
        // User has not liked the review, so add the like
        db.run(
          "INSERT INTO likes (review_id, user_id) VALUES (?, ?)",
          [reviewId, userId],
          function (err) {
            if (err) {
              return res.status(500).json({ message: "Failed to add like." });
            }
            // Get the updated like count
            db.get(
              "SELECT COUNT(*) as count FROM likes WHERE review_id = ?",
              [reviewId],
              (err, row) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ message: "Failed to get like count." });
                }
                // Increment the likes count in the reviews table
                db.run(
                  "UPDATE reviews SET likes = likes + 1 WHERE id = ?",
                  [reviewId],
                  (err) => {
                    if (err) {
                      return res
                        .status(500)
                        .json({ message: "Failed to update like count." });
                    }
                    res
                      .status(200)
                      .json({ message: "Review liked.", likes: row.count });
                  }
                );
              }
            );
          }
        );
      }
    }
  );
});

// Get liked reviews for the logged-in user
app.get("/api/user/likes", verifyToken, (req, res) => {
  const userId = req.user.username; // Assuming username is used as user ID

  db.all(
    "SELECT review_id FROM likes WHERE user_id = ?",
    [userId],
    (err, rows) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to fetch liked reviews." });
      }
      res.json(rows);
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing the database:", err.message);
    } else {
      console.log("SQLite database connection closed");
    }
    process.exit(0);
  });
});
