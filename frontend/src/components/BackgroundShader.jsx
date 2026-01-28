import React, { useEffect, useRef } from 'react';

const BackgroundShader = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl');

        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        const vertexShaderSource = `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        const fragmentShaderSource = `
            precision highp float;
            uniform vec2 iResolution;
            uniform float iTime;

            #define RESOLUTION    iResolution
            #define TIME          iTime
            #define PI            3.141592654
            #define TAU           (2.0*PI)

            const vec4 hsv2rgb_K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 hsv2rgb(vec3 c) {
                vec3 p = abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www);
                return c.z * mix(hsv2rgb_K.xxx, clamp(p - hsv2rgb_K.xxx, 0.0, 1.0), c.y);
            }
            #define HSV2RGB(c)  (c.z * mix(hsv2rgb_K.xxx, clamp(abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www) - hsv2rgb_K.xxx, 0.0, 1.0), c.y))

            vec4 alphaBlend(vec4 back, vec4 front) {
                float w = front.w + back.w*(1.0-front.w);
                vec3 xyz = (front.xyz*front.w + back.xyz*back.w*(1.0-front.w))/w;
                return w > 0.0 ? vec4(xyz, w) : vec4(0.0);
            }

            vec3 alphaBlend(vec3 back, vec4 front) {
                return mix(back, front.xyz, front.w);
            }

            float tanh_approx(float x) {
                float x2 = x*x;
                return clamp(x*(27.0 + x2)/(27.0+9.0*x2), -1.0, 1.0);
            }

            vec3 tanh(vec3 x) {
                return vec3(tanh_approx(x.x), tanh_approx(x.y), tanh_approx(x.z));
            }

            float hash(float co) {
                return fract(sin(co*12.9898) * 13758.5453);
            }

            float hash(vec2 p) {
                float a = dot (p, vec2 (127.1, 311.7));
                return fract(sin(a)*43758.5453123);
            }

            float vnoise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                vec2 u = f*f*(3.0-2.0*f);
                float a = hash(i + vec2(0.0,0.0));
                float b = hash(i + vec2(1.0,0.0));
                float c = hash(i + vec2(0.0,1.0));
                float d = hash(i + vec2(1.0,1.0));
                float m0 = mix(a, b, u.x);
                float m1 = mix(c, d, u.x);
                return mix(m0, m1, u.y);
            }

            vec2 raySphere(vec3 ro, vec3 rd, vec4 sph) {
                vec3 oc = ro - sph.xyz;
                float b = dot( oc, rd );
                float c = dot( oc, oc ) - sph.w*sph.w;
                float h = b*b - c;
                if( h<0.0 ) return vec2(-1.0);
                h = sqrt( h );
                return vec2(-b - h, -b + h);
            }

            float mod1(inout float p, float size) {
                float halfsize = size*0.5;
                float c = floor((p + halfsize)/size);
                p = mod(p + halfsize, size) - halfsize;
                return c;
            }

            vec2 mod2(inout vec2 p, vec2 size) {
                vec2 c = floor((p + size*0.5)/size);
                p = mod(p + size*0.5,size) - size*0.5;
                return c;
            }

            vec2 hash2(vec2 p) {
                p = vec2(dot (p, vec2 (127.1, 311.7)), dot (p, vec2 (269.5, 183.3)));
                return fract(sin(p)*43758.5453123);
            }

            float hifbm(vec2 p) {
                float sum = 0.0;
                float a = 1.0;
                for (int i = 0; i < 5; ++i) {
                    sum += a*vnoise(p);
                    a *= 0.5;
                    p *= 2.0;
                }
                return sum;
            }

            float lofbm(vec2 p) {
                float sum = 0.0;
                float a = 1.0;
                for (int i = 0; i < 2; ++i) {
                    sum += a*vnoise(p);
                    a *= 0.5;
                    p *= 2.0;
                }
                return sum;
            }

            float hiheight(vec2 p) { return hifbm(p)-1.8; }
            float loheight(vec2 p) { return lofbm(p)-2.15; }

            vec4 plane(vec3 ro, vec3 rd, vec3 pp, vec3 npp, vec3 off, float n) {
                float h = hash(n);
                vec2 p = (pp-off*2.0*vec3(1.0, 1.0, 0.0)).xy;
                const vec2 stp = vec2(0.5, 0.33); 
                float he    = hiheight(vec2(p.x, pp.z)*stp);
                float lohe  = loheight(vec2(p.x, pp.z)*stp);
                float d = p.y-he;
                float lod = p.y - lohe;
                float aa = distance(pp, npp)*sqrt(1.0/3.0);
                float t = smoothstep(aa, -aa, d);
                float df = exp(-0.1*(distance(ro, pp)-2.));  
                vec3 acol = hsv2rgb(vec3(mix(0.9, 0.6, df), 0.9, mix(1.0, 0.0, df)));
                vec3 gcol = hsv2rgb(vec3(0.6, 0.5, tanh_approx(exp(-mix(2.0, 8.0, df)*lod))));
                vec3 col = vec3(0.0);
                col += acol;
                col += 0.5*gcol;
                return vec4(col, t);
            }

            vec3 stars(vec2 sp, float hh) {
                const vec3 scol0 = vec3(0.9, 0.2, 0.9); // simplified
                const vec3 scol1 = vec3(0.3, 0.6, 1.0); // simplified
                vec3 col = vec3(0.0);
                const float m = 6.0;
                for (float i = 0.0; i < m; ++i) {
                    vec2 pp = sp+0.5*i;
                    float s = i/(m-1.0);
                    vec2 dim  = vec2(mix(0.05, 0.003, s)*PI);
                    vec2 np = mod2(pp, dim);
                    vec2 h = hash2(np+127.0+i);
                    vec2 o = -1.0+2.0*h;
                    float y = sin(sp.x);
                    pp += o*dim*0.5;
                    pp.y *= y;
                    float l = length(pp);
                    float h1 = fract(h.x*1667.0);
                    float h2 = fract(h.x*1887.0);
                    float h3 = fract(h.x*2997.0);
                    vec3 scol = mix(8.0*h2, 0.25*h2*h2, s)*mix(scol0, scol1, h1*h1);
                    vec3 ccol = col + exp(-(mix(6000.0, 2000.0, hh)/mix(2.0, 0.25, s))*max(l-0.001, 0.0))*scol;
                    ccol *= mix(0.125, 1.0, smoothstep(1.0, 0.99, sin(0.25*TIME+TAU*h.y)));
                    col = h3 < y ? ccol : col;
                }
                return col;
            }

            vec3 toSpherical(vec3 p) {
                float r   = length(p);
                float t   = acos(p.z/r);
                float ph  = atan(p.y, p.x);
                return vec3(r, t, ph);
            }

            const vec3 lpos   = 1E6*vec3(0., -0.15, 1.0);
            const vec3 ldir   = vec3(0.0, -0.148, 0.989); // normalize(lpos)

            vec4 moon(vec3 ro, vec3 rd) {
                const vec4 mdim   = vec4(1E5*vec3(0., 0.4, 1.0), 20000.0);
                const vec3 mcol0  = vec3(0.4, 0.3, 0.9);
                const vec3 mcol3  = vec3(0.5, 0.4, 0.8);

                vec2 md     = raySphere(ro, rd, mdim);
                vec3 mpos   = ro + rd*md.x;
                vec3 mnor   = normalize(mpos-mdim.xyz);
                float mdif  = max(dot(ldir, mnor), 0.0);
                float mf    = smoothstep(0.0, 10000.0, md.y - md.x);
                float imfre = 1.0 - (1.0+dot(rd, mnor)); 

                vec3 col = mdif*mcol0*4.0;
                
                // Mock FFT behavior since we don't have iChannel0
                vec3 fcol = vec3(0.0);
                vec2 msp = toSpherical(-mnor.zxy).yz;
                float msf = sin(msp.x);
                msp.x -= PI*0.5;
                const float mszy = (TAU/(4.0))*0.125; 
                float msny = mod1(msp.y, mszy);
                msp.y *= msf;

                float fft = 0.5 + 0.5*sin(TIME); // Mock FFT
                float d1 = length(msp)-0.05*fft;
                vec3 mcol2 = hsv2rgb(vec3(mix(0.66, 0.99, fft), 0.85, 1.0));
                fcol += mcol2*5.0*tanh_approx(0.00025/(max(d1, 0.0)*max(d1, 0.0)))*imfre*msf;
                
                col += fcol * smoothstep(18.0, 24.0, TIME);
                return vec4(col, mf);
            }

            vec3 skyColor(vec3 ro, vec3 rd) {
                const vec3 acol   = vec3(0.1, 0.05, 0.2); 
                const vec3 lcol   = vec3(0.5, 0.6, 1.0);
                vec2 sp     = toSpherical(rd.xzy).yz;
                float lf    = pow(max(dot(ldir, rd), 0.0), 80.0);
                float li    = 0.1*mix(1.0, 10.0, lf)/(abs((rd.y+0.055))+0.025);
                float lz    = step(-0.055, rd.y);
                vec4 mcol   = moon(ro, rd);
                vec3 col = stars(sp, 0.25)*smoothstep(0.5, 0.0, li)*lz;  
                col  = mix(col, mcol.xyz, mcol.w);
                col += smoothstep(-0.4, 0.0, (sp.x-PI*0.5))*acol;
                col += tanh(lcol * li);
                return col;
            }

            vec3 color(vec3 ww, vec3 uu, vec3 vv, vec3 ro, vec2 p) {
                vec2 np = p + 2.0/RESOLUTION.y;
                vec3 rd = normalize(p.x*uu + p.y*vv + 2.0*ww);
                vec3 nrd = normalize(np.x*uu + np.y*vv + 2.0*ww);
                const float planeDist = 1.0;
                const int furthest = 12;
                float nz = floor(ro.z / planeDist);
                vec3 skyCol = skyColor(ro, rd);
                vec4 acol = vec4(0.0);

                for (int i = 1; i <= 12; ++i) {
                    float pz = planeDist*nz + planeDist*float(i);
                    float pd = (pz - ro.z)/rd.z;
                    vec3 pp = ro + rd*pd;
                    if (pp.y < 0. && pd > 0.0 && acol.w < 0.95) {
                        vec4 pcol = plane(ro, rd, pp, ro + nrd*pd, vec3(0.0), nz+float(i));
                        pcol.xyz = mix(skyCol, pcol.xyz, smoothstep(12.0, 10.0, pd));
                        acol = alphaBlend(pcol, acol);
                    } else if (acol.w >= 0.95) { break; }
                }
                return alphaBlend(skyCol, acol);
            }

            void main() {
                vec2 q = gl_FragCoord.xy / RESOLUTION.xy;
                vec2 p = -1. + 2. * q;
                p.x *= RESOLUTION.x/RESOLUTION.y;
                float tm = TIME*0.25;
                vec3 ro = vec3(0.0, 0.0, tm);
                vec3 dro = normalize(vec3(0.0, 0.09, 1.0));  
                vec3 ww = dro;
                vec3 uu = normalize(cross(vec3(0.0,1.0,0.0), ww));
                vec3 vv = normalize(cross(ww, uu));
                vec3 col = color(ww, uu, vv, ro, p);
                gl_FragColor = vec4(col, 1.0);
            }
        `;

        const createShader = (type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const program = gl.createProgram();
        gl.attachShader(program, createShader(gl.VERTEX_SHADER, vertexShaderSource));
        gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fragmentShaderSource));
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const iResolutionLocation = gl.getUniformLocation(program, 'iResolution');
        const iTimeLocation = gl.getUniformLocation(program, 'iTime');

        let animationFrameId;
        const render = (time) => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);

            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
            gl.uniform1f(iTimeLocation, time * 0.001);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
        />
    );
};

export default BackgroundShader;
