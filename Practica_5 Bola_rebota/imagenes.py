import os
from PIL import Image

def convert_png_to_jpg(directory):
    for filename in os.listdir(directory):
        if filename.lower().endswith(".png"):
            png_path = os.path.join(directory, filename)
            jpg_path = os.path.join(directory, filename.replace(".png", ".jpg"))

            # Convierte la imagen PNG a JPG
            img = Image.open(png_path)
            img.convert("RGB").save(jpg_path, "JPEG")

            # Elimina la imagen PNG
            os.remove(png_path)
            print(f"Convertido y eliminado: {filename}")

if __name__ == "__main__":
    directorio = "E:/bd/wally/n"
    convert_png_to_jpg(directorio)
