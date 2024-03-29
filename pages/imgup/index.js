import React, { useCallback, useState, useEffect } from "react";

import { useStorageUpload } from "@thirdweb-dev/react";
import { useDropzone } from "react-dropzone";
import { handleUris, fetchAndDisplayImageCids } from "./externalFunction";
const Cut = () => {
  const [uris, setUris] = useState([]);
  const { mutateAsync: upload } = useStorageUpload();

  function divideFileIntoParts(file) {
    const file1 = new Blob([file], { type: file.type });
    return new Promise((resolve, reject) => {
      const parts = [];
      const reader = new FileReader();

      reader.onload = function (e) {
        const buffer = e.target.result;

        const totalLength = buffer.byteLength;
        const partLength = totalLength / 10;

        for (let i = 0; i < 10; i++) {
          const start = i * partLength;
          let end = start + partLength;

          if (i === 9) end = totalLength;

          const partBuffer = buffer.slice(start, end);
          const blob = new Blob([partBuffer], { type: file.type });

          const newFile = new File([blob], `file${i + 1}`, { type: file.type });
          parts.push(newFile);
        }
        resolve(parts);
      };

      reader.onerror = (error) => reject(error);

      reader.readAsArrayBuffer(file1);
    });
  }

  //   const onDrop = useCallback(
  //     (acceptedFile) => {
  //       return new Promise((resolve, reject) => {
  //         // Return a promise from onDrop
  //         divideFileIntoParts(acceptedFile)
  //           .then((parts) => {
  //             const uris = [];
  //             const processPart = (index) => {
  //               if (index < parts.length) {
  //                 upload({ data: [parts[index]] })
  //                   .then((uri) => {
  //                     uris.push(uri);
  //                     console.log(`Uploaded part URI: ${uri}`);
  //                     processPart(index + 1); // Process the next part
  //                   })
  //                   .catch((error) => {
  //                     console.error("Error uploading file part to IPFS:", error);
  //                   });
  //               } else {
  //                 resolve(uris); // Resolve the promise with the URIs once all parts are processed
  //               }
  //             };
  //             processPart(0);
  //           })
  //           .catch((error) => {
  //             console.error(
  //               "Error processing or uploading file part to IPFS:",
  //               error
  //             );
  //             reject(error); // Reject the promise on error
  //           });
  //       });
  //     },
  //     [upload]
  //   );

  const onDrop = useCallback(
    async (acceptedFiles) => {
      acceptedFiles.forEach(async (file) => {
        try {
          const parts = await divideFileIntoParts(file);
          const uploadPromises = parts.map((part) => upload({ data: [part] }));
          const uris = await Promise.all(uploadPromises);
          setUris(uris); // Update state with URIs
        } catch (error) {
          console.error(
            "Error processing or uploading file part to IPFS:",
            error
          );
        }
      });
    },
    [upload]
  );

  useEffect(() => {}, [uris]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // useEffect(() => {
  //   const cids = [
  //     "ipfs://QmVy2dQWARnra4jquBTvtPLhLRBZN5VC1SMRGBy4dCFXJq/file1",
  //     "ipfs://QmdymfRwqJaF1BBvm1u4T99AL3ZV1W57heL378xfgRwoXD/file2",
  //     "ipfs://QmRGKdtRd9cmHhjucKAMScmhLM4yv7DpAUpNKDipKJEv6Z/file3",
  //     "ipfs://QmT3RWcmFgFrSrdpVM8uwyyjEXqpgPWBCCk62tDqgCzU79/file4",
  //     "ipfs://QmVR6Wd47ukYBBHJdfVgtKcQP3tNiGkm6YY6jxRTw9GK8S/file5",
  //     "ipfs://QmSoZCtnfsTSHAGv8H7eAhmtNZ5cLrgMZbfmnFX8R5yAX6/file6",
  //     "ipfs://QmTkx7DC4ftKpEwmJTF6bMmFGo4LNv2vkhtVAVww91iLXk/file7",
  //     "ipfs://QmdAoVsNjwoND5tZ2Ncudqe68AL7hQaRiNW6QJz8cjjPFG/file8",
  //     "ipfs://QmSeXbe8FkNfTAQJEbrTTmKWsu3xYhtziGGmLo8YYEKMMh/file9",
  //     "ipfs://QmPgh98xPA3JSfQxowaRd6c2muEV2Ho38NYRtBEmNkgb8U/file10",
  //   ];

  //   fetchAndDisplayImageCids(cids);
  // }, []);

  const handleButtonClick = () => fetchAndDisplayImageCids(uris);

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drop files here, or click to select files</p>
      <button onClick={handleButtonClick}>Display Combined Image</button>
    </div>
  );
};

export default Cut;
