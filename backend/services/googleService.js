import {Storage} from '@google-cloud/storage';
const storage = new Storage({
    keyFilename: 'google-services.json',
    projectId: 'just-coda-450112-b4'
});
const bucketName = 'elicloud12'; // Replace with your bucket name

// Function to upload a file to Google Cloud Storage and get its public URL
export async function uploadFileByFile(filePath) {
    try {
        const fileName = filePath.split('/').pop();

        // Upload the file to the bucket
        await storage.bucket(bucketName).upload(filePath, {
            destination: fileName,
        });

        console.log(`${fileName} uploaded to ${bucketName}.`);

        // Make the file public
        await storage.bucket(bucketName).file(fileName).makePublic();

        // Get the public URL of the uploaded file
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        console.log(`File available at: ${publicUrl}`);
        return publicUrl;
    } catch (err) {
        console.error('Error uploading file:', err);
    }
}

// Function to upload a Base64 string as a file to Google Cloud Storage and get its public URL
export async function uploadBase64ToGCS(base64String, fileName,mimetype) {
    try {
        // Decode the Base64 string into a binary buffer
        const buffer = Buffer.from(base64String, 'base64');

        // Upload the buffer to Google Cloud Storage
        const file = storage.bucket(bucketName).file(fileName);
        await file.save(buffer, {
            contentType: mimetype
        });

        console.log(`${fileName} uploaded to ${bucketName}.`);

        // Make the file public
        file.makePublic(); // Remove this line


        // Get the public URL of the uploaded file
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        console.log(`File available at: ${publicUrl}`);
        return publicUrl;

    } catch (err) {
        console.error('Error uploading file:', err);
    }
}
