precision lowp float; 

attribute float imgIndex;
attribute float scales;
// uniform vec3 color;
uniform float uTime;
varying vec3 vcolor;
varying vec2 vuv;
varying float vimgIndex;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // gl_Position =  projectionMatrix * viewPosition;
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = 1.0 / distanceToCenter * uTime;

    angle += angleOffset;
    modelPosition.x = cos(angle)*distanceToCenter;
    modelPosition.x = sin(angle)*distanceToCenter;
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position =  projectionMatrix * viewPosition;

    //需要设置点的大小，否则页面效果出来是黑屏的感觉
    //根据viewPosition的坐标决定是否远离摄像机
    gl_PointSize = 100.0/-viewPosition.z* scales;
    vimgIndex = imgIndex;
    vcolor = color;
}