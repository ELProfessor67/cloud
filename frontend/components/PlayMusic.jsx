import React, { useCallback, useRef } from 'react'
import { Button } from './Button';
import { X } from 'lucide-react';

const PlayMusic = ({ open, onClose, selectedFile }) => {
    const audioRef = useRef(null);


    const handleClose = useCallback(async () => {
        audioRef?.current?.pause();
        onClose();
    }, [])
    return (
        <div className={`fixed top-0 left-0 right-0 bottom-0 h-[100vh] w-[100vw] items-end flex ${!open && 'hidden'}`}>
            <div className='h-[5rem] bg-gray-100 w-[100vw] shadow-md  rounded-t-md relative p-2 flex items-center justify-center'>
                <Button className="absolute right-5 top-2" variant="ghost" onClick={handleClose}><X/></Button>
            <audio src={selectedFile?.url} controls></audio>
            </div>
        </div>
    )
}

export default PlayMusic