from openai import OpenAI
import sounddevice as sd
import numpy as np
import soundfile as sf
import io
import os
import json
import sys

from google.oauth2 import service_account
from googleapiclient.discovery import build


# Initialize the OpenAI client
client = OpenAI(api_key="open-ai-key")  

# Constants
SAMPLE_RATE = 16000  # Sample rate for audio recording
CHUNK_DURATION = 0.5  # Duration of each audio chunk in seconds (smaller chunks for better silence detection)
SILENCE_THRESHOLD = 0.172  # Adjusted threshold based on your observation (silence RMS is ~0.16)
MIN_SPEECH_DURATION = 1.0  # Minimum duration of speech before stopping (in seconds)

def schedule_learning_session(user_id, session_time):
    credentials = service_account.Credentials.from_service_account_file("credentials.json")
    service = build("calendar", "v3", credentials=credentials)

    event = {
        "summary": "Table Making Learning Session",
        "start": {"dateTime": session_time, "timeZone": "UTC"},
        "end": {"dateTime": session_time, "timeZone": "UTC"},
    }

    event = service.events().insert(calendarId="primary", body=event).execute()
    return event.get("htmlLink")

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

def transcribe_audio(audio):
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

def text_to_speech(text):
    """
    Converts text to speech using OpenAI's TTS API and plays it directly.
    """
    # Generate speech using OpenAI's TTS API
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",  # Options: alloy, echo, fable, onyx, nova, shimmer
        input=text
    )

    # Save the audio to a temporary file
    temp_file = "temp_response.mp3"
    with open(temp_file, "wb") as f:
        f.write(response.content)

    # Load the audio file using soundfile
    audio_data, sample_rate = sf.read(temp_file, dtype="float32")

    # Play the audio directly
    sd.play(audio_data, samplerate=sample_rate)
    sd.wait()

    # Delete the temporary file
    os.remove(temp_file)


