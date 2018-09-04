import { preload } from './Canavs/Preload';
import { draw, ctx, background } from './Canavs/Canvas';
import { WIDTH, HEIGHT, setCanvasSize } from './Canavs/Constants';
import { circle, fill, stroke, drawLine, strokeWeight } from './Objects/Shapes';


// Global Variables


preload(() => {
    background(111, 111, 111);
    setCanvasSize(500, 500);
});


draw(() => {
    
});