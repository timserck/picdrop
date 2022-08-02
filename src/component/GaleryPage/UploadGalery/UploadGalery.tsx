import { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuthValue } from '../../../app/auth/AuthProvider';
import './UploadGalery.style.scss';
function UploadGalery(props: any) {
    const storage = getStorage();
    const { currentUser } = useAuthValue();


    const [imgUrl, setImgUrl] = useState<string | null>(null);
    const [progresspercent, setProgresspercent] = useState(0);


    const handleSubmit = (e: any) => {
        e.preventDefault()
        const file = e.target[0]?.files[0]
        if (!file) return;
        const storageRef = ref(storage, `${currentUser.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed",
            (snapshot) => {
                const progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgresspercent(progress);
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImgUrl(downloadURL)
                    props.handleUploadImage(downloadURL)
                });
            }
        );
    }


    return (
        <div className="uploadGalery">
            <form onSubmit={handleSubmit} className='form'>
                <input type='file' />
                <button type='submit'>Upload</button>
            </form>
            {
                !imgUrl &&
                <div className='outerbar'>
                    <div className='innerbar' style={{ width: `${progresspercent}%` }}>{progresspercent}%</div>
                </div>
            }
            {
                imgUrl &&
                <img className='uploadGalery_thumbnail' src={imgUrl} alt='uploaded file' />
            }
        </div>
    );
}

export default UploadGalery;
