export class CanvasLocal {
    //--- Variables principales
    private g: CanvasRenderingContext2D;
    private maxX: number;
    private maxY: number;
    private centerX: number;
    private centerY: number;

    constructor(graphics: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.g = graphics; //--- Contexto gráfico
        this.maxX = canvas.width - 1; //--- Ancho máximo
        this.maxY = canvas.height - 1; //--- Alto máximo
        this.centerX = this.maxX / 2; //--- Centro X
        this.centerY = this.maxY / 2; //--- Centro Y
    }

    //--- Dibuja línea entre puntos
    private drawLine(x1: number, y1: number, x2: number, y2: number): void {
        this.g.beginPath();
        this.g.moveTo(x1, y1);
        this.g.lineTo(x2, y2);
        this.g.stroke();
    }

    //--- Método principal de dibujo
    paint(): void {
        //--- Tamaño y posición inicial
        let size = 400; //--- Tamaño cuadrado inicial
        let startX = (this.maxX - size) / 2; //--- Inicio X
        let startY = (this.maxY - size) / 2; //--- Inicio Y

        //--- Coordenadas esquinas (puntos A, B, C, D)
        let ax = startX;
        let ay = startY;
        let bx = startX + size;
        let by = startY;
        let cx = bx;
        let cy = startY + size;
        let dx = ax;
        let dy = cy;

        //--- Factor de reducción (3%)
        let reduccion = 0.03;

        //--- Dibuja 80 cuadrados concéntricos
        for (let i = 0; i < 80; i++) {
            //--- Dibuja cuadrado actual
            this.drawLine(ax, ay, bx, by); //--- Lado superior
            this.drawLine(bx, by, cx, cy); //--- Lado derecho
            this.drawLine(cx, cy, dx, dy); //--- Lado inferior
            this.drawLine(dx, dy, ax, ay); //--- Lado izquierdo

            //--- Calcula nuevas posiciones
            //--- Punto A se mueve hacia B
            ax += (bx - ax) * reduccion;
            ay += (by - ay) * reduccion;
            
            //--- Punto B se mueve hacia C
            bx += (cx - bx) * reduccion;
            by += (cy - by) * reduccion;
            
            //--- Punto C se mueve hacia D
            cx += (dx - cx) * reduccion;
            cy += (dy - cy) * reduccion;
            
            //--- Punto D se mueve hacia A
            dx += (ax - dx) * reduccion;
            dy += (ay - dy) * reduccion;
        }
    }
}