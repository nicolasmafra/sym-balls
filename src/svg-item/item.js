const svgNS = "http://www.w3.org/2000/svg";

var gradCounter = 0;
const d = 0.0001;

function createAnimatedSVG(mappings, item1, item2) {

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'draggable');
    svg.setAttribute('viewBox', '0 0 120 120');
    svg.setAttribute('width', '120');
    svg.setAttribute('height', '120');

    mappings.forEach((_, i) => {
        const mapping1 = mappings[i];
        const mapping2 = mappings[item1[i]];
        const mapping3 = mappings[item2[item1[i]]];

        appendGroupWithGradient(svg, mapping1, mapping2, mapping3);
    });

    return svg;
}

function appendGroupWithGradient(svg, mapping1, mapping2, mapping3) {
    const gradId = 'gradient' + (gradCounter++);
    const x0 = 30;
    const y0 = 30;
    const dx = 30;
    const dy = 60;
    const color1 = mapping1.color;
    const color2 = mapping2.color;
    const color3 = mapping3.color;
    const x1 = x0 + dx*mapping1.x;
    const x2 = x0 + dx*mapping2.x;
    const x3 = x0 + dx*mapping3.x;
    const x21 = x2 - x1 + d;
    const x32 = x3 - x2 + d;
    const x31 = x3 - x1 + d;

    const group = document.createElementNS(svgNS, 'g');

    const defs = document.createElementNS(svgNS, 'defs');

    const linearGradient = document.createElementNS(svgNS, 'linearGradient');
    linearGradient.setAttribute('id', gradId);
    linearGradient.setAttribute('gradientTransform', 'rotate(90)');

    const stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', '0');
    stop1.setAttribute('stop-color', color1);

    const stop12 = document.createElementNS(svgNS, 'stop');

    const animateOffset1 = document.createElementNS(svgNS, 'animate');
    animateOffset1.setAttribute('attributeName', 'offset');
    animateOffset1.setAttribute('values', '0.5; 0');
    animateOffset1.setAttribute('dur', '1s');
    animateOffset1.setAttribute('fill', 'freeze');
    animateOffset1.setAttribute('calcMode', 'spline');
    animateOffset1.setAttribute('keyTimes', '0; 1');
    animateOffset1.setAttribute('keySplines', '0.5 0 0.5 1');
    stop12.appendChild(animateOffset1);

    const animateStopColor1 = document.createElementNS(svgNS, 'animate');
    animateStopColor1.setAttribute('attributeName', 'stop-color');
    animateStopColor1.setAttribute('values', `${color2}; ${color1}`);
    animateStopColor1.setAttribute('dur', '1s');
    animateStopColor1.setAttribute('fill', 'freeze');
    animateStopColor1.setAttribute('calcMode', 'spline');
    animateStopColor1.setAttribute('keyTimes', '0; 1');
    animateStopColor1.setAttribute('keySplines', '0.5 0 0.5 1');
    stop12.appendChild(animateStopColor1);

    const stop23 = document.createElementNS(svgNS, 'stop');

    const animateOffset2 = document.createElementNS(svgNS, 'animate');
    animateOffset2.setAttribute('attributeName', 'offset');
    animateOffset2.setAttribute('values', '0.5; 1');
    animateOffset2.setAttribute('dur', '1s');
    animateOffset2.setAttribute('fill', 'freeze');
    animateOffset2.setAttribute('calcMode', 'spline');
    animateOffset2.setAttribute('keyTimes', '0; 1');
    animateOffset2.setAttribute('keySplines', '0.5 0 0.5 1');
    stop23.appendChild(animateOffset2);

    const animateStopColor2 = document.createElementNS(svgNS, 'animate');
    animateStopColor2.setAttribute('attributeName', 'stop-color');
    animateStopColor2.setAttribute('values', `${color2}; ${color3}`);
    animateStopColor2.setAttribute('dur', '1s');
    animateStopColor2.setAttribute('fill', 'freeze');
    animateStopColor2.setAttribute('calcMode', 'spline');
    animateStopColor2.setAttribute('keyTimes', '0; 1');
    animateStopColor2.setAttribute('keySplines', '0.5 0 0.5 1');
    stop23.appendChild(animateStopColor2);

    const stop3 = document.createElementNS(svgNS, 'stop');
    stop3.setAttribute('offset', '1');
    stop3.setAttribute('stop-color', color3);

    // Adiciona os elementos stop ao linearGradient
    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop12);
    linearGradient.appendChild(stop23);
    linearGradient.appendChild(stop3);

    // Adiciona o linearGradient ao defs
    defs.appendChild(linearGradient);

    // Adiciona o defs ao grupo
    group.appendChild(defs);

    // Cria o elemento path
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('stroke', `url(#${gradId})`);
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'transparent');

    // Cria a animação do path
    const animate = document.createElementNS(svgNS, 'animate');
    animate.setAttribute('attributeName', 'd');
    animate.setAttribute('values', `
        M ${x1} ${y0} c 0 ${dy/2}, ${x21} ${dy/2}, ${x21} ${dy} c  0  ${dy/2},  ${x32} ${dy/2}, ${x32} ${dy};
        M ${x1} ${y0} c 0 ${dy/4}, ${x31/4} ${dy*3/8}, ${x31/2} ${dy/2} c ${x31/4} ${dy/8}, ${x31/2} ${dy/4}, ${x31/2} ${dy/2}`);
    animate.setAttribute('dur', '1s');
    animate.setAttribute('fill', 'freeze');
    animate.setAttribute('calcMode', 'spline');
    animate.setAttribute('keyTimes', '0; 1');
    animate.setAttribute('keySplines', '0.5 0 0.5 1');

    path.appendChild(animate);
    group.appendChild(path);
    svg.appendChild(group);
}

const mapping = [
    {
        color: 'red',
        x: 0,
    },
    {
        color: 'green',
        x: 1,
    },
    {
        color: 'blue',
        x: 2,
    },
];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');

    const item1 = createAnimatedSVG(mapping, [1, 2, 0], [1, 2, 0]);
    item1.setAttribute('id', 'item1');
    item1.style.setProperty('--x', '0px');
    item1.style.setProperty('--y', '0px');
    container.appendChild(item1);

    const item2 = createAnimatedSVG(mapping, [1, 0, 2], [0, 2, 1]);
    item2.setAttribute('id', 'item2');
    item2.style.setProperty('--x', '100px');
    item2.style.setProperty('--y', '100px');
    container.appendChild(item2);
});