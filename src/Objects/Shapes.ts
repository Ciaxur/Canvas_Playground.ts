// Module Imports
import { ctx } from "../Canavs/Canvas";

/**
 * Functions that Draw Shapes
 * 
 * Better Function names for drawing simple shapes
 */


/** 
 * Draws a Circles
 * 
 * @param x The x-axis Position to draw at
 * @param y The y-axis Position to draw at
 * @param r The Radius of Circle
 */
export function circle(x: number, y: number, r: number): void {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
}

/**
 * Draws a Line from a Point to another
 * Default Stroke Color is Black
 * 
 * @param x1 The first x-Axis to start from
 * @param y1 The first y-Axis to start from
 * @param x2 The second x-Axis to end at
 * @param y2 The second y-Axis to end at
 */
export function drawLine(x1: number, y1: number, x2: number, y2: number): void {
    ctx.beginPath();
    ctx.quadraticCurveTo(x1, y1, x2, y2);
    stroke(0, 0, 0);
    ctx.closePath();
}

/**
 * Fills The Shape with a RGB Style
 * @param r The Red Color Value 0 - 255
 * @param g The Green Color Value 0 - 255
 * @param b The Blue Color Value 0 - 255
 */
export function fill(r: number, g: number, b: number): void {
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fill();
    ctx.closePath();
}

/**
 * Draws a Stroke around the Shape with a RGB Style
 * @param r The Red Color Value 0 - 255
 * @param g The Green Color Value 0 - 255
 * @param b The Blue Color Value 0 - 255
 */
export function stroke(r: number, g: number, b: number): void {
    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.stroke();
    ctx.closePath();
}

/**
 * Sets the Stroke Width Style
 * 
 * @param weight The Line Width
 */
export function strokeWeight(weight: number): void {
    ctx.lineWidth = weight;
}