import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios"; // Make sure to import axios
import ViewReviews from "./ViewReviews";
import UploadReview from "./UploadReview";
import EditReview from "./EditReview";
import FullReview from "./FullReview";
import AllReviews from "./AllReviews";
import Login from "./Login";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null); // Check local storage for token
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState([]); // State to hold all reviews
  const [filteredReviews, setFilteredReviews] = useState([]); // State to hold filtered reviews

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reviews", {
          headers: { Authorization: token }, // Include token in the request headers
        });
        setReviews(response.data);
        setFilteredReviews(response.data); // Initialize filtered reviews
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [token]);

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    // Filter reviews based on the search term
    setFilteredReviews(
      reviews.filter(
        (review) =>
          review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    setToken(null); // Clear token from state
  };

  return (
    <Router>
      <nav className="bg-[rgb(50,50,50)] bg-opacity-40 backdrop-blur-lg p-4 fixed top-0 left-0 right-0 z-[51] mt-[1rem]">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-white text-2xl font-bold hover:text-[#ff00cd]"
          >
            St. Gordon's Rare Films
          </Link>
          <div className="flex items-center">
            <div className="space-x-4">
              <Link to="/" className="text-white">
                Latest Reviews
              </Link>
              <Link to="/all-reviews" className="text-white">
                All Reviews
              </Link>
              {token ? (
                <>
                  <Link to="/upload" className="text-white">
                    Upload Review
                  </Link>
                  <button onClick={handleLogout} className="text-white">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-white">
                  Login
                </Link>
              )}
            </div>
            <form
              className="ml-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <input
                type="text"
                placeholder="Search"
                className="px-3 py-2 rounded focus:outline-none focus:ring focus:ring-[#ff00cd] bg-transparent text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </form>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route
          path="/upload"
          element={
            token ? (
              <UploadReview token={token} />
            ) : (
              <Login setToken={setToken} />
            )
          }
        />
        <Route
          path="/"
          element={
            <ViewReviews
              reviews={filteredReviews}
              searchTerm={searchTerm}
              token={token}
            />
          }
        />
        <Route
          path="/all-reviews" // New route for AllReviews
          element={<AllReviews token={token} />} // Add the AllReviews component here
        />
        <Route
          path="/review/:id" // New route for FullReview
          element={<FullReview />} // Add the FullReview component here
        />
        <Route
          path="/edit/:id"
          element={
            token ? <EditReview token={token} /> : <Login setToken={setToken} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
