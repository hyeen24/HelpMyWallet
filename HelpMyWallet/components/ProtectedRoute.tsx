import { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";
import Loading from "./Loading";
import { ChildrenProps } from "@/types";
import { AuthContext } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children }: ChildrenProps) {
  const { userToken, refreshToken, isLoading } = useContext(AuthContext);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  // console.log("userToken: ",userToken)
  // console.log("isAuthorized: ",isAuthorized)
  
  useEffect(() => {
    const validateToken = async () => {
      if (!userToken) {
        setIsAuthorized(false);
        return;
      }

      try {
        const decoded: any = jwtDecode(userToken);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          const refreshed = await refreshToken();
          setIsAuthorized(refreshed);
        } else {
          setIsAuthorized(true);
        }
      } catch (err) {
        console.error("Token decode failed:", err);
        setIsAuthorized(false);
      }
    };

    validateToken();
  }, [userToken]);

  useEffect(() => {
    if (isAuthorized === false) {
      router.replace("/(auth)/welcome");
    }
  }, [isAuthorized]);

  if (isLoading || isAuthorized === null) {
    return <Loading />;
  }

  return <>{children}</>;
}
