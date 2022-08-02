import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import { onAuthStateChanged } from 'firebase/auth'
import HomePage from './component/HomePage/HomePage.page';
import PrivateRoute from './app/auth/PrivateRoute'
import { AuthProvider } from './app/auth/AuthProvider';
import { auth } from './app/firebase'
import GaleryPage from './component/GaleryPage/GaleryPage.page';
function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [timeActive, setTimeActive] = useState(false)

    useEffect(() => {
        onAuthStateChanged(auth, (user: any) => {
            console.log(user, "user")
            setCurrentUser(user)
        })
    }, [])

    return (
        <Router>
            <AuthProvider value={{ currentUser, timeActive, setTimeActive }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path={"/:uid/galery"} element={<PrivateRoute />}>
                        <Route path="/:uid/galery" element={<GaleryPage />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default App


