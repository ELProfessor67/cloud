import whisper
from pydub import AudioSegment
import os

class Transcription:
    temp_wav = "temp.wav"
    def __init__(self, model: str = 'base', language: str = 'en'):
        self.model_name = model
        self.language = language
        self.model = None
    
    def load_model(self):
        self.model = whisper.load_model("base")

    def transcribe(self, file_path: str) -> str:
        self.convert_to_wav(file_path=file_path)
        result = self.model.transcribe(self.temp_wav, language=self.language)
        os.remove(self.temp_wav)
        return result['text']

    def convert_to_wav(self,file_path:str):
        audio = AudioSegment.from_file(file_path)
        audio = audio.set_channels(1).set_frame_rate(16000)
        audio.export(self.temp_wav, format="wav")