import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './storageClient.js';

// Stored at: products/{productId}/{timestamp}-{filename}
export function uploadProductImage(productId, file, onProgress) {
  return new Promise((resolve, reject) => {
    const path = `products/${productId}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      'state_changed',
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(pct);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

export async function uploadProductImages(productId, files, onFileProgress) {
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    const url = await uploadProductImage(productId, files[i], (pct) => onFileProgress?.(i, pct));
    urls.push(url);
  }
  return urls;
}

// Accepts a Firebase Storage download URL directly — the SDK resolves it
// back to the right file reference.
export async function deleteImageByUrl(downloadUrl) {
  try {
    const fileRef = ref(storage, downloadUrl);
    await deleteObject(fileRef);
  } catch (err) {
    // Non-fatal — the product can still be saved even if cleanup of an old
    // image file fails (e.g. already deleted, or a placeholder path).
    console.warn('[UrbanVibe] Could not delete storage file:', err.message);
  }
}
