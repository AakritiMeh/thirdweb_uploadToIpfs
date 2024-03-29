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
    const combinedBlob = new Blob(blobs, { type: "application/octet-stream" });
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
    })
    .catch((error) => {
      console.error("Error combining image parts:", error);
    });
}
