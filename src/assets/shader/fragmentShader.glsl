
precision lowp float;

varying vec2 vuv;
uniform float uTime;
#define PI 3.14159865;

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main(){
    // 1. 基础颜色渐变 —— 通过位置x，y决定颜色
    // gl_FragColor = vec4(vuv, 0.0, 1.0);

    // 2. 基础颜色渐变 2 —— 通过位置x，y决定颜色
    // gl_FragColor = vec4(vuv,1, 1);

    // 3.从上到下渐变
    // float strength = vuv.y;
    // gl_FragColor = vec4(strength, strength, 1, 1);

    // 4. 从下到上渐变
    // float strength = 1.0 - vuv.y;
    // gl_FragColor = vec4(strength, strength, 1, 1);

    // 5. 通过mod实现渐变斑马纹
    // float strength = mod(vuv.y*10.0, 1.0);
    // gl_FragColor = vec4(strength, strength, 1, 1);

    // 6. 通过mod + step实现斑马纹
    // float strength = step(0.5, mod(vuv.y*10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, 1, 1);

    // 7. 相加实现小方格 （相减，相加，相乘差不多都是小方格的样式，有一点区别）
    // float strength = step(0.5, mod(vuv.x*10.0, 1.0));
    // strength += step(0.5, mod(vuv.y*10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, 1, 1);

    // 7. 相加实现小方格 
    // float strength = step(0.8, mod(vuv.x*10.0, 1.0));
    // strength -= step(0.3, mod(vuv.y*10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, 1, 1);

    // 8. 折角形状 （可以加点偏移形成T型）
    // vec2 rotateUv = rotate(vuv, 3.14 * 0.75, vec2(0.5, 0.4));
    // float strengthX = step(0.4, mod(rotateUv.x*10.0, 1.0))* step(0.8, mod(rotateUv.y*10.0, 1.0));
    // float strengthY = step(0.4, mod(rotateUv.y*10.0, 1.0)) * step(0.8, mod(rotateUv.x*10.0, 1.0));
    // strengthX += strengthY;
    // gl_FragColor = vec4(rotateUv, 1.0, strengthX);

    // 9. 斜角十字架渐变
    // float strength = max(abs(vuv.x -0.5), abs(vuv.y-0.5));
    // gl_FragColor = vec4(strength,strength,  strength, 1.0);

    // 10. 利用floor，条纹渐变
    // float strength = ceil(vuv.x * 10.0)/10.0;
    // gl_FragColor = vec4(strength,1.0,  1.0, 1.0);

    // 11. 格子渐变
    // float strength = ceil(vuv.x * 10.0-0.5)/10.0 * ceil(vuv.y * 10.0-0.5)/10.0;
    // gl_FragColor = vec4(strength * vuv.x,strength*vuv.y,  0.3, 1);

    // 12. 圆形
    // float strength =0.15 / distance(vuv, vec2(0.5,0.5))-1.0;
    // gl_FragColor = vec4(strength,strength,  strength, 1);

    // 13. 椭圆
    // float strength =0.15 / distance(vec2(vuv.x, (vuv.y-0.4) * 5.0), vec2(0.5,0.5))-1.0;
    // gl_FragColor = vec4(strength,strength,  strength, 1);

    // 13. 十字形星星
    // float strengthX =0.15 / distance(vec2((vuv.x-0.5) * 5.0+0.5, vuv.y), vec2(0.5,0.5))-1.0;
    // float strengthY =0.15 / distance(vec2(vuv.x, (vuv.y-0.5) * 5.0+0.5), vec2(0.5,0.5))-1.0;
    // float strength = strengthX+strengthY;
    // gl_FragColor = vec4(strength,strength,  strength, strength);

    // 13. 不断旋转的十字形星星
    // vec2 rotateUv = rotate(vuv, uTime, vec2(0.5));
    // float strengthX =0.15 / distance(vec2((rotateUv.x-0.5) * 5.0+0.5, rotateUv.y), vec2(0.5,0.5))-1.0;
    // float strengthY =0.15 / distance(vec2(rotateUv.x, (rotateUv.y-0.5) * 5.0+0.5), vec2(0.5,0.5))-1.0;
    // float strength = strengthX+strengthY;
    // gl_FragColor = vec4(strength,strength,  strength, strength);

    // 12. 圆环
    // float strength =step(0.5, distance(vuv, vec2(0.5,0.5))+0.35);
    // strength *=1.0 - step(0.5, distance(vuv, vec2(0.5,0.5))+0.25);
    // gl_FragColor = vec4(strength,strength,  strength, 1);

    // 12. 圆环（另一种写法）
    // float strength =step(0.1, abs(distance(vuv, vec2(0.5))-0.25));
    // gl_FragColor = vec4(strength,strength,  strength, 1);

    // 12. 打靶圆环
    // float strength = step(0.1, mod(abs(distance(vuv, vec2(0.5))), 0.15));
    // gl_FragColor = vec4(strength,strength,  strength, 1);

    // 13. 类似于涂鸦花花
    // vec2 waveUv = vec2(
    //     vuv.x + sin(vuv.y * 30.0) * 0.1,
    //     vuv.y + sin(vuv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5))-0.25));
    // gl_FragColor = vec4(strength,strength,  strength, 1);

    // 12. 根据angle渐变
    // float angle = atan(vuv.x, vuv.y);
    // gl_FragColor = vec4(angle,angle, angle, 1);

    // 12. 雷达扫射效果
    // vec2 rotateUv = rotate(vuv, uTime*5.0, vec2(0.5));
    // float alpha = 1.0 - step(0.5, distance(vuv, vec2(0.5)));
    // float angle = atan(rotateUv.x - 0.5, rotateUv.y - 0.5);
    // float strength = (angle + 3.14)/6.28;
    // gl_FragColor = vec4(strength,strength, strength, alpha);

    // 12. 万花筒
    // vec2 rotateUv = rotate(vuv, uTime, vec2(0.5));

    // float angle = atan(rotateUv.x - 0.5, rotateUv.y - 0.5) / PI;
    // float strength = mod(angle * 10.0,1.0);
    // gl_FragColor = vec4(strength,strength, strength, 1);

    // 14. 噪声
    // float strength =  step(0.5, noise(vuv * 10.0));
    // gl_FragColor = vec4(strength,strength, strength, 1);

    // 15. 噪声图案
    // float strength = abs(cnoise(vuv * 10.0));
    // vec3 colorOne = vec3(1.0, 1.0, 0.0);
    // vec3 colorTwo = vec3(0.29, 0.51, 0.02);
    // vec3 uvColor = vec3(vuv,0.5);
    // vec3 mixColor = mix(colorTwo, uvColor, strength);
    // gl_FragColor = vec4(mixColor, 1);
}
