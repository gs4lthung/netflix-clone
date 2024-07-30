import React from 'react'
import HomeScreen from './HomeScreen';
import AuthScreen from './AuthScreen';
import { useAuthStore } from '../../store/authUser';

export default function HomePage() {
  const {user} = useAuthStore() as {user: JSON};
  return (
    <div>
      {user ? <HomeScreen /> : <AuthScreen />}
    </div>
  )
}
