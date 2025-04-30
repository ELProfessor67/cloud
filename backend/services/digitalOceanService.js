import AWS from 'aws-sdk';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config(); // Load environment variables from .env file

const spacesEndpoint = new AWS.Endpoint(process.env.ENDPOINT_URL);

const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: 'nyc3', // Make sure this is the correct region for your Space
    signatureVersion: 'v4',
});

// Function to upload a file from a local file path
// export async function uploadFileByFile(filePath) {
//     try {
//         const fileContent = fs.readFileSync(filePath); // Read file content

//         const fileName = path.basename(filePath); // Extract file name from path

//         // Upload parameters
//         const uploadParams = {
//             Bucket: process.env.BUCKET_NAME,  // Your Space's name
//             Key: fileName,                    // The file's name in the Space
//             Body: fileContent,                // The content of the file
//             ACL: 'public-read',               // File visibility (optional)
//         };

//         // Upload the file
//         const data = await s3.upload(uploadParams).promise();

//         // Return the public URL of the uploaded file
//         const publicUrl = `https://${process.env.BUCKET_NAME}.${process.env.ENDPOINT_URL.replace('https://', '')}/${fileName}`;
//         return publicUrl;

//     } catch (err) {
//         console.error('Error uploading file:', err);
//         throw new Error('File upload failed');
//     }
// }


export async function uploadFileByFile( filePath, key, acl = 'public-read' ) {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at path: ${filePath}`);
        }

        const fileStream = fs.createReadStream(filePath);
        const fileName = key || path.basename(filePath);

        const uploadParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            Body: fileStream,
            ACL: acl,
        };

        const data = await s3.upload(uploadParams).promise();

        const publicUrl = `https://${process.env.BUCKET_NAME}.${process.env.ENDPOINT_URL.replace('https://', '')}/${fileName}`;
        return publicUrl;

    } catch (err) {
        console.error('File upload failed:', err);
        throw err;
    }
}

// Function to upload a Base64 string as a file to DigitalOcean Spaces and get its public URL
export async function uploadBase64ToDG(base64String, fileName, mimetype) {
    try {
        const buffer = Buffer.from(base64String, 'base64'); // Decode base64 string to buffer

        const uploadParams = {
            Bucket: process.env.BUCKET_NAME,  // Your Space's name
            Key: fileName,                    // File name in the Space
            Body: buffer,                     // The file content as buffer
            ACL: 'public-read',               // File visibility (optional)
            ContentType: mimetype,            // MIME type of the file
        };

        // Upload the base64-decoded file to the Space
        const data = await s3.upload(uploadParams).promise();

        // Return the public URL of the uploaded file
        const publicUrl = `https://${process.env.BUCKET_NAME}.${process.env.ENDPOINT_URL.replace('https://', '')}/${fileName}`;
        return publicUrl;

    } catch (err) {
        console.error('Error uploading file:', err);
        throw new Error('Base64 upload failed');
    }
}
