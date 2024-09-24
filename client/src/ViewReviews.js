import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Ensure Link is imported

import { heartBlack } from "./assets"; // Adjust the path as necessary
import { heartFilled } from "./assets"; // Adjust the path as necessary
import { pencil } from "./assets"; // Adjust the path as necessary
import { halfStar } from "./assets";
import { filledStar } from "./assets";
import { emptyStar } from "./assets";

const ViewReviews = ({ reviews, token }) => {
  const [likedReviews, setLikedReviews] = useState(new Set());

  useEffect(() => {
    const fetchLikedReviews = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/user/likes",
            {
              headers: { Authorization: token },
            }
          );
          const likedIds = new Set(response.data.map((like) => like.review_id));
          setLikedReviews(likedIds);
        } catch (error) {
          console.error("Error fetching liked reviews:", error);
        }
      }
    };

    fetchLikedReviews();
  }, [token]);

  const handleLike = async (reviewId) => {
    try {
      const isLiked = likedReviews.has(reviewId);
      const response = await axios.post(
        `http://localhost:5000/api/reviews/${reviewId}/like`,
        {},
        {
          headers: { Authorization: token },
        }
      );

      // Log the current like count before the action
      const currentReview = reviews.find((review) => review.id === reviewId);
      console.log(`Current likes for review ${reviewId}:`, currentReview.likes);

      // Update the liked reviews set
      setLikedReviews((prev) => {
        const newLikedReviews = new Set(prev);
        if (isLiked) {
          newLikedReviews.delete(reviewId); // Remove like
        } else {
          newLikedReviews.add(reviewId); // Add like
        }
        return newLikedReviews;
      });

      // Update the local like count based on the response
      const updatedLikes = response.data.likes; // Get updated likes from API response
      console.log(`Updated likes for review ${reviewId}:`, updatedLikes); // Log updated likes

      // Update the review's like count directly
      reviews.forEach((review) => {
        if (review.id === reviewId) {
          review.likes = updatedLikes; // Update the local like count
        }
      });
    } catch (error) {
      console.error("Error liking review:", error);
    }
  };

  // Sort reviews by publication date (latest first)
  const sortedReviews = [...reviews].sort((a, b) => {
    return new Date(b.publication_date) - new Date(a.publication_date);
  });

  return (
    <div className="container mx-auto mb-4 mt-24">
      <h1 className="text-gray-800 text-center font-semibold text-3xl mb-4">
        Latest reviews
      </h1>
      <div className="grid grid-cols-1 gap-4">
        {sortedReviews.map((review, index) => (
          <div
            key={review.id}
            className={`bg-white shadow-md overflow-hidden flex p-4 relative ${
              index % 2 === 0 ? "" : "flex-row-reverse"
            }`} // Even index (0, 2, 4...) has poster on the right
          >
            <div className="relative w-2/3 h-[24rem] z-50">
              <img
                src={review.poster}
                alt={review.title}
                className="w-full h-full object-cover saturate-150"
                loading="lazy"
              />
              {/* Date Overlay */}
              <div
                className={`absolute top-2 bg-black bg-opacity-70 text-white text-center w-16 p-2 rounded ${
                  index % 2 === 0 ? "right-2" : "left-2"
                }`}
              >
                <div className="day text-2xl font-bold">
                  {new Date(review.publication_date).getDate()}
                </div>
                <div className="month text-sm">
                  {new Date(review.publication_date).toLocaleString("en-US", {
                    month: "short",
                  })}
                </div>
                <div className="year text-sm">
                  {new Date(review.publication_date).getFullYear()}
                </div>
              </div>
              {/* Additional fields overlay */}
              <div
                className={`absolute bottom-2 text-white text-lg p-2 bg-black bg-opacity-40 rounded ${
                  index % 2 === 0 ? "right-2" : "left-2"
                }`}
              >
                <div className="flex flex-col text-xl">
                  <div className="director">Directed by: {review.director}</div>
                  <div className="reviewer">
                    Text by: {review.reviewer_name}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between ml-4 w-2/3 cursor-default">
              <div className="flex flex-col justify-center items-center h-4/5 pt-10">
                {/* Stars Section */}
                <div className="flex justify-center mb-4">
                  {Array.from({ length: 4 }, (_, i) => {
                    const starRating = review.rating; // Assuming review.rating is between 1 and 8
                    const filledStars = Math.floor(starRating / 2); // Full stars
                    const hasHalfStar = starRating % 2 === 1; // Half star if rating is odd

                    if (i < filledStars) {
                      return (
                        <img
                          key={i}
                          src={filledStar}
                          alt="Filled Star"
                          className="w-8 h-8"
                        />
                      );
                    } else if (i === filledStars && hasHalfStar) {
                      return (
                        <img
                          key={i}
                          src={halfStar}
                          alt="Half Star"
                          className="w-8 h-8"
                        />
                      );
                    } else {
                      return (
                        <img
                          key={i}
                          src={emptyStar}
                          alt="Empty Star"
                          className="w-8 h-8"
                        />
                      );
                    }
                  })}
                </div>
                <p className="text-2xl font-bold mb-4 flex justify-center items-center">
                  <span className="font-roboto font-normal text-2xl">
                    Bottom Line:
                  </span>
                  <Link
                    to={`/review/${review.id}`}
                    className="uppercase italic text-[#ff00cd] hover:underline z-50 font-bebas text-4xl tracking-wider"
                  >
                    &nbsp;{review.title}&nbsp;
                  </Link>
                  <span className="font-roboto font-normal text-2xl">is</span>
                </p>
                <p className="italic text-7xl text-center uppercase font-anton tracking-widest mx-10">
                  "{review.bottomline}"
                </p>
              </div>
              <div>
                <div
                  className={`flex items-center mt-2 ${
                    index % 2 === 0
                      ? "justify-end"
                      : "justify-end flex-row-reverse"
                  }`}
                >
                  {likedReviews.has(review.id) &&
                    review.likes > 0 && ( // Show like count only if likes > 0
                      <div className="flex items-center z-50 mr-2">
                        <span className="text-lg font-bold text-red-700">
                          {review.likes}
                        </span>
                      </div>
                    )}
                  {token && (
                    <button
                      className="z-50 rounded hover:bg-blue-600 transition duration-300 ease-in-out mr-2"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the Link on button click
                        handleLike(review.id);
                      }}
                    >
                      <img
                        src={
                          likedReviews.has(review.id) ? heartFilled : heartBlack
                        }
                        alt="Like"
                        className="w-8 h-8"
                      />
                    </button>
                  )}
                  {token && ( // Show Edit button if user is logged in
                    <Link
                      to={`/edit/${review.id}`}
                      className={`z-50 rounded hover:bg-gray-400 transition duration-300 ease-in-out ${
                        index % 2 === 0 ? "" : "mr-2"
                      }`}
                    >
                      <img src={pencil} alt="Edit" className="w-8 h-8" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Repeating Header Text */}
              <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center items-center overflow-hidden pointer-events-none opacity-20 p-0 m-0">
                <h1 className="text-[8rem] font-bold text-purple-600 whitespace-nowrap rotate-12">
                  {Array(4) // Reduced to 3 repetitions
                    .fill(review.title) // Repeat the title
                    .map((title, i) => (
                      <span key={i} className="mr-16">
                        {title}
                      </span>
                    ))}
                </h1>

                <h1 className="text-[8rem] font-bold text-purple-600 whitespace-nowrap rotate-12">
                  {Array(4) // Reduced to 3 repetitions
                    .fill(review.title) // Repeat the title
                    .map((title, i) => (
                      <span key={i} className="mr-16">
                        {title}
                      </span>
                    ))}
                </h1>

                <h1 className="text-[8rem] font-bold text-purple-600 whitespace-nowrap rotate-12">
                  {Array(4) // Reduced to 3 repetitions
                    .fill(review.title) // Repeat the title
                    .map((title, i) => (
                      <span key={i} className="mr-16">
                        {title}
                      </span>
                    ))}
                </h1>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewReviews;
