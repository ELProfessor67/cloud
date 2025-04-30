import { createClient } from "@deepgram/sdk";
import "dotenv/config";
import fs from 'fs'
import { buffer } from "stream/consumers";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);


export const transcribeAudio = async (uri) => {
    try {
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
            fs.readFileSync(uri),
            {
              model: "nova-2",
            }
        );

        if(error){
            console.log(error)
            return null;
        }
      
        return result.results.channels[0]?.alternatives[0]?.transcript
    } catch (error) {
        console.log(error.message);
        return null;
    }
}


export const transcribeAudioFromURL = async (base64) => {
    try {
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
            Buffer.from(base64,'base64'),
            {
              model: "nova-2",
            }
        );

        if(error){
            console.log(error)
            return null;
        }
      
        return result.results.channels[0]?.alternatives[0]?.transcript
    } catch (error) {
        console.log(error.message);
        return null;
    }
}