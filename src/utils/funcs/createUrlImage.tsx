"use client";

const fileURL = (
  event: React.ChangeEvent<HTMLInputElement>,
  callback: (url: string | undefined) => void
) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const validTypes = ["image/jpeg", "image/png"];
  if (!validTypes.includes(file.type)) {
    console.error("Invalid file type. Only JPEG and PNG are allowed.");
    return;
  }

  const reader = new FileReader();
  reader.onload = async () => {
    const result = reader.result;
    if (typeof result === "string") {
      const image = await compressImage(result, file.type);
      callback(image);
    }
  };
  reader.readAsDataURL(file);
};

const compressImage = async (image: string, mimeType: string) => {
  return new Promise<string>((resolve) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      console.warn("compressImage called outside browser environment.");
      resolve(image);
      return;
    }

    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Canvas context is not available.");
        resolve(image);
        return;
      }

      const maxWidth = 1000;
      const maxHeight = 1000;
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > maxWidth) {
          width = maxWidth;
          height = maxWidth / aspectRatio;
        }
        if (height > maxHeight) {
          height = maxHeight;
          width = maxHeight * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.9;
      let dataURL = canvas.toDataURL(
        mimeType === "image/png" ? "image/png" : "image/jpeg",
        quality
      );

      while (dataURL.length > 50000 && quality > 0.1) {
        quality -= 0.1;
        dataURL = canvas.toDataURL("image/jpeg", quality);
      }

      resolve(dataURL);
    };

    // Also handle image load error case (optional)
    img.onerror = () => {
      console.error("Failed to load image for compression.");
      resolve(image);
    };
  });
};

export default fileURL;
