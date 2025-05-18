import { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";
import Loading from "./Loading";
import { ChildrenProps } from "@/types";
import { AuthContext } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children }: ChildrenProps) {
  const { userToken, refreshToken, isLoading } = useContext(AuthContext);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if (!userToken) {
        console.log("No access token found.");
        router.replace("/(auth)/welcome");
        return;
      }
  
      try {
        const decoded: { exp: number, iat: number } = jwtDecode(userToken);
        const now = Math.floor(Date.now() / 1000); 
        
        console.log("Issued at:", new Date(decoded.iat * 1000).toISOString());
        console.log("Expires at:", new Date(decoded.exp * 1000).toISOString());
        console.log("Now:", new Date(now * 1000).toISOString());
  
        if (decoded.exp < now) {
          console.log("Access token expired. Attempting refresh...");
          const refreshed = await refreshToken();
  
          if (!refreshed) {
            console.log("Refresh failed. Redirecting to welcome.");
            router.replace("/(auth)/welcome");
            return;
          } else {
            console.log("Access token refreshed successfully.");
          }
        } else {
          console.log("Access token is valid.");
        }
      } catch (err) {
        console.error("Token invalid or decoding failed:", err);
        router.replace("/(auth)/welcome");
        return;
      } finally {
        setCheckingAuth(false);
      }
    };
  
    validateToken();
  }, [userToken]);

  if (isLoading || checkingAuth) {
    return <Loading />;
  }

  return <>{children}</>;
}
