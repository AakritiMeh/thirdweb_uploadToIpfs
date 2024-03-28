import { useCallback } from "react";
import { useStorageUpload } from "@thirdweb-dev/react";
import { ThirdwebProvider, ThirdwebStorage } from "@thirdweb-dev/react";
// Assuming you have these imports for a reason, keeping them
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
const Home = () => {
  const { mutateAsync: upload } = useStorageUpload();

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const uris = await upload({ data: acceptedFiles });
      console.log(uris);
    },
    [upload]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <button>Drop files here</button>
    </div>
  );
};

export default Home;
