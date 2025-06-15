//---- Clase principal para generar el QR
export class canvasLocal {
    //---- Constructor que inicializa todo
    constructor(lienzo) {
        this.lienzo = lienzo;
        //---- Obtenemos el pincel de dibujo
        this.pincel = lienzo.getContext('2d');
        //---- Ajustamos el tamaño para que sea cuadrado
        const lado = Math.min(lienzo.width, lienzo.height);
        lienzo.width = lado;
        lienzo.height = lado;
        this.puntoSize = lado / 25; // 25x25 puntos
        //---- Solicitamos la URL al usuario
        const enlace = prompt('Ingresa tu enlace:', 'https://ejemplo.com');
        if (enlace) {
            this.generarQR(enlace);
        }
    }
    //---- Dibuja un punto en la posición dada
    pintarPunto(posX, posY, esNegro) {
        //---- Seleccionamos color (solo negro o blanco)
        this.pincel.fillStyle = esNegro ? 'black' : 'white';
        //---- Dibujamos el punto
        this.pincel.fillRect(posX * this.puntoSize, posY * this.puntoSize, this.puntoSize, this.puntoSize);
    }
    //---- Dibuja los patrones de las esquinas
    dibujarPatrones() {
        //---- Patrón superior izquierdo
        for (let fila = 0; fila < 7; fila++) {
            for (let col = 0; col < 7; col++) {
                const esBorde = fila === 0 || fila === 6 || col === 0 || col === 6;
                const esCentro = fila >= 2 && fila <= 4 && col >= 2 && col <= 4;
                this.pintarPunto(fila, col, esBorde || esCentro);
            }
        }
        //---- Patrón inferior izquierdo
        for (let fila = 0; fila < 7; fila++) {
            for (let col = 18; col < 25; col++) {
                const esBorde = fila === 0 || fila === 6 || col === 18 || col === 24;
                const esCentro = fila >= 2 && fila <= 4 && col >= 20 && col <= 22;
                this.pintarPunto(fila, col, esBorde || esCentro);
            }
        }
        //---- Patrón superior derecho
        for (let fila = 18; fila < 25; fila++) {
            for (let col = 0; col < 7; col++) {
                const esBorde = fila === 18 || fila === 24 || col === 0 || col === 6;
                const esCentro = fila >= 20 && fila <= 22 && col >= 2 && col <= 4;
                this.pintarPunto(fila, col, esBorde || esCentro);
            }
        }
    }
    //---- Dibuja las líneas de sincronización
    dibujarLineas() {
        //---- Línea horizontal
        for (let i = 8; i < 17; i++) {
            this.pintarPunto(i, 6, i % 2 === 0);
        }
        //---- Línea vertical
        for (let i = 8; i < 17; i++) {
            this.pintarPunto(6, i, i % 2 === 0);
        }
    }
    //---- Genera el código QR completo
    generarQR(texto) {
        //---- Limpiamos el lienzo
        this.pincel.clearRect(0, 0, this.lienzo.width, this.lienzo.height);
        //---- Dibujamos los patrones fijos
        this.dibujarPatrones();
        this.dibujarLineas();
        //---- Convertimos el texto a bits
        let bits = '';
        for (let i = 0; i < texto.length; i++) {
            bits += texto.charCodeAt(i).toString(2).padStart(8, '0');
        }
        //---- Rellenamos los datos
        let bitActual = 0;
        for (let fila = 0; fila < 25; fila++) {
            for (let col = 0; col < 25; col++) {
                //---- Saltamos las áreas reservadas
                const esReservado = (fila < 7 && col < 7) ||
                    (fila < 7 && col > 17) ||
                    (fila > 17 && col < 7) ||
                    fila === 6 ||
                    col === 6;
                if (!esReservado && bitActual < bits.length) {
                    this.pintarPunto(fila, col, bits[bitActual] === '1');
                    bitActual++;
                }
                else if (!esReservado) {
                    //---- Rellenamos con puntos aleatorios si faltan datos
                    this.pintarPunto(fila, col, Math.random() > 0.5);
                }
            }
        }
    }
}
