precision lowp float;

attribute vec2 vertexPositionNDC;

void main() {
	gl_Position = vec4(vertexPositionNDC, 0, 1);
}