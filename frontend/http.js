import axios from "axios";

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});


export const loginRequest = async (email, password) => api.post("/users/login", { email, password });
export const loadMeRequest = async () => api.get("/users/me");
export const getDirAndFileRequest = async (folderId) => api.get(`/folders?folderId=${folderId}`);
export const createFolderRequest = async (name, parentFolderId) => api.post("/folders", { name, parentFolderId });
export const deleteFolderRequest = async (folderId) => api.delete("/folders", { data: { folderId } });
export const changeFolderNameRequest = async (folderId, newName) => api.put("/folders", { folderId, newName });
export const deleteFileRequest = async (fileId) => api.delete("/files", { data: { fileId } });
export const changeFileNameRequest = async (fileId, newName) => api.put("/files", { fileId, newName });
export const uploadFileRequest = async (formdata, setUpload) => api.post("/files/upload",formdata,{
    headers: {
        "Content-Type": "multipart/form-data"
    },
    onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded * 100) / progressEvent.total;
        if(progress < 80) {
            setUpload(progress);
        }else{
            setUpload(progress-3);
        }
    }
})

export const uploadStructureRequest = async (formdata, setUpload) => api.post("/files/upload-structure",formdata,{
    headers: {
        "Content-Type": "application/json"
    },
    onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded * 100) / progressEvent.total;
        if(progress < 80) {
            setUpload(progress);
        }else{
            setUpload(progress-3);
        }
    }
})