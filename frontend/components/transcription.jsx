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


export function Transcription({ isOpen, onClose, selectedFile }) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedFile?.name}</DialogTitle>
          <DialogDescription>{selectedFile?.transcription}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

