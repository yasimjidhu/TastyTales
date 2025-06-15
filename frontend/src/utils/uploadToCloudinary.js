import Constants from 'expo-constants';


export const uploadToCloudinary = async (imageUri) => {

    const CLOUDINARY_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_CLOUDINARY_URL;
    if (!CLOUDINARY_URL) {
      throw new Error('Cloudinary URL is not defined in the environment variables');
    }
    if (!imageUri) {
      throw new Error('Image URI is required for upload');
    }
    const data = new FormData();
    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    data.append('upload_preset', 'recipes_images'); 
  
    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (result.error) {
        throw new Error(result.error.message || 'Upload failed');
      }
      return result.secure_url; 
    } catch (err) {
      console.error('Upload failed:', err);
      throw err;
    }
  };
  