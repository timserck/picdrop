import './GaleryPage.style.scss';
import { useAuthValue } from '../../app/auth/AuthProvider';
import { getAuth, signOut } from "firebase/auth";
import { ref, listAll, getDownloadURL, deleteObject, list } from "firebase/storage";
import { storage } from "../../app/firebase"
import { ChangeEvent, useEffect, useState } from 'react';
import UploadGalery from './UploadGalery/UploadGalery';
import DdlGalery from './DdlGalery/DdlGalery';
import { Pagination } from '@mui/material';

function GaleryPage() {

    const { currentUser } = useAuthValue();
    const listRef = ref(storage, currentUser.uid);
    const [imgs, setImgs] = useState<Array<any>>([])
    const [nbrPages, setNbrPages] = useState<number | null >(null)
    const [resultList, setresultList] = useState<any>({})
    const LIMIT_PAGINATION = 2

    const fetchAllImagesLength = async () => {
        const result = await (await listAll(listRef))
        setNbrPages(result.items?.length > 0  ? Math.floor(result.items.length / LIMIT_PAGINATION) : null)
    }

    const fetchImages = async () => {
        const result = await list(listRef, { maxResults: LIMIT_PAGINATION })
        setresultList(result)
    }
    const handlePageChange = async (event: ChangeEvent<unknown>, page: number) => {
        setImgs([])
        if (resultList.nextPageToken && page !== 1) {
            const secondPage = await list(listRef, {
                maxResults: LIMIT_PAGINATION,
                pageToken: resultList.nextPageToken,
            });
            setresultList(secondPage)
        } else {
            fetchImages()
        }
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
        fetchAllImagesLength()
        fetchImages();
    }, []);
    useEffect(() => {

        console.log(resultList)
        if (resultList.items) {
            resultList?.items.forEach((imageRef: any) => {
                getDownloadURL(imageRef)
                    .then(
                        (url: string) => {
                            setImgs((imgs) => [...imgs, url]);
                        }
                    )
            });
            console.log(resultList)
        }
        
    }, [resultList]);

    useEffect(() => {
        fetchAllImagesLength()
    }, [handleUploadImage, handledeleteImg])


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

            {currentUser.emailVerified && currentUser.email === "timserck@gmail.com" && <UploadGalery handleUploadImage={handleUploadImage} />}

            <DdlGalery />
            { nbrPages !== null && <Pagination onChange={handlePageChange} count={nbrPages} shape="rounded" />}

        </div>

    );
}

export default GaleryPage;
