import { useEffect, useState } from "react";
export default function ThemeToggle(){
  const [theme, setTheme] = useState('dark');
  useEffect(()=>{
    const saved = localStorage.getItem('theme');
    if(saved === 'light'){
      document.body.classList.add('light');
      setTheme('light');
    }
  },[]);
  const toggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.classList.toggle('light', newTheme === 'light');
    localStorage.setItem('theme', newTheme);
  };
  return <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">{theme==='dark'?'🌞':'🌙'}</button>;
}
