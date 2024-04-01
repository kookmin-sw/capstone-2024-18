import {useEffect, useRef} from 'react';


type Callback = {(): void};

function useInterval(callback: Callback, delay: number | null) {
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  // Set up the interval.
  useEffect(() => {
    if (delay !== null) {
      intervalIdRef.current = setInterval(callback, delay);

      return () => clearInterval(intervalIdRef.current!);
    }
  }, [callback, delay]);

  return intervalIdRef.current; // intervalId 반환
}

export default useInterval;