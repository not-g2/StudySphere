import { useEffect, Dispatch, SetStateAction } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// Define your session type. Replace 'any' with a proper interface if you have one.
type Session = any;

const useSessionCheck = (setSession: Dispatch<SetStateAction<Session>>): void => {
  const router = useRouter();

  useEffect(() => {
    const sessionData = Cookies.get("session");
    if (sessionData) {
      setSession(JSON.parse(sessionData));
    } else {
      router.push("/auth/signin");
    }
  }, [router, setSession]);
};

export default useSessionCheck;
