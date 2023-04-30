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
uniform vec3 uColor;
void main(){
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = distanceToCenter*2.0;
    strength = 1.0-strength;
    strength = pow(strength,1.5);
    gl_FragColor = vec4(uColor,strength);
}
