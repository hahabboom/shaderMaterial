
precision lowp float;
varying vec2 vuv;
uniform sampler2D uTexture;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
varying float vimgIndex;
varying vec3 vcolor;

void main(){
    vec4 textureColor;
    if(vimgIndex == 0.0){
        textureColor = texture2D(uTexture, gl_PointCoord);
    } else if(vimgIndex == 1.0) {
        textureColor = texture2D(uTexture1, gl_PointCoord);
    } else {
        textureColor = texture2D(uTexture2, gl_PointCoord);
    }

    gl_FragColor = vec4(vcolor, textureColor.r);
}
