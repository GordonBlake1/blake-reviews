import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { halfStar } from "./assets";
import { filledStar } from "./assets";
import { emptyStar } from "./assets";

const FullReview = () => {
  const { id } = useParams(); // Get the review ID from the URL
  const [review, setReview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviewById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reviews/${id}`
        ); // Fetch the review by ID
        setReview(response.data);
      } catch (error) {
        console.error("Error fetching review:", error);
        if (error.response && error.response.status === 404) {
          setError("Review not found");
        } else {
          setError("An error occurred while fetching the review");
        }
      }
    };

    fetchReviewById();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!review) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-24">
      <div className="text-9xl font-serif text-center mb-4 animate-color-change italic">
        {review.title}
      </div>
      <div
        className={`bg-white rounded-lg shadow-md overflow-hidden flex p-4 relative`}
      >
        <div className="relative w-2/3 h-[24rem] z-50">
          <img
            src={review.poster}
            alt={review.title}
            className="w-full h-full object-cover rounded-lg saturate-150"
            loading="lazy"
          />
          {/* Date Overlay */}
          <div
            className={`absolute top-2 bg-black bg-opacity-70 text-white text-center w-16 p-2 rounded right-2`}
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
            className={`absolute bottom-2 text-white text-lg p-2 bg-black bg-opacity-70 rounded right-2`}
          >
            <div className="flex flex-col text-xl">
              <div className="director">Directed by: {review.director}</div>
              <div className="reviewer">Text by: {review.reviewer_name}</div>
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
              <span className="uppercase italic text-[#ff00cd] hover:underline z-50 font-bebas text-4xl tracking-wider">
                &nbsp;{review.title}&nbsp;
              </span>
              <span className="font-roboto font-normal text-2xl">is</span>
            </p>
            <p className="italic text-7xl text-center uppercase font-anton tracking-widest mx-10">
              "{review.bottomline}"
            </p>
          </div>
          <div>
            <div className={`flex items-center mt-2 justify-end`}>
              {review.likes > 0 && ( // Show like count only if likes > 0
                <div className="flex items-center z-50 mr-2">
                  <span className="text-lg font-bold text-red-700">
                    {review.likes}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Repeating Header Text */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center items-center overflow-hidden pointer-events-none opacity-20 p-0 m-0">
            <h1 className="text-[8rem] font-bold text-purple-600 whitespace-nowrap rotate-12">
              {Array(4)
                .fill(review.title)
                .map((title, i) => (
                  <span key={i} className="mr-16">
                    {title}
                  </span>
                ))}
            </h1>

            <h1 className="text-[8rem] font-bold text-purple-600 whitespace-nowrap rotate-12">
              {Array(4)
                .fill(review.title)
                .map((title, i) => (
                  <span key={i} className="mr-16">
                    {title}
                  </span>
                ))}
            </h1>

            <h1 className="text-[8rem] font-bold text-purple-600 whitespace-nowrap rotate-12">
              {Array(4)
                .fill(review.title)
                .map((title, i) => (
                  <span key={i} className="mr-16">
                    {title}
                  </span>
                ))}
            </h1>
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-5xl mx-auto">
        {review.text
          .split("\n")
          .filter((paragraph) => paragraph.trim() !== "")
          .map((paragraph, index) => (
            <div
              key={index}
              className="bg-review-bg p-10 mb-6 shadow-md text-gray-700 text-xl leading-relaxed whitespace-pre-line"
            >
              {paragraph}
            </div>
          ))}
      </div>
    </div>
  );
};

export default FullReview;
