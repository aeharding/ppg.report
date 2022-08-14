export function doesFontExist(fontName: string) {
  // creating our in-memory Canvas element where the magic happens
  let canvas: HTMLCanvasElement | null = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) throw new Error("Context not available");

  // the text whose final pixel size I want to measure
  var text = "abcdefghijklmnopqrstuvwxyz0123456789";

  // specifying the baseline font
  context.font = "72px monospace";

  // checking the size of the baseline text
  var baselineSize = context.measureText(text).width;

  // specifying the font whose existence we want to check
  context.font = "72px '" + fontName + "', monospace";

  // checking the size of the font we want to check
  var newSize = context.measureText(text).width;

  // removing the Canvas element we created
  canvas = null;

  //
  // If the size of the two text instances is the same, the font does not exist because it is being rendered
  // using the default sans-serif font
  //
  if (newSize === baselineSize) {
    return false;
  } else {
    return true;
  }
}
