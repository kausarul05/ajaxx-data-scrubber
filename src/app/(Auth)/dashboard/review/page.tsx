"use client";
import { useState } from "react";
import { Star } from "lucide-react";

export default function Page() {
    const [rating, setRating] = useState(4);

    return (
        <div className="min-h-screen bg-[#0A2131] flex justify-center items-start p-8">
            <div className="w-full  bg-[#0D314B] rounded-2xl p-8">

                {/* Header */}
                <h2 className="text-white text-lg font-medium mb-6">Review</h2>
                <div className="border-b border-[#007ED6] mb-6"></div>

                {/* Stars */}
                <div className="flex gap-4 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`w-12 h-12 rounded-sm flex items-center justify-center 
              ${rating >= star ? "bg-[#007ED6]" : "bg-transparent border border-[#007ED6]"}`}
                        >
                            <Star
                                size={26}
                                className={rating >= star ? "text-white" : "text-white"}
                                fill={rating >= star ? "white" : "none"}
                            />
                        </button>
                    ))}
                </div>

                {/* Description */}
                <label className="text-white font-semibold mb-2 block text-sm">Description</label>
                <textarea
                    className="w-full bg-transparent border border-[#007ED6] rounded-lg text-white p-4 h-32 outline-none resize-none mb-10"
                    placeholder="Tell us about your experience"
                ></textarea>

                {/* Submit Button */}
                <button className="bg-[#007ED6] hover:bg-[#026bb7] text-white font-semibold px-14 py-4 rounded-md drop-shadow-xl cursor-pointer">
                    Submit
                </button>
            </div>
        </div>
    );
}
