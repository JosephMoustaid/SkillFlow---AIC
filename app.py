from flask import Flask, request, jsonify
from flask import send_file

from flask_cors import CORS  # Import CORS
from openai import OpenAI
import sounddevice as sd
import numpy as np
import soundfile as sf
import io
import os
import json






app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the OpenAI client
client = OpenAI(api_key="open-ai-key")  

@app.route("/api/generate-speech", methods=["POST"])
def generate_speech():
    """
    Endpoint to generate speech from text using OpenAI's TTS API.
    """
    data = request.json
    text = data.get("text")
    path_name = data.get("pathName")  # Get pathName from the request payload

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        # Generate speech using OpenAI's TTS API
        response = client.audio.speech.create(
            model="tts-1",
            voice="alloy",  # Choose from "alloy", "echo", "fable", "onyx", "nova", "shimmer"
            input=text
        )

        # Save the speech to a temporary in-memory file
        audio_bytes = io.BytesIO()
        response.stream_to_file(audio_bytes)
        audio_bytes.seek(0)

        return send_file(audio_bytes, mimetype="audio/mpeg")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def transcribe_audio(audio, path_name):
    """
    Transcribes the recorded audio using OpenAI's Whisper API.
    """
    # Save the audio to a temporary in-memory file
    audio_bytes = io.BytesIO()
    sf.write(audio_bytes, audio, SAMPLE_RATE, format="WAV")
    audio_bytes.seek(0)

    # Transcribe the audio using OpenAI's Whisper API
    transcription = client.audio.transcriptions.create(
        model="whisper-1",
        file=("audio.wav", audio_bytes, "audio/wav")
    )

    return transcription.text

def record_audio():
    """
    Continuously records audio from the microphone until the user stops speaking.
    """
    print("Listening... Speak now.")
    audio_frames = []
    silence_duration = 0.0
    speech_duration = 0.0

    try:
        while True:
            # Record a chunk of audio
            chunk = sd.rec(int(SAMPLE_RATE * CHUNK_DURATION), samplerate=SAMPLE_RATE, channels=1, dtype='float32')
            sd.wait()  # Wait until the recording is finished
            audio_frames.append(chunk)

            # Calculate the RMS (Root Mean Square) volume of the chunk
            rms_volume = np.sqrt(np.mean(np.square(chunk)))

            # Check if the RMS level is consistently low (silence)
            if rms_volume < SILENCE_THRESHOLD:
                silence_duration += CHUNK_DURATION
            else:
                silence_duration = 0.0  # Reset silence duration if RMS level spikes
                speech_duration += CHUNK_DURATION

            # Stop recording if silence is detected for a certain duration
            if silence_duration >= 3 and speech_duration >= MIN_SPEECH_DURATION:
                print("User stopped speaking.")
                break

    except KeyboardInterrupt:
        print("\nRecording stopped manually.")

    # Check if any audio was recorded
    if not audio_frames:
        print("No audio recorded.")
        return None

    # Concatenate all audio chunks
    audio = np.concatenate(audio_frames, axis=0)
    return audio

@app.route("/api/record", methods=["POST"])
def handle_record():
    """
    Endpoint to record audio and return the transcription.
    """
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    path_name = request.form.get("pathName")  # Get pathName from the FormData

    if not path_name:
        return jsonify({"error": "Path name is required"}), 400

    # Save the audio file temporarily
    audio_path = "temp_audio.wav"
    audio_file.save(audio_path)

    # Transcribe the audio using OpenAI's Whisper API
    try:
        with open(audio_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
        os.remove(audio_path)  # Clean up the temporary file
        return jsonify({"transcription": transcription.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/chat", methods=["POST"])
def handle_chat():
    """
    Endpoint to interact with GPT-4.
    """
    data = request.json
    user_input = data.get("message")
    path_name = data.get("pathName")  # Get pathName from the request payload

    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    # Define the system prompt with pathName
    system_prompt = f"""
    You are a skill Learning Mentor, specifically for {path_name}, an AI designed to teach users how to learn and master a specific skill. 
    Your goal is to provide clear, concise, and conversational explanations, practical examples, and exercises to help users improve their skills and teach them. 
    Always adapt your teaching style to the user's level (beginner, intermediate, or advanced). 
    Keep your responses very short—no more than 2-3 sentences. Avoid lists, bullet points, or numbered steps unless explicitly requested by the user.
    Respond in a natural, human-like, and conversational tone, as if you are a personal teacher having a friendly chat with the user.
    If the user asks unrelated questions, gently guide them back to the skill-learning topics.
    Be fun, engaging, and patient with the user.
    """

    # Initialize conversation history
    conversation_history = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input}
    ]

    # Get GPT-4 response
    response = client.chat.completions.create(
        model="gpt-4",
        messages=conversation_history,
        max_tokens=120
    )
    gpt_response = response.choices[0].message.content

    return jsonify({"response": gpt_response})

if __name__ == "__main__":
    app.run(port=5000)



