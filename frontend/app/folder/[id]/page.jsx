"use client"

import { use, useCallback, useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Search } from "@/components/search"
import { FileItemComponent } from "@/components/file-item"
import { RenameDialog } from "@/components/rename-dialog"
import { CreateFolderDialog } from "@/components/create-folder-dialog"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-react"
import { useUser } from "@/UserContext"
import { useRouter } from "next/navigation"
import { changeFileNameRequest, changeFolderNameRequest, createFolderRequest, deleteFileRequest, deleteFolderRequest, getDirAndFileRequest, uploadFileRequest, uploadStructureRequest } from "@/http"
import { toast } from "react-toastify"
import UploadingBar from "@/components/UploadingBar"
import { Transcription } from "@/components/transcription"
import PlayMusic from "@/components/PlayMusic"
import { parseCubeACRFilename } from "@/lib/parseCubeACRFilename"


export default function FileManager({ params }) {
  const { id } = use(params)
  const [files, setFiles] = useState([])
  const [isGridView, setIsGridView] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchResults, setSearchResults] = useState(files)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const { isAuthenticated, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(0);
  const [selectedTranscriptionFile, setSelectedTranscriptionFile] = useState(null);
  const [selectedMusicFile, setSelectedMusicFile] = useState(null);
  const [downloadId, setDownloadId] = useState(null);
  const router = useRouter();


  const getDirAndFile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDirAndFileRequest(id);
      setFiles(res.data);
      setSearchResults(res.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getDirAndFile();
  }, [id]);


  useEffect(() => {
    if (isAuthenticated == false) {
      router.push(`/`);
    }
  }, [isAuthenticated]);

  const handleCreateFolder = useCallback(async (folderName) => {
    try {
      const res = await createFolderRequest(folderName, id);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      getDirAndFile();
    }
  }, [id]);

  const handleUploadFile = useCallback(async (e) => {
    try {

      const file = e.target.files[0];

      
   


      console.log(file.name, parseCubeACRFilename(file.name), 'AAAAA');
      const lastModified = new Date(file.lastModified);
      const formdata = new FormData();
      formdata.set('file', file);
      formdata.set('folderId', id);
      formdata.set('createdAt', lastModified);

      const res = await uploadFileRequest(formdata, setFileUploading);
      toast.success(res.data.message);

    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally {
      setFileUploading(0);
      getDirAndFile()
    }
  }, [id]);

  const handleDelete = useCallback(async (id, type) => {
    try {
      if (type === "folder") {
        const res = await deleteFolderRequest(id);
        toast.success(res.data.message);
      } else {
        const res = await deleteFileRequest(id);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      getDirAndFile();
    }
  }, []);

  const handleRename = useCallback(async (newName, type) => {

    if (selectedFile) {
      try {
        if (selectedFile.type === "folder") {
          const res = await changeFolderNameRequest(selectedFile._id, newName);
          toast.success(res.data.message);
        } else {
          const res = await changeFileNameRequest(selectedFile._id, newName);
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      } finally {
        getDirAndFile();
      }
    }
  }, [selectedFile, files]);

  const handleSearch = (query) => {
    if (!query) {
      setSearchResults(files)
      return
    }

    const filtered = files.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()))
    setSearchResults(filtered)
  }

  const hanleOpenFolder = useCallback((folderId) => {
    console.log(folderId)
    router.push(`/folder/${folderId}`);
  }, []);



  const downloadMedia = useCallback(async (uri, fileName, id) => {
    setDownloadId(id)
    try {
      const response = await fetch(uri);

      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.statusText}`);
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error(`Error downloading media ${error.message}`);
    } finally {
      setDownloadId(id)
    }
  }, []);


  //on drop
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);

      reader.readAsDataURL(file); // Reads file as Base64
    });
  }





  const uploadFolderStructure = async (data) => {
    try {

      const res = await uploadStructureRequest({ folderId: id, folderData: data }, setFileUploading);


      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setFileUploading(0);
      await getDirAndFile();
    }
  };




  const handleDrop = useCallback(async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setFileUploading(1);

    const items = event.dataTransfer.items;
    const result = [];

    if (items) {
      for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry();
        if (entry) {
          const data = await traverseFileTree(entry);
          result.push(data);
        }
      }
    }

    await uploadFolderStructure(result);
  }, []);

  const traverseFileTree = async (item) => {
    if (item.isFile) {
      return new Promise((resolve) => {
        item.file(async (file) => resolve({
          type: "file",
          file: {
            mimeType: file.type,
            size: file.size,
            name: file.name,
            createdAt: file.lastModified,
            data: await fileToBase64(file)
          }
        }));
      });
    } else if (item.isDirectory) {
      const dirReader = item.createReader();
      const entries = await readAllEntries(dirReader);

      const children = await Promise.all(entries.map(traverseFileTree));
      return { type: "folder", name: item.name, child: children };
    }
  };

  const readAllEntries = (dirReader) => {
    return new Promise((resolve, reject) => {
      dirReader.readEntries((entries) => {
        if (entries.length) {
          resolve(entries);
        } else {
          resolve([]);
        }
      }, reject);
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Prevent default browser behavior
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <Header

        onCreateFolder={() => setIsCreateFolderDialogOpen(true)}
        onUploadFile={handleUploadFile}
        onSearchClick={() => setIsSearchOpen(true)}
      />
      <Search
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false)
          setSearchResults(files)
        }}
        onSearch={handleSearch}
      />
      <main
        className="p-4"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="max-w-7xl mx-auto min-h-screen">
          <div className="flex justify-end mb-4 md:mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsGridView(!isGridView)}
              className="hidden md:inline-flex"
            >
              {isGridView ? <List className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
            </Button>
          </div>
          <div className={`grid gap-4 ${isGridView ? "md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
            {searchResults.map((file) => (
              <FileItemComponent
                key={file._id}
                item={file}
                onOpenFolder={hanleOpenFolder}
                onDelete={handleDelete}
                setSelectedTranscriptionFile={setSelectedTranscriptionFile}
                setSelectedMusicFile={setSelectedMusicFile}
                downloadMedia={downloadMedia}
                downloadId={downloadId}
                onRename={() => {
                  setSelectedFile(file)
                  setIsRenameDialogOpen(true)
                }}
              />
            ))}
          </div>
          {searchResults.length === 0 && (
            <div className="text-center text-gray-500 mt-8">No files or folders found</div>
          )}
        </div>
      </main>
      <RenameDialog
        isOpen={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
        onRename={handleRename}
        currentName={selectedFile?.name || ""}
      />
      <CreateFolderDialog
        isOpen={isCreateFolderDialogOpen}
        onClose={() => setIsCreateFolderDialogOpen(false)}
        onCreateFolder={handleCreateFolder}
      />

      <UploadingBar
        open={fileUploading != 0}
        fileUploading={fileUploading}
      />

      <Transcription
        isOpen={!!selectedTranscriptionFile}
        onClose={() => setSelectedTranscriptionFile(null)}
        selectedFile={selectedTranscriptionFile}
      />


      <PlayMusic
        open={!!selectedMusicFile}
        onClose={() => setSelectedMusicFile(null)}
        selectedFile={selectedMusicFile}
      />
    </div>
  )
}

