from google.cloud import storage
import os

# Path to your service account key
service_account_json = 'google.json'

def upload_to_gcs(file_path, bucket_name, blob_name=None):
    # Initialize GCS client
    storage_client = storage.Client.from_service_account_json(service_account_json)

    # Use file name if no blob_name is specified
    blob_name = blob_name or os.path.basename(file_path)

    # Get the bucket
    bucket = storage_client.bucket(bucket_name)

    # Create blob and set chunk size for large file uploads (100 MB)
    blob = bucket.blob(blob_name)
    blob.chunk_size = 100 * 1024 * 1024  # 100MB chunks

    # Upload the file with extended timeout
    print(f"Uploading {file_path} to bucket {bucket_name} as {blob_name}...")
    blob.upload_from_filename(file_path, timeout=600)  # 10-minute timeout

    try:
        # Optional: make it public (works only if bucket allows it)
        blob.make_public()
        public_url = blob.public_url
    except Exception as e:
        print("Warning: Couldn't make the file public automatically:", e)
        public_url = f"https://storage.googleapis.com/{bucket_name}/{blob_name}"

    return public_url

# Replace with your file and bucket
file_path = r"test.txt"
bucket_name = 'eli-1'

public_url = upload_to_gcs(file_path, bucket_name)
print(f"\n✅ File uploaded successfully.\nPublic URL: {public_url}")
