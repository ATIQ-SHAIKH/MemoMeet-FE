export default function LandingPageContent({
  handleStartMeetingClick,
  setMeetCode,
  handleJoinClick,
  handleSignInClick,
  loggedIn,
}) {
  return (
    <div className="flex flex-col items-center w-full sm:w-2/3 max-w-4xl text-center sm:ml-8 space-y-4">
      <h1 className="text-4xl font-bold text-white">Welcome to Memo Meet!</h1>
      <p className="mt-4 text-white block">
        Connect and collaborate with your team effortlessly.
        <br />
        Create meetings with Memo Meet's powerful features designed for seamless
        communication.
      </p>
      {loggedIn ? (
        <div className="w-full flex flex-col sm:flex-row items-center text-center sm:items-start gap-4">
          <button
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-500"
            onClick={handleStartMeetingClick}
          >
            Create a new meeting!
          </button>
          {/* Separator */}
          <div className="hidden sm:block h-12 w-px bg-gray-300"></div>
          <div className="flex w-full sm:w-auto gap-2">
            <input
              type="text"
              className="text-black w-full sm:w-72 min-w-[250px] h-12 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter meeting code..."
              onChange={(e) => setMeetCode(e.target.value)} // Update state on input change
            ></input>
            <button
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-500"
              onClick={handleJoinClick}
            >
              Join!
            </button>
          </div>
        </div>
      ) : (
        <button
          className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-500"
          onClick={handleSignInClick}
        >
          Get Started!
        </button>
      )}
    </div>
  );
}
