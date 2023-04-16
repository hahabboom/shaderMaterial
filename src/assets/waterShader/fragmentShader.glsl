precision lowp float;
varying vec2 vuv;
uniform float uTime;
#define PI 3.14159865;
varying vec4 vPosition;
varying vec4 gPosition;
varying float vElevation;
uniform vec3 uHighColor;
uniform vec3 uLowColor;
uniform float uOpacity;

void main(){
    float opacity = (vElevation+1.0) / 2.0;
    vec3 mixColor = mix(uLowColor, uHighColor, opacity);
    gl_FragColor = vec4(mixColor, uOpacity);
}
