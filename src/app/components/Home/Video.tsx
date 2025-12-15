export default function Video() {
  return (
    <div className="bg-custom section-gap">
      <video
        className="w-full h-[400px] lg:h-[500px] object-cover rounded-lg"
        src="/video/video.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
}

