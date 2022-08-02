import {useAuthValue} from '../../../app/auth/AuthProvider'
import './DdlGalery.style.scss';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  getStorage,
  listAll,
  ref,
  getDownloadURL,
  getMetadata,
} from 'firebase/storage';

function DdlGalery(props: any) {

  const { currentUser } = useAuthValue();


    const downloadFolderAsZip = async () => {
        const jszip = new JSZip();
        const storage = getStorage();
        const folderRef = ref(storage, currentUser.uid);
        const folder = await listAll(folderRef);
        console.log(folder)
        const promises = folder.items
          .map(async (item) => {
            const file = await getMetadata(item);
            const fileRef = ref(storage, item.fullPath);
            const fileBlob = await getDownloadURL(fileRef).then((url) => {
              console.log(url, "test")
              return fetch(url).then((response) => response.blob());
            });
            jszip.file(file.name, fileBlob);
          })
          .reduce((acc, curr) => acc.then(() => curr), Promise.resolve());
        await promises;
        const blob = await jszip.generateAsync({ type: 'blob' });
        saveAs(blob, 'download.zip');
      };


    return (
        <div className="galeryDdl">

            <button onClick={downloadFolderAsZip}>Telecharger tout</button>

        </div>
    );
}

export default DdlGalery;
