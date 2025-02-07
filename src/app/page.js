"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { checkSession, createMeetCode } from "@/utils/api";
import Loader from "@/components/Loader";
import LandingPageNavBar from "@/components/LandingPageNavBar";
import LandingPageContent from "@/components/LandingPageContent";
import LandingPageImage from "@/components/LandingPageImage";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [meetCode, setMeetCode] = useState(""); // State to hold meeting code

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setTime(formattedTime);

      const options = { weekday: "short", day: "2-digit", month: "short" };
      const formattedDate = now.toLocaleDateString([], options);
      setDate(formattedDate);
    };

    updateTime();
    const timerId = setInterval(updateTime, 10000);
    // Check if the user is logged in
    const checkUserSession = async () => {
      const session = await checkSession();
      setLoggedIn(session); // Set the loggedIn state based on the result of checkSession
      setTimeout(() => setLoading(false), 100)
    };

    checkUserSession();
    return () => clearInterval(timerId);
  }, []);

  const router = useRouter();

  const handleStartMeetingClick = () => {
    createMeetCode().then((meetCode) => {
      setLoading(true)
      router.push(`/meet/${meetCode}`); // Navigate to the meeting room with the meeting code
    });
  }

  const handleSignInClick = () => {
    setLoading(true)
    router.push('/signin');
  };

  const handleJoinClick = () => {
    setLoading(true)
    router.push(`/meet/${meetCode}`); // Navigate to the meeting room with the meeting code
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)] min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 flex flex-col">
      {loading ? (<Loader />) : (
        <>
          <LandingPageNavBar time={time} date={date} />
          <main className="flex flex-col sm:flex-row items-center justify-center flex-grow">
            {/* Image Section */}
            <LandingPageImage />
            {/* Text and Buttons Section */}
            <LandingPageContent handleStartMeetingClick={handleStartMeetingClick} setMeetCode={setMeetCode} handleJoinClick={handleJoinClick} handleSignInClick={handleSignInClick} loggedIn={loggedIn} loading={loading}/>
          </main>
        </>
      )}
    </div>
  );
}
