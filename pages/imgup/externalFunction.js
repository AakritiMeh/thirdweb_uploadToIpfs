export function handleUris(uris) {
  console.log("Received URIs:", uris);
}

function fetchBlobFromCid(cid) {
  // Remove the "ipfs://" scheme if present
  cid = cid[0];
  const formattedCid = cid.replace("ipfs://", "");
  return fetch(`https://ipfs.io/ipfs/${formattedCid}`).then((response) => {
    if (!response.ok) throw new Error("Failed to fetch");
    return response.blob();
  });
}

function combineBlobsFromCids(cids) {
  return Promise.all(cids.map((cid) => fetchBlobFromCid(cid))).then((blobs) => {
    const commonType =
      blobs.length > 0 ? blobs[0].type : "application/octet-stream";
    const combinedBlob = new Blob(blobs, { type: commonType });
    console.log(combinedBlob);
    return combinedBlob;
  });
}

function displayImage(blob) {
  const url = URL.createObjectURL(blob);
  const img = document.createElement("img");
  img.src = url;
  img.onload = () => {
    URL.revokeObjectURL(url);
  };
  document.body.appendChild(img);
}

export function fetchAndDisplayImageCids(uris) {
  console.log("-----------------------------------------------:", uris);
  combineBlobsFromCids(uris)
    .then((combinedBlob) => {
      displayImage(combinedBlob);
      const blobType = combinedBlob.type || "application/octet-stream";
      const fileExtension = blobType.split("/")[1] || "bin"; // Default extension if not determinable
      const fileName = `combined-file.${fileExtension}`;
      const url = URL.createObjectURL(combinedBlob);

      // Create a temporary <a> element to trigger the download
      const a = document.createElement("a");
      document.body.appendChild(a); // Append the element to the document
      a.style = "display: none"; // Hide the element
      a.href = url;
      a.download = fileName; // Name of the file to be downloaded
      a.click(); // Trigger the download

      // Clean up by revoking the blob URL and removing the <a> element
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    })
    .catch((error) => {
      console.error("Error combining image parts:", error);
    });
}
