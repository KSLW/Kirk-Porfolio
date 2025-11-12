import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    const onKey = (e) => {
      if (e.shiftKey && e.key.toLowerCase() === "t") scrollToTop();
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div aria-live="polite">
      {visible && (
        <button
          onClick={scrollToTop}
          className={`back-to-top visible`}
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}
