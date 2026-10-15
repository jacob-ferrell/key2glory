import { useEffect } from "react";

export default function useTitle(title: string | null) {
  useEffect(() => {
    document.title = title ? `${title} · Key2Glory` : "Key2Glory";
  }, [title]);
}
