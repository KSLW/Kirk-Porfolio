import { useEffect, useState } from "react";
export default function BackToTop(){
  const [visible, setVisible] = useState(false);
  useEffect(()=>{
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  },[]);
  const scrollToTop = () => window.scrollTo({top:0, behavior:'smooth'});
  if(!visible) return null;
  return <button onClick={scrollToTop} className="back-to-top" aria-label="Back to top">↑</button>;
}
