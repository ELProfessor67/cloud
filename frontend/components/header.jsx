import { ArrowLeft, Search, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCallback } from "react"
import { useRouter } from "next/navigation";




export function Header({  onCreateFolder, onUploadFile, onSearchClick }) {
  const router = useRouter();
  const handleGoBack = useCallback(() => {
    router.back();
  },[])
  return (
    <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 space-y-4">
      <input
        type="file"
        className="hidden"
        onChange={onUploadFile}
        id="file"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">

          <Button variant="ghost" size="icon" className="text-white" onClick={handleGoBack}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Folder</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white" onClick={onSearchClick}>
            <Search className="h-6 w-6" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <MoreVertical className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">

              <DropdownMenuItem onClick={onCreateFolder}>Create Folder</DropdownMenuItem>
              <DropdownMenuItem><label htmlFor="file">Upload File</label></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

