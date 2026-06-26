// Cloudinary Upload
const CLOUD_NAME = "dpelr4eiw";
const UPLOAD_PRESET = "urbanvibe";

export async function uploadProductImage(productId, file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress?.((e.loaded / e.total) * 100);
      }
    });

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url);
      } else {
        reject(new Error("Cloudinary upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed"));

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    );

    xhr.send(formData);
  });
}

export async function uploadProductImages(productId, files, onFileProgress) {
  const urls = [];

  for (let i = 0; i < files.length; i++) {
    const url = await uploadProductImage(productId, files[i], (pct) =>
      onFileProgress?.(i, pct)
    );
    urls.push(url);
  }

  return urls;
}

// Delete is not supported with unsigned uploads.
export async function deleteImageByUrl() {
  return;
}