import React, { useState } from "react";
import axios from "axios";

const UploadReview = ({ token }) => {
  const [newReview, setNewReview] = useState({
    title: "",
    poster: "",
    text: "",
    director: "",
    releaseYear: "",
    reviewerName: "",
    publicationDate: "",
    bottomline: "", // New field for bottom line
    rating: 1, // Default rating
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/reviews",
        newReview, // Send the entire newReview object
        {
          headers: { Authorization: token },
        }
      );
      console.log("Uploaded Review Response:", response.data); // Log the response data
      setSuccessMessage("Review uploaded successfully!");
      setNewReview({
        title: "",
        poster: "",
        text: "",
        director: "",
        releaseYear: "",
        reviewerName: "",
        publicationDate: "",
        bottomline: "", // Clear the bottom line field
        rating: 1, // Reset to default rating
      }); // Clear the form
    } catch (error) {
      console.error("Error uploading review:", error);
      setErrorMessage("Failed to upload review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto my-4">
      <h1 className="text-3xl font-bold text-center mb-4">
        Upload a New Review
      </h1>
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
        onSubmit={handleSubmitReview}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            value={newReview.title}
            onChange={(e) =>
              setNewReview({ ...newReview, title: e.target.value })
            }
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
            value={newReview.poster}
            onChange={(e) =>
              setNewReview({ ...newReview, poster: e.target.value })
            }
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
            value={newReview.text}
            onChange={(e) =>
              setNewReview({ ...newReview, text: e.target.value })
            }
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
            value={newReview.director}
            onChange={(e) =>
              setNewReview({ ...newReview, director: e.target.value })
            }
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
            value={newReview.releaseYear}
            onChange={(e) =>
              setNewReview({ ...newReview, releaseYear: e.target.value })
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
            value={newReview.reviewerName}
            onChange={(e) =>
              setNewReview({ ...newReview, reviewerName: e.target.value })
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
            value={newReview.publicationDate}
            onChange={(e) =>
              setNewReview({ ...newReview, publicationDate: e.target.value })
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
            value={newReview.bottomline}
            onChange={(e) =>
              setNewReview({ ...newReview, bottomline: e.target.value })
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
            value={newReview.rating} // Ensure this is part of your state
            onChange={(e) =>
              setNewReview({ ...newReview, rating: e.target.value })
            }
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Uploading..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default UploadReview;
