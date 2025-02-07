import React, { useRef, useEffect } from "react";

function VideoGrid({ participant, userStreamRef, socketRef, roomId, createPeerConnection }) {
  const rtcConnectionRef = useRef(null);

  const handleReceivedOffer = (offer) => {
    if (!hostRef.current) {
      rtcConnectionRef.current = createPeerConnection();
      rtcConnectionRef.current.addTrack(
        userStreamRef.current.getTracks()[0],
        userStreamRef.current,
      );
      rtcConnectionRef.current.addTrack(
        userStreamRef.current.getTracks()[1],
        userStreamRef.current,
      );
      rtcConnectionRef.current.setRemoteDescription(offer);

      rtcConnectionRef.current
        .createAnswer()
        .then((answer) => {
          rtcConnectionRef.current.setLocalDescription(answer);
          socketRef.current.emit('answer', answer, roomId);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  handleReceivedOffer(offer);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      <div className="video-tile border border-gray-600 rounded-lg overflow-hidden relative">
        <video
          ref={userVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2">
          {participant}
        </div>
      </div>
    </div>
  );
}

export default VideoGrid;
