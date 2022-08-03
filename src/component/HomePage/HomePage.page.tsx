import './HomePage.style.scss';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import {useAuthValue} from '../../app/auth/AuthProvider'

function HomePage() {

    const provider = new GoogleAuthProvider();
    let navigate = useNavigate();
    const { currentUser } = useAuthValue();
    

    function handleSignGoogle() {
        const auth = getAuth();
        auth.languageCode = 'fr';
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                // The signed-in user info.
                const user = result.user;
                navigate(`/${user.uid}/galery`, { replace: true });
                // ...
            }).catch((error) => {
                console.log(error)
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }

    return (
        <div className="homePage">

            <button onClick={handleSignGoogle}>connect with google</button>

        </div>
    );
}

export default HomePage;
