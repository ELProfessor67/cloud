import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function CreateFolderDialog({ isOpen, onClose, onCreateFolder }) {
  const [folderName, setFolderName] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateFolder(folderName)
    setFolderName("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>Enter a name for the new folder.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="Enter folder name" />
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

