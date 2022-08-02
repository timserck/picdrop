
import {useAuthValue} from './AuthProvider'
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const {currentUser} = useAuthValue()

  return (
    currentUser ? <Outlet /> : <Navigate replace to="/" />
  )
}