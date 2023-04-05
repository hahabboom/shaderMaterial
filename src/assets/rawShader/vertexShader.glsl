precision lowp float; 
attribute vec3 position;
attribute vec2 uv;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;

varying vec2 vuv;
varying float vHeight;

void main(){
    vuv = uv;
    vec4  modelPosition =  modelMatrix * vec4(position, 1.0);
    modelPosition.x +=1.0;
    modelPosition.z = sin((modelPosition.x + uTime) * 10.0 )*0.05;
    modelPosition.z += sin((modelPosition.y+uTime )* 10.0 )*0.05;
    vHeight = modelPosition.z;
    gl_Position =  projectionMatrix * viewMatrix * modelPosition;
}