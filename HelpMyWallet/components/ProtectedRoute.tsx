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
        const decoded: { exp: number } = jwtDecode(userToken);
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp < now) {
          console.log("Access token expired. Attempting refresh...");
          const refreshed = await refreshToken();

          if (!refreshed) {
            console.log("Refresh failed. Redirecting to welcome.");
            router.replace("/(auth)/welcome");
            return;
          }
        }

        console.log("Access token is valid.");
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
