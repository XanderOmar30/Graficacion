export class CanvasLocal {
    //---------- Constructor que inicializa las propiedades del canvas
    constructor(g, canvas) {
        this.rWidth = 12;
        this.rHeight = 8;
        //---------- Array de colores para las barras
        this.coloresRGB = [
            "#a08383", // gris rojo
            "#0965ac", // azul
            "#c22dad", // rosa
            "#e6d615", // amarillo oscuro
            "#cd2020" // rojo
        ];
        this.graphics = g;
        this.maxX = canvas.width - 1;
        this.maxY = canvas.height - 1;
        this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
        this.centerX = this.maxX / 12;
        this.centerY = (this.maxY / 8) * 7;
    }
    //---------- Convierte coordenadas X del mundo real a coordenadas de píxel
    iX(x) {
        return Math.round(this.centerX + x / this.pixelSize);
    }
    //---------- Convierte coordenadas Y del mundo real a coordenadas de píxel
    iY(y) {
        return Math.round(this.centerY - y / this.pixelSize);
    }
    //---------- Dibuja una línea entre dos puntos
    drawLine(x1, y1, x2, y2) {
        this.graphics.beginPath();
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.closePath();
        this.graphics.stroke();
    }
    //---------- Dibuja un romboide (figura de 4 lados) y lo rellena
    drawRomboide(x1, y1, x2, y2, x3, y3, x4, y4, color) {
        this.graphics.fillStyle = color;
        this.graphics.beginPath();
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.lineTo(x3, y3);
        this.graphics.lineTo(x4, y4);
        this.graphics.closePath();
        this.graphics.stroke();
        this.graphics.fill();
    }
    //---------- Convierte un porcentaje a coordenadas Y del gráfico
    porcen(y) {
        return Math.max(0, Math.min(y, 100)) * 6 / 100;
    }
    //---------- Dibuja texto en una posición específica
    drawText(text, x, y, color = "#333") {
        this.graphics.fillStyle = color;
        this.graphics.font = "12px Arial";
        this.graphics.textAlign = "center";
        this.graphics.fillText(text, x, y);
    }
    //---------- Crea el efecto 3D de la barra con colores
    coloreado(x, y, colorIzq, colorDer) {
        const z = 0.5;
        const decorativo = "rgba(255, 255, 255, 0.3)";
        ;
        //---------- Parte superior decorativa (sombrero de la barra)
        this.drawRomboide(this.iX(x - z), this.iY(7 - z), this.iX(x), this.iY(7), this.iX(x + z), this.iY(7 - z), this.iX(x), this.iY(6.3 - z), decorativo);
        //---------- Lateral izquierdo base (parte trasera de la barra)
        this.drawRomboide(this.iX(x - z), this.iY(7 - z), this.iX(x), this.iY(6.3 - z), this.iX(x), this.iY(0), this.iX(x - z), this.iY(z), decorativo);
        //---------- Lateral derecho base (parte trasera de la barra)
        this.drawRomboide(this.iX(x + z), this.iY(7 - z), this.iX(x), this.iY(6.3 - z), this.iX(x), this.iY(0), this.iX(x + z), this.iY(z), decorativo);
        //---------- Lateral izquierdo del valor (parte visible del porcentaje)
        this.drawRomboide(this.iX(x - z), this.iY(y + z), this.iX(x), this.iY(y), this.iX(x), this.iY(0), this.iX(x - z), this.iY(z), colorIzq);
        //---------- Lateral derecho del valor (parte visible del porcentaje)
        this.drawRomboide(this.iX(x + z), this.iY(y + z), this.iX(x), this.iY(y), this.iX(x), this.iY(0), this.iX(x + z), this.iY(z), colorDer);
    }
    //---------- Dibuja una barra con porcentaje y color específico
    barra(x, porcentaje, colorIndex) {
        const y = this.porcen(porcentaje);
        //---------- Selecciona un color del array y lo ajusta para crear efecto 3D
        const colorBase = this.coloresRGB[colorIndex % this.coloresRGB.length];
        const colorClaro = this.hexToRGBA(colorBase, 0.8); // Lado izquierdo más claro
        const colorFuerte = this.hexToRGBA(colorBase, 1.0); // Lado derecho más oscuro
        //---------- Dibuja la barra con los colores
        this.coloreado(x, y, colorClaro, colorFuerte);
        //---------- Dibuja el porcentaje encima de la barra
        const textY = this.iY(y + 0.5); // Posición Y del texto (arriba de la barra)
        this.drawText(`${porcentaje}%`, this.iX(x), textY, "#000000");
    }
    //---------- Convierte color HEX a RGBA con transparencia
    hexToRGBA(hex, alpha) {
        const bigint = parseInt(hex.replace("#", ""), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    //---------- Método principal que dibuja todo el gráfico
    paint() {
        //---------- Dibuja ejes X e Y
        this.drawLine(this.iX(0), this.iY(0), this.iX(0), this.iY(this.maxX));
        this.drawLine(this.iX(0), this.iY(0), this.iX(this.maxY), this.iY(0));
        //---------- Genera porcentajes aleatorios para cada barra
        const porcentajes = [];
        for (let i = 0; i < 5; i++) {
            porcentajes.push(Math.floor(Math.random() * 100) + 1); // 1-100%
        }
        let x = 1.5; //---------- Posición X inicial para la primera barra
        //---------- Dibuja cada barra con su porcentaje y color
        for (let i = 0; i < porcentajes.length; i++) {
            //---------- Usa un índice de color aleatorio para cada barra
            const colorIndex = Math.floor(Math.random() * this.coloresRGB.length);
            this.barra(x, porcentajes[i], colorIndex);
            x += 1.5; //---------- Espacio entre barras
        }
    }
}
