"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { apiRequest } from '@/app/lib/api';
import { toast } from "react-toastify";

export default function Page() {
    const [rating, setRating] = useState(4);
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    // const accessToken = localStorage.getItem("authToken");
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() =>{
        const token = localStorage.getItem("authToken");
        setAccessToken(token);
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!body.trim()) {
            setMessage("Please enter your review message.");
            return;
        }

        if (rating === 0) {
            setMessage("Please select a rating.");
            return;
        }

        // Convert rating to stars string
        const ratingStars = "⭐".repeat(rating);

        setLoading(true);
        setMessage("");
        try {
            await apiRequest("POST", "/service/review/", {
                body: body,
                rating: ratingStars
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            toast.success("Review submitted successfully!");
            
            // Reset form after successful submission
            setBody("");
            setRating(4);
        } catch (error) {
            setMessage((error instanceof Error ? error.message : String(error)) || "Failed to submit review.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A2131] flex justify-center items-start p-4 sm:p-6 lg:p-8">
            <div className="w-full bg-[#0D314B] rounded-2xl p-4 sm:p-6 lg:p-8">

                {/* Header */}
                <h2 className="text-white text-lg font-medium mb-4 sm:mb-6">Review</h2>
                <div className="border-b border-[#007ED6] mb-4 sm:mb-6"></div>

                {/* Message Display */}
                {message && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes("successfully") ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Stars */}
                    <div className="flex gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8 justify-center sm:justify-start">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-sm flex items-center justify-center 
              ${rating >= star ? "bg-[#007ED6]" : "bg-transparent border border-[#007ED6]"} cursor-pointer`}
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
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    ></textarea>

                    {/* Submit Button */}
                    <div className="flex justify-center sm:justify-start">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="bg-[#007ED6] hover:bg-[#026bb7] text-white font-semibold px-8 sm:px-14 py-3 sm:py-4 rounded-md drop-shadow-xl cursor-pointer w-full sm:w-auto text-sm sm:text-base disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}