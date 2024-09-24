import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AllReviews = ({ token }) => {
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [sortBy, setSortBy] = useState("releaseYearNewest"); // Default sort option

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reviews", {
          headers: { Authorization: token },
        });
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setErrorMessage("Failed to load reviews. Please try again.");
      }
    };

    fetchReviews();
  }, [token]);

  // Sorting function
  const sortReviews = (reviews) => {
    switch (sortBy) {
      case "releaseYearNewest":
        return reviews.sort((a, b) => b.release_year - a.release_year);
      case "releaseYearOldest":
        return reviews.sort((a, b) => a.release_year - b.release_year);
      case "ratingHighest":
        return reviews.sort((a, b) => b.rating - a.rating);
      case "ratingLowest":
        return reviews.sort((a, b) => a.rating - b.rating);
      case "publicationDateNewest":
        return reviews.sort(
          (a, b) => new Date(b.publication_date) - new Date(a.publication_date)
        );
      case "publicationDateOldest":
        return reviews.sort(
          (a, b) => new Date(a.publication_date) - new Date(b.publication_date)
        );
      default:
        return reviews;
    }
  };

  // Sorted reviews
  const sortedReviews = sortReviews([...reviews]);

  return (
    <div className="container mx-auto mt-24">
      <h1 className="text-3xl font-bold text-center mb-4">All Reviews</h1>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {errorMessage}
        </div>
      )}

      {/* Sorting Options */}
      <div className="mb-4">
        <label className="mr-2">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded p-2"
        >
          <option value="releaseYearNewest">Release Year: Newest First</option>
          <option value="releaseYearOldest">Release Year: Oldest First</option>
          <option value="ratingHighest">Rating: Highest First</option>
          <option value="ratingLowest">Rating: Lowest First</option>
          <option value="publicationDateNewest">
            Publication Date: Newest First
          </option>
          <option value="publicationDateOldest">
            Publication Date: Oldest First
          </option>
        </select>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {sortedReviews.map((review) => (
          <Link
            key={review.id}
            to={`/review/${review.id}`} // Navigate to the full review
            className="cursor-pointer relative w-full aspect-square bg-cover bg-center rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            style={{
              backgroundImage: `url(${review.poster})`,
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white text-center font-bold text-xl">
                {review.title} ({review.release_year})
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllReviews;
