const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD}/auto/upload`

const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', "chat-app-file")
    
    const response = await fetch(url, {
        method: 'POST',
        body: formData
    })
    const responseData = await response.json()
    
    if (responseData.secure_url) {
        return responseData.secure_url;  // Use HTTPS URL
    } else {
        return responseData.url.replace("http://", "https://");  // Fallback fix
    }
}

export default uploadFile

