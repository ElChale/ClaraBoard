import React from 'react'
import { useEffect, useState } from 'react'
import rough from 'roughjs'

/**
 * Board Component
 * Renderiza un lienzo que soporta arrastrar y soltar un texto y una imagen.
 *
 * Props:
 * @param canvasRef: Ref para adjuntar al elemento canvas.
 * @param ctxRef: Ref para almacenar el contexto 2D del canvas para uso externo.
 * 
 */

function Board({ canvasRef, ctxRef }) {

      // Ruta de la imagen y tamaño base de la fuente
      const imagePath = "src/assets/react.svg"
      const fontSize = 16

      // Estado para gestionar el contenido del texto y su posición
      const [text, setText] = useState("Arrastra este texto")
      const [isDraggingText, setIsDraggingText] = useState(false);
      const [prevTextPosition, setPrevTextPosition] = useState({ x: 50, y: 50 });
      const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });

      // Estado para gestionar la carga de la imagen y su posición
      const [image, setImage] = useState(null)
      const [isDraggingImage, setIsDraggingImage] = useState(false);
      const [prevImagePosition, setPrevImagePosition] = useState({ x: 50, y: 50 });
      const [imagePosition, setImagePosition] = useState({ x: 500, y: 50 });
      
      // Estado para gestionar la posición inicial del clic del ratón
      const [mouseStart, setMouseStart] = useState({ x: 0, y: 0 });


      /**
       * Dibuja el texto arrastrable en el lienzo.
       * Limpia la posición anterior del texto para evitar manchas.
       */
      const drawText = (ctx, x, y) => {
            const textHeight = Math.ceil(fontSize * 1.2)
            const metrics = ctx.measureText(text)
            const textWidth = metrics.width
            ctx.clearRect(prevTextPosition.x, prevTextPosition.y-textHeight, textWidth, textHeight*1.2)
            ctx.font = `${fontSize}px Arial`
            ctx.fillText(text, x, y)
      }

      /**
       * Dibuja la imagen arrastrable en el lienzo.
       * Limpia la posición anterior de la imagen para evitar manchas.
       */
      const drawImage = (ctx, x, y) => {
            //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);  
            ctx.clearRect(prevImagePosition.x, prevImagePosition.y, image.width, image.height)
            ctx.drawImage(image, imagePosition.x, imagePosition.y)
      }

      /**
       * useEffect para cargar la imagen y configurar el estado inicial del lienzo.
       */
      useEffect(() => {
            const img = new Image();
            img.src = imagePath
            img.onload = () => {
                  setImage(img)
                  const canvas = canvasRef.current;
                  const ctx = canvas.getContext("2d");
                  ctxRef.current = ctx;
                  ctx.drawImage(img, imagePosition.x, imagePosition.y);
            };
        }, []);

      /**
       * useEffect para manejar el reposicionamiento del texto en el lienzo.
       */
      useEffect(() => {
            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")

            ctxRef.current = ctx
            drawText(ctx, textPosition.x, textPosition.y)
      }, [textPosition])

      /**
       * useEffect para manejar el reposicionamiento de la imagen en el lienzo.
       */
      useEffect(() => {
            if (image) {
                  const canvas = canvasRef.current;
                  const ctx = canvas.getContext("2d");
                  drawImage(ctx);
            }
      }, [imagePosition, image])

      /**
       * Maneja los eventos de presión del ratón para iniciar el arrastre.
       */
      const handleMouseDown = (e) => {
            let { offsetX, offsetY } = e.nativeEvent
            //console.log(offsetX, offsetY)
            const distance = Math.sqrt(Math.pow(offsetX - textPosition.x, 2) + Math.pow(offsetY - textPosition.y, 2));
            
            // Verifica si el clic del ratón está dentro de los 50 píxeles del texto
            if (distance < 50) { 
                  setIsDraggingText(true);
                  setMouseStart({ x: offsetX - textPosition.x, y: offsetY - textPosition.y })
            }

            // Verifica si el clic del ratón está sobre la imagen
            if (offsetX >= imagePosition.x && offsetX <= imagePosition.x + image.width &&
                  offsetY >= imagePosition.y && offsetY <= imagePosition.y + image.height) {
                  setIsDraggingImage(true);
                  
                  setMouseStart({ x: offsetX - imagePosition.x, y: offsetY - imagePosition.y })
            }
      }

      /**
       * Maneja los eventos de movimiento del ratón para continuar el arrastre.
       */
      const handleMouseMove = (e) => {
            let { offsetX, offsetY } = e.nativeEvent
            //console.log(offsetX, offsetY)
            if (isDraggingText) {
                  setPrevTextPosition({ x: textPosition.x, y: textPosition.y})
                  setTextPosition({
                        x: offsetX - mouseStart.x,
                        y: offsetY - mouseStart.y
                  })
            }
            if (isDraggingImage) {
                  const { offsetX, offsetY } = e.nativeEvent;
                  setPrevImagePosition({ x: imagePosition.x, y: imagePosition.y })
                  setImagePosition({
                        x: offsetX - mouseStart.x,
                        y: offsetY - mouseStart.y
                  });
              }
      }

      /**
       * Maneja los eventos de liberación del ratón para terminar el arrastre.
       */
      const handleMouseUp = (e) => {
            let { offsetX, offsetY } = e.nativeEvent
            //console.log(offsetX, offsetY)
            setIsDraggingText(false)
            setIsDraggingImage(false)
      }

      return (
            <canvas 
                  ref={canvasRef} 
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  width={1000}
                  height={500}
                  className='relative border border-black bg-white'
                  
            >

            </canvas>
      )
}

export default Board