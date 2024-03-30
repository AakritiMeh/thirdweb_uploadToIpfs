import { useCallback, useState } from "react";
import { useStorageUpload } from "@thirdweb-dev/react";
import { ThirdwebProvider, ThirdwebStorage } from "@thirdweb-dev/react";
// Assuming you have these imports for a reason, keeping them
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
const Home = () => {
  const { mutateAsync: upload } = useStorageUpload();
  const [uploadedFileUri, setUploadedFileUri] = useState(null);
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const uris = await upload({ data: acceptedFiles });
      console.log(uris);
      console.log("https://ipfs.io/ipfs/" + uris[0].slice(7));
      setUploadedFileUri("https://ipfs.io/ipfs/" + uris[0].slice(7));
    },
    [upload]
  );
  const handleDownload = useCallback(() => {
    if (uploadedFileUri) {
      fetch(uploadedFileUri)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "uploaded_file");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Error downloading the file:", error);
        });
    }
  }, [uploadedFileUri]);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <button>Drop files here</button>
      <button onClick={handleDownload} disabled={!uploadedFileUri}>
        Download uploaded file
      </button>
    </div>
  );
};

export default Home;
