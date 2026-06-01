import { useEffect } from "react";

const VUE_RESUME_URL = "https://vue-resume-portfolio.vercel.app";

export default function Resume() {
  useEffect(() => {
    window.location.replace(VUE_RESUME_URL);
  }, []);

  return null;
}