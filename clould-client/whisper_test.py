from services.transcription_service import Transcription

transcription_service = Transcription()
transcription_service.load_model()
print(transcription_service.transcribe(r"C:\Users\user\Downloads\NEW_WAV (1).wav"))