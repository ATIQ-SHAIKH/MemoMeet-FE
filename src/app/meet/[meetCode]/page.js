// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { usePathname, useRouter } from 'next/navigation';
// // import useSocket from '@/app/hooks/socket';
// import { io } from 'socket.io-client';
// import ControlsBar from '@/components/ControlsBar';
// import SidePanel from '@/components/SidePanel';
// import Loader from '@/components/Loader';

// const peers = new Map();
// let STREAM = null;

// const Meet = () => {
//   const router = useRouter();

//   const pathname = usePathname();
//   const pathParts = pathname.split('/');
//   const roomId = pathParts[pathParts.length - 1];

//   const userVideoRef = useRef(null);
//   const videoContainerRef = useRef(null);
//   const socketRef = useRef();
//   const iceCandidatesRef = useRef();

//   const [isConnected, setIsConnected] = useState(false);
//   const [micOn, setMicOn] = useState(true);
//   const [videoOn, setVideoOn] = useState(true);
//   const [isPanelOpen, setIsPanelOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');

//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       console.log('Tab is closing, leaving room.');
//       leaveRoom();
//     };

//     // Add listener for tab close
//     window.addEventListener('beforeunload', handleBeforeUnload);

//     console.log(roomId, 'roomId');
//     socketRef.current = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);

//     socketRef.current.on('connect', () => {
//       console.log('Socket connected');
//       setIsConnected(true);
//       getUserMedia(); // Move getUserMedia here
//     });
//     // getUserMedia()

//     // Add disconnect handler
//     socketRef.current.on('disconnect', () => {
//       console.log('Socket disconnected');
//       setIsConnected(false);
//     });

//     socketRef.current.on('joined', handleRoomJoined);
//     console.log('this is', socketRef.current.id);

//     // Events that are webRTC speccific
//     socketRef.current.on('offer', handleOffer);
//     socketRef.current.on('answer', handleAnswer);
//     socketRef.current.on('ice-candidate', handlerNewIceCandidateMsg);
//     socketRef.current.on('user-left', handleUserLeft);

//     // clear up after
//     return () => {
//       console.log('leaveRoom');
//       leaveRoom();
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//       if (STREAM) {
//         STREAM.getTracks().forEach((track) => {
//           track.stop();
//         });
//         STREAM = null;
//       }
//     };
//   }, [roomId]);

//   const videoElement = (
//     <video
//       ref={userVideoRef}
//       className="bg-black rounded-md"
//       autoPlay
//       playsInline
//       muted={true}
//     ></video>
//   );

//   const getUserMedia = () => {
//     navigator.mediaDevices
//       .getUserMedia({
//         audio: true,
//         video: { width: 500, height: 500 },
//       })
//       .then((stream) => {
//         STREAM = stream;
//         if (userVideoRef.current) {
//           userVideoRef.current.srcObject = stream;
//         } else {
//           console.log('userVideoRef is null');
//         }
//         socketRef.current.emit('join', { roomId });
//       })
//       .catch((err) => {
//         /* handle the error */
//         console.log(err);
//       });
//   };

//   const handleRoomJoined = async ({ newPeerSocketId }) => {
//     console.log('This is', socketRef.current.id);
//     console.log(newPeerSocketId, 'newPeerSocketId');
//     const peerConnection = await createPeerConnection(newPeerSocketId);
//     const offer = await peerConnection.createOffer();
//     console.log(offer);
//     await peerConnection.setLocalDescription(offer);
//     socketRef.current.emit('offer', { offer, to: newPeerSocketId });
//     peers.set(newPeerSocketId, peerConnection);
//   };

//   const createPeerConnection = async (socketId) => {
//     // We create a RTC Peer Connection
//     const connection = new RTCPeerConnection({
//       iceServers: [
//         {
//           urls: 'stun:openrelay.metered.ca:80',
//         },
//       ],
//     });

//     if (STREAM) {
//       STREAM.getTracks().forEach((track) => {
//         connection.addTrack(track, STREAM);
//       });
//     }

//     // We implement our onicecandidate method for when we received a ICE candidate from the STUN server
//     connection.onicecandidate = (event) => {
//       if (event.candidate) {
//         iceCandidatesRef.current = [];
//         iceCandidatesRef.current.push(event.candidate);
//         socketRef.current.emit('ice-candidate', event.candidate, socketId);
//       }
//     };

//     // We implement our onTrack method for when we receive tracks
//     connection.ontrack = (event) => {
//       const stream = event.streams[0];

//       if (event.track.kind === 'video') {
//         // Create a video element
//         const videoElement = document.createElement('video');

//         // Set attributes for the video element
//         videoElement.id = `video-${socketId}`;
//         videoElement.autoplay = true;
//         videoElement.playsInline = true;
//         videoElement.className = 'rounded-lg';
//         videoElement.srcObject = stream;

//         if (videoContainerRef && videoContainerRef.current) {
//           videoContainerRef.current.appendChild(videoElement);
//         }
//       }

