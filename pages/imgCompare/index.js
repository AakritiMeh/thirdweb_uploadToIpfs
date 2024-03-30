import React, { useState } from "react";

function ImageMetadataHasher() {
  const [userHash, setUserHash] = useState("");
  const [comparisonResult, setComparisonResult] = useState(null);

  const preStoredHash =
    "6966d334aaca87754249863632b43971d781a91be823184265d46bcac8f58528";

  const generateSHA256Hash = async (file) => {
    const buffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(digest));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const compareHashes = async (fileHash, storedHash) => {
    const areHashesEqual = fileHash === storedHash;

    setUserHash(fileHash);
    setComparisonResult(areHashesEqual);
    return areHashesEqual;
  };

  const handleFileSelection = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("No file selected.");
      return;
    }

    const fileHash = await generateSHA256Hash(file);
    compareHashes(fileHash, preStoredHash);
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelection} />
      {userHash && <p>SHA-256 Hash of Image: {userHash}</p>}
      {comparisonResult != null && (
        <p>
          Does the image match the stored hash?{" "}
          {comparisonResult ? "Yes" : "No"}
        </p>
      )}
    </div>
  );
}

export default ImageMetadataHasher;
