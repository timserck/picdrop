import './GaleryPage.style.scss';
import { useAuthValue } from '../../app/auth/AuthProvider';
import { getAuth, signOut } from "firebase/auth";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../../app/firebase"
import { useEffect, useState } from 'react';
import UploadGalery from './UploadGalery/UploadGalery';
import DdlGalery from './DdlGalery/DdlGalery';

function GaleryPage() {

    const { currentUser } = useAuthValue();
    const listRef = ref(storage, currentUser.uid);
    const [imgs, setImgs] = useState<Array<string>>([])

    const fetchImages = async () => {

        const result = await listAll(listRef)
        result.items.forEach((imageRef: any) => {
            getDownloadURL(imageRef)
                .then(
                    (url: string) => {
                        setImgs((imgs) => [...imgs, url]);
                    }
                )
        });

    }

    function handleSignOut() {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }

    function handleUploadImage(url: string) {
        setImgs((imgs) => [...imgs, url]);
    }

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div className="GaleryPage">
            <p>{currentUser.email}</p>
            <button onClick={handleSignOut}>Sign out</button>
            <ul>
                {imgs.map((img, index) => (
                    <li key={index}><img src={img} alt={img} /></li>
                )
                )}
            </ul>

            {currentUser.emailVerified && currentUser.email === "timserck@gmail.com" &&
                <UploadGalery handleUploadImage={handleUploadImage} />}

            <DdlGalery />

        </div>

    );
}

export default GaleryPage;
