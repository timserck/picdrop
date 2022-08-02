import './GaleryPage.style.scss';
import { useAuthValue } from '../../app/auth/AuthProvider';
import { getAuth, signOut } from "firebase/auth";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
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

    function handledeleteImg(url: string) {
        setImgs((imgs) => imgs.filter(img => img !== url))

        const currentImage = ref(storage, url);

        // Delete the file
        deleteObject(currentImage).then(() => {
            // File deleted successfully
        }).catch((error) => {
            // Uh-oh, an error occurred!
        });

    }

    useEffect(() => {
        fetchImages();
    }, []);

    // useEffect(() => {
    //     setImgs([])
    //     fetchImages();
    // }, [imgs]);

    return (
        <div className="galeryPage">
            <p>{currentUser.email}</p>
            <button onClick={handleSignOut}>Sign out</button>
            <ul className='list'>
                {imgs.map((img, index) => (
                    <li className='list_li' key={index}>

                        <img className='list_img' src={img} alt={img} />
                        <div>
                            <button onClick={e => handledeleteImg(img)}>delete image</button>
                        </div>

                    </li>
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
