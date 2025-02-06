import { FileIcon, FolderIcon, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import moment from 'moment'

function bytesToMB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function FileItemComponent({ item, onDelete, onRename,onOpenFolder,setSelectedTranscriptionFile, setSelectedMusicFile, downloadMedia, downloadId }) {
  return (
    <div className={`bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm `} key={item._id}>
      {item.type === "folder" ? (
        <FolderIcon className="h-10 w-10 text-purple-500" />
      ) : (
        <FileIcon className="h-10 w-10 text-purple-500" />
      )}
      <div className={`flex-1 min-w-0 ${item.type == "folder" && 'cursor-pointer'}`} onClick={item.type == "folder" ? () => onOpenFolder(item._id) : () =>{}} >
        <h3 className="font-medium truncate">{item.name}</h3>
        <p className="text-sm text-gray-500">
          {item.size && `${bytesToMB(item.size)}, `}
          {moment(item.createdAt).format("LLL")}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onRename(item._id,item.type)}>Rename</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(item._id,item.type)} className="text-red-600">
            Delete
          </DropdownMenuItem>
          {
            item.mimeType?.includes('audio') && (
              <>
                <DropdownMenuItem onClick={() => setSelectedTranscriptionFile(item)}>Transcribe</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedMusicFile(item)}>Play</DropdownMenuItem>
              </>
            )
          }
          {
            item.type == "file" && (
              // <DropdownMenuItem onClick={() => downloadMedia(item.url,item.name, item._id)}>{downloadId ? "Downloading...": "Download"}</DropdownMenuItem>
              <DropdownMenuItem><a href={item.url} target="_blank">OPEN</a></DropdownMenuItem>
            )
          }
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

