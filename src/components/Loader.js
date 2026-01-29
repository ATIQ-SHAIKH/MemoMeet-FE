import '@/styles/loader.css';

// Default values shown

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="container">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
    </div>
  );
};

export default Loader;
