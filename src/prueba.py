import speech_recognition as sr
from openai import OpenAI
import os
    
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def capturar_audio():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Escuchando...")
        audio = r.listen(source)
    try:
        print("Reconociendo...")
        text = r.recognize_google(audio, language='es-ES')
        print(f"Texto reconocido: {text}")
        return text
    except Exception as e:
        print(f"Error al reconocer el audio: {e}")
        return None
    
def generar_imagen(texto):
    openai = OpenAI(
        api_key=OPENAI_API_KEY
    )
    response = openai.images.generate(
        prompt=texto,
        model="dall-e-3",
        size="1024x1024",
        quality="standard",
        n=1,  
    )
    
    image_url = response.data[0].url

    print(image_url)

# ejemplo de uso
def main():
    texto = capturar_audio()
    if texto:
        generar_imagen(texto)
    else:
        print("No se ha reconocido el audio")


if __name__ == "__main__":
    main()
