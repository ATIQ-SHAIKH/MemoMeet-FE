import { useRef } from 'react';

export default function SidePanel({
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  closePanel,
}) {
  const inputRef = useRef();

  return (
    <div className="absolute right-0 top-0 h-[calc(100%-4rem)] w-80 bg-gray-800 text-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-900 p-4">
        <h3 className="text-lg font-semibold">In-Call Messages</h3>
        <button
          onClick={closePanel}
          className="text-gray-400 hover:text-gray-200"
        >
          X
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <p className="text-gray-400">No messages yet</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="p-2 bg-gray-700 rounded">
              <strong>{msg.sender}: </strong>
              <span>{msg.text}</span>
            </div>
          ))
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-gray-900 flex space-x-2">
        <input
          type="text"
          ref={inputRef}
          className="flex-grow p-2 rounded bg-gray-700 text-white focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 p-2 rounded text-white hover:bg-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
}
