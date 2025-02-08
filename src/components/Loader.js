import { quantum } from 'ldrs'

quantum.register()

// Default values shown

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
      <l-quantum
        size="45"
        speed="1.75"
        color="white"
        className="flex items-center justify-center"
      ></l-quantum>
    </div>
  );
};

export default Loader;

