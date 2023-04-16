precision lowp float;
varying vec2 vuv;
uniform float uTime;
#define PI 3.14159865;
varying vec4 vPosition;
varying vec4 gPosition;

void main(){
    vec4 redColor = vec4(1,0,0,1);
    vec4 yellowColor = vec4(0.98, 0.98, 0.02, 1.0);
    vec4 mixColor = mix(yellowColor, redColor,gPosition.y/3.0);
    if(gl_FrontFacing) {
        gl_FragColor = vec4(mixColor.xyz-(vPosition.y-20.0)/80.0-0.3,1);
    } else{
        gl_FragColor = vec4(mixColor.xyz, 1);
    }
}
