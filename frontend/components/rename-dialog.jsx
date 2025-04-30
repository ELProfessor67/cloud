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


export function RenameDialog({ isOpen, onClose, onRename, currentName }) {
  const [newName, setNewName] = useState(currentName)

  const handleSubmit = (e) => {
    e.preventDefault()
    onRename(newName)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Item</DialogTitle>
          <DialogDescription>Enter a new name for the item.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Enter new name" />
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Rename</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

