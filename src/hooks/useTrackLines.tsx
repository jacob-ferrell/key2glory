import { useEffect, useRef, useState } from "react";


export default function useTrackLines() {
  const nextCharRef = useRef<HTMLDivElement>(null);
  const prevCharRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerTop, setContainerTop] = useState(0);
  const [nextCharTop, setNextCharTop] = useState(0);

  useEffect(() => {
    function handleResize() {
        setNextCharTop(nextCharRef.current!.offsetTop);
        setContainerTop(containerRef.current!.offsetTop);
    }
    window.addEventListener("resize", handleResize);

    return () => {
        window.removeEventListener("resize", handleResize);
    }
  }, []);

  


  useEffect(() => {
    if (!nextCharRef.current || !containerRef.current) return;
    setNextCharTop(nextCharRef.current!.offsetTop);
  }, [nextCharRef.current]);
  return { nextCharRef, prevCharRef, containerRef, transformY: containerTop - nextCharTop};
}
