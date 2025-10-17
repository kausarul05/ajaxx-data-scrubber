"use client";
import { useState } from "react";
import { Star } from "lucide-react";

export default function Page() {
    const [rating, setRating] = useState(4);

    return (
        <div className="min-h-screen bg-[#0A2131] flex justify-center items-start p-4 sm:p-6 lg:p-8">
            <div className="w-full  bg-[#0D314B] rounded-2xl p-4 sm:p-6 lg:p-8">

                {/* Header */}
                <h2 className="text-white text-lg font-medium mb-4 sm:mb-6">Review</h2>
                <div className="border-b border-[#007ED6] mb-4 sm:mb-6"></div>

                {/* Stars */}
                <div className="flex gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8 justify-center sm:justify-start">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-sm flex items-center justify-center 
              ${rating >= star ? "bg-[#007ED6]" : "bg-transparent border border-[#007ED6]"}`}
                        >
                            <Star
                                size={22}
                                className={`sm:w-6 sm:h-6 ${rating >= star ? "text-white" : "text-white"}`}
                                fill={rating >= star ? "white" : "none"}
                            />
                        </button>
                    ))}
                </div>

                {/* Description */}
                <label className="text-white font-semibold mb-2 block text-sm">Description</label>
                <textarea
                    className="w-full bg-transparent border border-[#007ED6] rounded-lg text-white p-3 sm:p-4 h-28 sm:h-32 outline-none resize-none mb-6 sm:mb-10"
                    placeholder="Tell us about your experience"
                ></textarea>

                {/* Submit Button */}
                <div className="flex justify-center sm:justify-start">
                    <button className="bg-[#007ED6] hover:bg-[#026bb7] text-white font-semibold px-8 sm:px-14 py-3 sm:py-4 rounded-md drop-shadow-xl cursor-pointer w-full sm:w-auto text-sm sm:text-base">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}