//       if (event.track.kind === 'audio') {
//         // Create a audio element
//         const audioElement = document.createElement('audio');

//         // Set attributes for the audio element
//         audioElement.id = `audio-${socketId}`;
//         audioElement.autoplay = true;
//         audioElement.style.display = 'none';
//         // Mute audio if it's from the local user
//         console.log(socketId, socketRef.current.id);
//         audioElement.muted = socketId === socketRef.current.id;
//         audioElement.srcObject = stream;

//         if (videoContainerRef && videoContainerRef.current) {
//           videoContainerRef.current.appendChild(audioElement);
//         }
//       }
//     };

//     return connection;
//   };

//   const handleOffer = async ({ offer, from }) => {
//     console.log(from, 'from');
//     const peer = await createPeerConnection(from);

//     await peer.setRemoteDescription(offer);

//     const answer = await peer.createAnswer();

//     await peer.setLocalDescription(answer);

//     socketRef.current.emit('answer', { answer, to: from });

//     peers.set(from, peer);
//   };

//   const handleAnswer = async ({ answer, from }) => {
//     console.log(answer);
//     const peer = peers.get(from);
//     await peer.setRemoteDescription(answer).catch((err) => console.log(err));

//     // exchange ice-candidates
//     iceCandidatesRef.current.forEach((candidate) =>
//       socketRef.current.emit('ice-candidate', candidate, from)
//     );
//     iceCandidatesRef.current = [];
//   };

//   const handlerNewIceCandidateMsg = async (candidate, from) => {
//     const peer = peers.get(from);

//     if (!peer) {
//       console.error('no peerconnection');
//       return;
//     }

//     if (!candidate.candidate) {
//       await peer.addIceCandidate(undefined);
//     } else {
//       console.log('Adding Ice Candidate', candidate);
//       await peer.addIceCandidate(candidate);
//       if (iceCandidatesRef.current.length) {
//         iceCandidatesRef.current.forEach((candidate) =>
//           socketRef.current.emit('ice-candidate', candidate, from)
//         );
//         iceCandidatesRef.current = [];
//       }
//     }
//   };

//   const leaveRoom = () => {
//     socketRef.current.emit('leave', roomId);
//     socketRef.current.disconnect();
//     router.push('/');
//   };

//   const handleUserLeft = (socketId) => {
//     console.log('User Left', socketId);
//     console.log('Before Remove', peers);
//     const peer = peers.get(socketId);

//     if (peer) {
//       const videoToRemove = document.getElementById(`video-${socketId}`);
//       const audioToRemove = document.getElementById(`audio-${socketId}`);

//       if (videoToRemove && audioToRemove) {
//         videoContainerRef.current?.removeChild(videoToRemove);
//         videoContainerRef.current?.removeChild(audioToRemove);
//         peer.close();
//         peers.delete(socketId);
//       }
//     }

//     console.log('After Remove', peers);
//   };

//   const toggleMic = () => {
//     if (userVideoRef.current) {
//       const audioTrack = userVideoRef.current.srcObject.getAudioTracks()[0];
//       if (audioTrack) {
//         audioTrack.enabled = !audioTrack.enabled;
//         setMicOn(audioTrack.enabled);
//       }
//     }
//   };

//   const toggleVideo = () => {
//     if (userVideoRef.current) {
//       const videoTrack = userVideoRef.current.srcObject.getVideoTracks()[0];
//       if (videoTrack) {
//         videoTrack.enabled = !videoTrack.enabled;
//         setVideoOn(videoTrack.enabled);
//       }
//     }
//   };

//   // Handle sending a message
//   const sendMessage = () => {
//     if (newMessage.trim() === '') return;

//     const message = { sender: 'You', text: newMessage, timestamp: new Date() };
//     setMessages((prev) => [...prev, message]);
//     setNewMessage(''); // Clear input

//     // Send message to peers via WebRTC signaling (placeholder logic)
//     console.log('Message sent:', message);
//   };

//   // Toggle side panel
//   const togglePanel = () => {
//     setIsPanelOpen((prev) => !prev);
//     console.log(isPanelOpen);
//   };

//   if (!isConnected) {
//     return <Loader />;
//   }

//   return (
//     <div className="h-screen bg-gray-900 text-white flex flex-col relative">
//       <h1>
//         Room: {roomId}-{socketRef.current?.id || 'connecting...'}
//       </h1>
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
//         {/* <video autoPlay muted ref={userVideoRef} style={{ width: '300px', border: '1px solid black' }} /> */}
//         {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2">
//                     You
//                 </div> */}
//         <div
//           ref={videoContainerRef}
//           id="video-container"
//           className={`grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center items-center`}
//         >
//           {videoElement}
//         </div>
//         {isPanelOpen && (
//           <SidePanel
//             messages={messages}
//             newMessage={newMessage}
//             setNewMessage={setNewMessage}
//             sendMessage={sendMessage}
//             closePanel={togglePanel}
//           />
//         )}
//       </div>
//       <ControlsBar
//         micOn={micOn}
//         videoOn={videoOn}
//         onToggleMic={toggleMic}
//         onToggleVideo={toggleVideo}
//         onTogglePanel={togglePanel}
//         onEndCall={leaveRoom}
//       />
//     </div>
//   );
// };

