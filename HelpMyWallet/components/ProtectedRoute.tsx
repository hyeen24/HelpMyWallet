import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import api from '@/app/api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '@/constants/constants';
import { useEffect, useState, ReactNode } from 'react';
import Loading from './Loading';
import { ChildrenProps } from '@/types';

export default function ProtectedRoute({ children }: ChildrenProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      const decoded: any = jwtDecode(token);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;

      if (tokenExpiration && tokenExpiration < now) {
        await refreshToken();
      } else {
        setIsAuthorized(true);
      }
    };

    const refreshToken = async () => {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      try {
        const res = await api.post('/api/token/refresh/', { refresh: refreshToken });
        if (res.status === 200) {
          localStorage.setItem(ACCESS_TOKEN, res.data.access);
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.log(error);
        setIsAuthorized(false);
      }
    };

    auth();
  }, []);
  
  useEffect(() => {
    if (isAuthorized === false) {
      router.replace('/(auth)/login'); // use replace to avoid going back
    }
  }, [isAuthorized]);

  if (isAuthorized === null || isAuthorized === false) {
    return <Loading />; // or return null
  }

  return <>{children}</>;
}
