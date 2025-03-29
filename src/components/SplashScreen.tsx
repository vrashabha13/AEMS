import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      onComplete();
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-[#004E98] flex items-center justify-center transition-opacity duration-500 z-50 ${
        animationComplete ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <img
            src="/src/utils/aemslogolight.png"
            alt="AEMS Logo"
            className="w-auto h-auto animate-bounce"
          />
        </div>
        <div className="relative">
          <h1 className="text-6xl font-bold text-white tracking-wider">
            <span className="inline-block animate-[slideIn_1s_ease-out] opacity-0 [animation-fill-mode:forwards]">
              A
            </span>
            <span className="inline-block animate-[slideIn_1s_ease-out_0.2s] opacity-0 [animation-fill-mode:forwards]">
              E
            </span>
            <span className="inline-block animate-[slideIn_1s_ease-out_0.4s] opacity-0 [animation-fill-mode:forwards]">
              M
            </span>
            <span className="inline-block animate-[slideIn_1s_ease-out_0.6s] opacity-0 [animation-fill-mode:forwards]">
              S
            </span>
          </h1>
          <p className="text-white text-xl mt-4 animate-[fadeIn_2s_ease-out_1s] opacity-0 [animation-fill-mode:forwards]">
            Advanced Examination Management System
          </p>
        </div>
      </div>
    </div>
  );
}