// export default Meet;

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function Meet() {
  const localVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peersRef = useRef(new Map());

  const pathname = usePathname();
  const router = useRouter();
  const pathParts = pathname.split('/');
  const roomId = pathParts[pathParts.length - 1];

  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);

  useEffect(() => {
    console.log('roomStreams', remoteStreams);
  }, [remoteStreams]);

  /* ------------------ Get media ------------------ */
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(setLocalStream)
      .catch(console.error);
  }, []);

  /* ------------------ Attach local stream ------------------ */
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  /* ------------------ Socket + signaling ------------------ */
  useEffect(() => {
    if (!localStream || socketRef.current) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join", { roomId });
    });

    socketRef.current.on("joined", handleUserJoined);
    socketRef.current.on("offer", handleOffer);
    socketRef.current.on("answer", handleAnswer);
    socketRef.current.on("ice-candidate", handleIce);
    socketRef.current.on("user-left", handleUserLeft);

    return cleanup;
  }, [localStream, roomId]);

  const leaveRoom = () => {
    cleanup();
    router.push("/");
  };

  /* ------------------ Peer creation ------------------ */
  const createPeer = (peerId) => {
    console.log('Creating peer connection for', peerId);
    if (peersRef.current.has(peerId)) {
      console.log('Peer connection already exists for', peerId);
      return peersRef.current.get(peerId);
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // TURN goes here in prod
      ],
    });
    console.log('Peer Connection created', pc);
    localStream.getTracks().forEach(track => {
      console.log('Adding local track to peer connection', track);
      pc.addTrack(track, localStream)
    }
    );

    pc.ontrack = (e) => {
      console.log('Received remote stream from', peerId);
      setRemoteStreams(prev => {
        if (prev.find(p => p.peerId === peerId)) return prev;
        return [...prev, { peerId, stream: e.streams[0] }];
      });
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log('ICE candidate generated for', peerId, e.candidate);
        socketRef.current.emit("ice-candidate",
          e.candidate,
          peerId,
        );
      }
    };

    peersRef.current.set(peerId, pc);
    console.log('Peer connection stored in ref', peersRef.current);
    return pc;
  };

  /* ------------------ Signaling handlers ------------------ */
  const handleUserJoined = async ({ newPeerSocketId: peerId }) => {
    console.log('User joined', peerId);
    const pc = createPeer(peerId);
    console.log('Creating offer for', peerId);
    const offer = await pc.createOffer();
    console.log('Offer created for', peerId, offer);
    await pc.setLocalDescription(offer);
    console.log('Local description set for', peerId);
    socketRef.current.emit("offer", { to: peerId, offer });
    console.log('Offer sent to', peerId);
  };

  const handleOffer = async ({ from, offer }) => {
    const pc = createPeer(from);
    await pc.setRemoteDescription(offer);

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socketRef.current.emit("answer", { to: from, answer });
  };

  const handleAnswer = async ({ from, answer }) => {
    const pc = peersRef.current.get(from);
    await pc.setRemoteDescription(answer);
  };

  const handleIce = async (candidate, from) => {
    const pc = peersRef.current.get(from);

    if (!pc) return;

    if (pc.remoteDescription) {
      await pc.addIceCandidate(candidate);
    } else {
      console.log("ICE received before SDP");
    }
  };

  /* ------------------ handle User Left ------------------ */
  const handleUserLeft = (peerId) => {
    const pc = peersRef.current.get(peerId);

    if (pc) {
      pc.close();
      peersRef.current.delete(peerId);
    }

    setRemoteStreams(prev => prev.filter(p => p.peerId !== peerId));
  };

  /* ------------------ Cleanup ------------------ */
  const cleanup = () => {
    console.log("Cleaning up...");

    peersRef.current.forEach(pc => pc.close());
    peersRef.current.clear();

    if (socketRef.current) {
      socketRef.current.off("joined");
      socketRef.current.off("offer");
      socketRef.current.off("answer");
      socketRef.current.off("ice-candidate");
      socketRef.current.off("user-left");

      socketRef.current.emit("leave", roomId);
      socketRef.current.disconnect();
    }

    localStream?.getTracks().forEach(t => t.stop());
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <video ref={localVideoRef} autoPlay muted playsInline />

      {remoteStreams.map(({ peerId, stream }) => (
        <div key={peerId} className="border">
          <VideoTile stream={stream} />
        </div>

      ))}

      <button onClick={leaveRoom} className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded">Leave Room</button>
    </div>
  );
}

/* ------------------ VideoTile ------------------ */
function VideoTile({ stream }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
      <video
        ref={ref}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}