def main(topic):
    # Define the initial system prompt
    system_prompt = f"""
    You are a skill Learning Mentor, specifically for {topic}, an AI designed to teach users how to learn and master a specific skill. 
    Your goal is to provide clear, concise, and conversational explanations, practical examples, and exercises to help users improve their skills and teach them. 
    Always adapt your teaching style to the user's level (beginner, intermediate, or advanced). 
    Keep your responses very short—no more than 2-3 sentences. Avoid lists, bullet points, or numbered steps unless explicitly requested by the user.
    Respond in a natural, human-like, and conversational tone, as if you are a personal teacher having a friendly chat with the user.
    If the user asks unrelated questions, gently guide them back to the skill-learning topics.
    Be fun, engaging, and patient with the user.
    """

    # Initialize conversation history
    conversation_history = [
        {"role": "system", "content": system_prompt}
    ]

    # Initialize empty progress data
    progress_data = {}

    # Step 1: Conduct a survey to gather user information
    print("Let's start by gathering some information about your skill level and goals.")
    survey_prompt = f"""
    You are conducting a survey to determine the user's skill level and goals for {topic}. 
    Ask the user a series of questions to assess their experience, tools, and goals. 
    Based on their responses, determine their skill level (beginner, intermediate, advanced) and generate a JSON object containing:
    - skill_level: The user's skill level.
    - goals: The user's goals for learning {topic}.
    - learning_path: A personalized learning path with 3-5 steps.
    - progress: Initialized to 0.
    - completed_exercises: An empty list to track completed exercises.
    """

    # Add survey prompt to conversation history
    conversation_history.append({"role": "system", "content": survey_prompt})

    # Conduct the survey
    while True:
        # Get GPT-4's next question or response
        response = client.chat.completions.create(
            model="gpt-4",
            messages=conversation_history,
            max_tokens=150
        )
        gpt_response = response.choices[0].message.content
        print(f"GPT-4: {gpt_response}")



        # Check if the response contains a JSON object
        try:
            # Extract JSON object from the response
            json_start = gpt_response.find("{")
            json_end = gpt_response.rfind("}") + 1
            json_str = gpt_response[json_start:json_end]

            # Parse the JSON object
            progress_data = json.loads(json_str)
            print("Survey complete! Here's your progress data:")
            print(json.dumps(progress_data, indent=2))
            break  # Exit the survey loop
        except (ValueError, AttributeError):
            # If no JSON object is found, continue the survey
            pass

        # Add GPT-4's response to conversation history
        conversation_history.append({"role": "assistant", "content": gpt_response})

        # Get user input
        user_input = input("Your answer: ").strip()
        conversation_history.append({"role": "user", "content": user_input})

    # Save progress data to a file
    user_id = "user_123"  # Replace with actual user ID
    with open(f"user_{user_id}_progress.json", "w") as file:
        json.dump(progress_data, file)

    # Step 2: Update the system prompt with progress data
    updated_system_prompt = f"""
    {system_prompt}
    The user's current skill level is {progress_data["skill_level"]}, and their goals are: {progress_data["goals"]}.
    Their personalized learning path is: {progress_data["learning_path"]}.
    """

    # Reset conversation history with the updated system prompt
    conversation_history = [
        {"role": "system", "content": updated_system_prompt}
    ]

    # Step 3: Begin audio-based interaction
    print("Now that we have your information, let's start the learning session!")
    
    while True:
        try:
            # Step 1: Record audio
            audio = record_audio()

            # If no audio was recorded, skip to the next iteration
            if audio is None:
                continue

            # Step 2: Transcribe audio
            transcription = transcribe_audio(audio)
            print(f"User: {transcription}")

            # Add user message to conversation history
            conversation_history.append({"role": "user", "content": transcription})

            # Limit conversation history to the last 10 messages
            if len(conversation_history) > 10:
                conversation_history = conversation_history[-10:]

            # Step 3: Send conversation history to GPT-4
            response = client.chat.completions.create(
                model="gpt-4",
                messages=conversation_history,  # Include the entire conversation history
                max_tokens=120  # Limit response to 120 tokens (short responses)
            )
            gpt_response = response.choices[0].message.content
            print(f"GPT-4: {gpt_response}")

            # Add AI response to conversation history
            conversation_history.append({"role": "assistant", "content": gpt_response})

            # Step 4: Convert GPT-4 response to speech and play it
            text_to_speech(gpt_response)

        except Exception as e:
            print(f"An error occurred: {e}")
            break
        
    print("Learning session completed. Goodbye!")



def main2(topic, user_input=None):
    # Define the system prompt
    system_prompt = f"""
    You are a skill Learning Mentor, specifically for {topic}, an AI designed to teach users how to learn and master a specific skill. 
    Your goal is to provide clear, concise, and conversational explanations, practical examples, and exercises to help users improve their skills and teach them. 
    Always adapt your teaching style to the user's level (beginner, intermediate, or advanced). 
    Keep your responses very short—no more than 2-3 sentences. Avoid lists, bullet points, or numbered steps unless explicitly requested by the user.
    Respond in a natural, human-like, and conversational tone, as if you are a personal teacher having a friendly chat with the user.
    If the user asks unrelated questions, gently guide them back to the skill-learning topics.
    Be fun, engaging, and patient with the user.
    """

    # Initialize conversation history
    conversation_history = [
        {"role": "system", "content": system_prompt}
    ]

    # If user_input is provided, use it instead of recording audio
    if user_input:
        transcription = user_input
    else:
        # If no input is provided, record audio (optional, depending on your use case)
        audio = record_audio()
        if audio is None:
            return
        transcription = transcribe_audio(audio)

    # Add user message to conversation history
    conversation_history.append({"role": "user", "content": transcription})

    # Get GPT-4 response
    response = client.chat.completions.create(
        model="gpt-4",
        messages=conversation_history,
        max_tokens=120
    )
    gpt_response = response.choices[0].message.content

    # Return the GPT-4 response as JSON
    print(json.dumps({"response": gpt_response}))


if __name__ == "__main__":
    topic = "Table making"
    main(topic)

    """
    # Accept user input from command-line arguments or stdin
    topic = "Table making"
    user_input = sys.argv[1] if len(sys.argv) > 1 else None
    main(topic, user_input)
    """





