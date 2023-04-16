precision lowp float; 
attribute vec3 position;
attribute vec2 uv;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vuv;

void main(){
    // vuv =uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1);
    float elevation = sin(modelPosition.x * 100.0);
    modelPosition.y += elevation;
    gl_Position =  projectionMatrix * viewMatrix * modelPosition;
}