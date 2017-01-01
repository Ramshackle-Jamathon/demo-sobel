precision mediump float;

uniform float uGlobalTime;
uniform vec2 uResolution;
uniform sampler2D uWebcamTexture;
uniform float uStep;

// Basic sobel filter implementation
// Jeroen Baert - jeroen.baert@cs.kuleuven.be
float intensity(in vec4 color){
	return sqrt((color.x*color.x)+(color.y*color.y)+(color.z*color.z));
}

vec3 sobel(float stepx, float stepy, vec2 center){
	// get samples around pixel
	float tleft = intensity(texture2D(uWebcamTexture,center + vec2(-stepx,stepy)));
	float left = intensity(texture2D(uWebcamTexture,center + vec2(-stepx,0)));
	float bleft = intensity(texture2D(uWebcamTexture,center + vec2(-stepx,-stepy)));
	float top = intensity(texture2D(uWebcamTexture,center + vec2(0,stepy)));
	float bottom = intensity(texture2D(uWebcamTexture,center + vec2(0,-stepy)));
	float tright = intensity(texture2D(uWebcamTexture,center + vec2(stepx,stepy)));
	float right = intensity(texture2D(uWebcamTexture,center + vec2(stepx,0)));
	float bright = intensity(texture2D(uWebcamTexture,center + vec2(stepx,-stepy)));

	// Sobel masks (see http://en.wikipedia.org/wiki/Sobel_operator)
	//        1 0 -1     -1 -2 -1
	//    X = 2 0 -2  Y = 0  0  0
	//        1 0 -1      1  2  1

	// You could also use Scharr operator:
	//        3 0 -3        3 10   3
	//    X = 10 0 -10  Y = 0  0   0
	//        3 0 -3        -3 -10 -3

	float x = tleft + 2.0*left + bleft - tright - 2.0*right - bright;
	float y = -tleft - 2.0*top - tright + bleft + 2.0 * bottom + bright;
	float color = sqrt((x*x) + (y*y));
	return vec3(color,color,color);
}


void main()
{
	vec2 uv = 1.0 - gl_FragCoord.xy / uResolution.xy;
	gl_FragColor = vec4(sobel(uStep/uResolution.x, uStep/uResolution.y, uv),1.0);
}
