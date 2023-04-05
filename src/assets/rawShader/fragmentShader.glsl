precision lowp float; 
varying vec2 vuv;
varying float vHeight;
uniform sampler2D uTexture;
void main(){

    // float colorDepth = vHeight + 0.05* 10.0;
    // gl_FragColor = vec4(colorDepth,0.0,0.0, 0.0);

    vec4 textColor = texture2D(uTexture, vuv);
    textColor.rgb *= vHeight + 0.05* 10.0;
    gl_FragColor = textColor;
}