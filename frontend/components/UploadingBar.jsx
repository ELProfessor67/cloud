import React from 'react'

const UploadingBar = ({ open,fileUploading }) => {
    return (
        <div className={`fixed top-0 left-0 right-0 bottom-0 h-[100vh] w-[vw] z-50 flex items-center justify-center px-10 bg-black/20 ${!open && 'hidden'}`}>

            <div class="w-full bg-gray-200 rounded-full">
                <div class="bg-purple-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: `${fileUploading}%`}}> {fileUploading}%</div>
            </div>

        </div>
    )
}

export default UploadingBar