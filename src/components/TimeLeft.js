import React, { useState, useEffect } from "react";

const TimeLeft = ({ fund }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (fund && fund.deadline) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const deadlineTime = new Date(parseInt(fund.deadline) * 1000).getTime();
        const distance = deadlineTime - now;

        if (distance < 0) {
          setTimeLeft("Time's up");
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      // Handle case where fund or deadline is undefined
      setTimeLeft("Loading...");
    }
  }, [fund]);

  if (!fund) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center">
      {timeLeft === "Time's up" ? (
        <p className="text-red-500">{timeLeft}</p>
      ) : (
        <>
          <span className="mr-2 text-green-500">Time Left:</span>
          <p className="text-green-500">{timeLeft}</p>
        </>
      )}
    </div>
  );
};

export default TimeLeft;
