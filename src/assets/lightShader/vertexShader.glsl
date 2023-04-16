precision lowp float;

varying vec2 vuv;
varying vec4 vPosition;
varying vec4 gPosition;
void main(){
    vuv =uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1);
    vPosition = modelPosition;
    gPosition = vec4(position, 1);
    gl_Position =  projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1);
}