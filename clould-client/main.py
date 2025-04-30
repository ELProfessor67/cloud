import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from google.cloud import storage
import os
import threading
import dotenv
dotenv.load_dotenv()
from services.transcription_service import Transcription
from services.parsefile_service import parse_cube_acr_filename
import os
import datetime
import mimetypes
from services.save_service import save_to_db

# Path to your service account key
service_account_json = 'google.json'
bucket_name = os.getenv('BUCKET_NAME')
transcription_service = Transcription()
transcription_service.load_model()

def manual_upload_with_progress(file_path, bucket_name, progress_callback=None):
    client = storage.Client.from_service_account_json(service_account_json)
    bucket = client.bucket(bucket_name)

    blob_name = os.path.basename(file_path)
    blob = bucket.blob(blob_name)
    blob.chunk_size = 100 * 1024 * 1024  # 100MB

    file_size = os.path.getsize(file_path)
    uploaded = 0

    # Open file in binary mode and upload manually
    with open(file_path, "rb") as f:
        # Use a resumable upload
        with blob.open("wb", timeout=600) as gcs_file:
            while True:
                chunk = f.read(1024 * 1024)  # 1 MB
                if not chunk:
                    break
                gcs_file.write(chunk)
                uploaded += len(chunk)
                if progress_callback:
                    progress_callback(uploaded, file_size)

    try:
        blob.make_public()
        return blob.public_url
    except:
        return f"https://storage.googleapis.com/{bucket_name}/{blob_name}"

def browse_file():
    file_path = filedialog.askopenfilename(title="Select a file to upload",filetypes=[
        ("Audio Files", "*.wav *.mp3 *.flac *.m4a *.aac"),
        ("All Files", "*.*")
    ])

    entry_file_path.delete(0, tk.END)
    entry_file_path.insert(0, file_path)

def start_upload():
    file_path = entry_file_path.get()
    if not file_path or not bucket_name:
        messagebox.showerror("Error", "Please provide both file path and bucket name.")
        return

    progress_bar["value"] = 0
    label_status.config(text="Starting upload...")

    threading.Thread(target=upload_file_with_progress, args=(file_path,)).start()

def upload_file_with_progress(file_path):
    def progress_callback(current, total):
        percent = (current / total) * 100
        progress_bar["value"] = percent
        label_status.config(text=f"Uploading... {int(percent)}%")
        root.update_idletasks()

    try:
        creation_time = os.path.getctime(file_path)
        readable_time = datetime.datetime.fromtimestamp(creation_time)
        file_creation_time = readable_time.isoformat()
        file_size = os.path.getsize(file_path)
        mime_type, _ = mimetypes.guess_type(file_path)
        
        filename = os.path.basename(file_path)
        parse_file_result = parse_cube_acr_filename(filename=filename)
        
        if parse_file_result == False:
            messagebox.showerror("Error","You can only upload cube ACR files.")
            return

        url = manual_upload_with_progress(file_path, bucket_name, progress_callback)
        label_status.config(text="✅ Upload Complete")
        
        #transcribe audio
        transcription = transcription_service.transcribe(file_path=file_path)
        
        data = {
            "createdAt": file_creation_time,
            "transcription": transcription,
            "file_url": url,
            "mimeType": mime_type,
            "fileSize":file_size,
            "label": parse_file_result.get("label"),
            "file_name": filename
        }
        
        save_to_db(data=data)

        messagebox.showinfo("Success", f"File uploaded successfully.\n\nURL:\n{url} \n {transcription}")
    except Exception as e:
        label_status.config(text="❌ Upload Failed")
        messagebox.showerror("Error", str(e))

# GUI setup
root = tk.Tk()
root.title("GCS File Upload with Progress")
root.geometry("500x150")

tk.Label(root, text="File Path:").grid(row=0, column=0, padx=10, pady=10, sticky='e')
entry_file_path = tk.Entry(root, width=50)
entry_file_path.grid(row=0, column=1, padx=10, pady=10)
tk.Button(root, text="Browse", command=browse_file).grid(row=0, column=2, padx=10)

progress_bar = ttk.Progressbar(root, orient="horizontal", length=400, mode="determinate")
progress_bar.grid(row=1, column=0, columnspan=3, padx=20, pady=10)

label_status = tk.Label(root, text="", font=("Arial", 10))
label_status.grid(row=2, column=0, columnspan=3, pady=5)

tk.Button(root, text="Upload", width=20, command=start_upload).grid(row=3, column=1, pady=0)
root.mainloop()


