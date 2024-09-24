import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditReview = ({ token }) => {
  const { id } = useParams(); // Get the review ID from the URL
  const [review, setReview] = useState({
    title: "",
    poster: "",
    text: "",
    director: "",
    releaseYear: "",
    reviewerName: "",
    publicationDate: "",
    bottomline: "",
    rating: "", // New field for bottom line
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reviews/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        // Ensure all fields are present in the response
        setReview({
          title: response.data.title || "",
          poster: response.data.poster || "",
          text: response.data.text || "",
          director: response.data.director || "",
          releaseYear: response.data.release_year || "",
          reviewerName: response.data.reviewer_name || "",
          publicationDate: response.data.publication_date || "",
          bottomline: response.data.bottomline || "",
          rating: response.data.rating || "",
        });
      } catch (error) {
        console.error("Error fetching review:", error);
        setErrorMessage("Failed to fetch review. Please try again.");
      }
    };
    fetchReview();
  }, [id, token]);

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/reviews/${id}`,
        review, // Send the entire review object
        {
          headers: { Authorization: token },
        }
      );
      console.log("Review updated:", response.data);
      setSuccessMessage("Review updated successfully!");
      navigate("/"); // Redirect to the reviews page
    } catch (error) {
      console.error("Error updating review:", error);
      setErrorMessage("Failed to update review. Please try again.");
    }
  };

  return (
    <div className="container mx-auto my-4">
      <h1 className="text-3xl font-bold text-center mb-4">Edit Review</h1>
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {errorMessage}
        </div>
      )}
      <form
        onSubmit={handleUpdateReview}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            value={review.title}
            onChange={(e) => setReview({ ...review, title: e.target.value })}
            placeholder="Enter movie title"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Poster URL
          </label>
          <input
            type="text"
            value={review.poster}
            onChange={(e) => setReview({ ...review, poster: e.target.value })}
            placeholder="Enter poster URL"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Review Text
          </label>
          <textarea
            rows={5}
            value={review.text}
            onChange={(e) => setReview({ ...review, text: e.target.value })}
            placeholder="Enter your review"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Director's Name
          </label>
          <input
            type="text"
            value={review.director}
            onChange={(e) => setReview({ ...review, director: e.target.value })}
            placeholder="Enter director's name"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Release Year
          </label>
          <input
            type="number"
            value={review.releaseYear}
            onChange={(e) =>
              setReview({ ...review, releaseYear: e.target.value })
            }
            placeholder="Enter release year"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Reviewer's Name
          </label>
          <input
            type="text"
            value={review.reviewerName}
            onChange={(e) =>
              setReview({ ...review, reviewerName: e.target.value })
            }
            placeholder="Enter your name"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Publication Date
          </label>
          <input
            type="date"
            value={review.publicationDate}
            onChange={(e) =>
              setReview({ ...review, publicationDate: e.target.value })
            }
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Bottom Line
          </label>
          <input
            type="text"
            value={review.bottomline}
            onChange={(e) =>
              setReview({ ...review, bottomline: e.target.value })
            }
            placeholder="Enter the bottom line for the review"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {/* Rating Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Rating
          </label>
          <input
            type="number"
            min="1"
            max="8"
            value={review.rating}
            onChange={(e) => setReview({ ...review, rating: e.target.value })}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Update Review
        </button>
      </form>
    </div>
  );
};

export default EditReview;
