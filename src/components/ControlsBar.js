import {
  FaMicrophone,
  FaVideo,
  FaPhoneSlash,
  FaComments,
  FaDesktop,
  FaMicrophoneSlash,
  FaVideoSlash,
} from "react-icons/fa";

export default function ControlsBar({ micOn, videoOn, onToggleMic, onToggleVideo, onTogglePanel, onEndCall }) {
  return (
    <div className="bg-gray-900 p-4 flex justify-center space-x-6 fixed bottom-0 w-full z-50">
      <button className="bg-gray-700 p-3 rounded-full hover:bg-gray-600" onClick={onToggleMic}>
        {micOn ? <FaMicrophone className="text-white" /> : <FaMicrophoneSlash className="text-white" />}
      </button>
      <button className="bg-gray-700 p-3 rounded-full hover:bg-gray-600" onClick={onToggleVideo}>
        {videoOn ? <FaVideo className="text-white" /> : <FaVideoSlash className="text-white" />}
      </button>
      <button className="bg-red-700 p-3 rounded-full hover:bg-red-600" onClick={onEndCall}>
        <FaPhoneSlash className="text-white" />
      </button>
      <button className="bg-gray-700 p-3 rounded-full hover:bg-gray-600" onClick={onTogglePanel}>
        <FaComments className="text-white" />
      </button>
      <button className="bg-gray-700 p-3 rounded-full hover:bg-gray-600">
        <FaDesktop className="text-white" />
      </button>
    </div>
  );
}
