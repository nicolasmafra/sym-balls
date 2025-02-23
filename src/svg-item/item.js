document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');

    function createSVGWithGradient(color1, color2, color3) {
        const svgNS = "http://www.w3.org/2000/svg";

        // Cria o elemento SVG
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'draggable');
        svg.setAttribute('id', 'item1');
        svg.setAttribute('viewBox', '0 0 120 240');
        svg.setAttribute('width', '120');
        svg.setAttribute('height', '240');

        // Chama a função que monta o grupo e adiciona ao SVG
        const group = createGroupWithGradient(svgNS, color1, color2, color3);
        svg.appendChild(group);

        // Adiciona o SVG ao container
        container.appendChild(svg);
    }

    function createGroupWithGradient(svgNS, color1, color2, color3) {
        // Cria o elemento grupo
        const group = document.createElementNS(svgNS, 'g');

        // Cria o elemento defs
        const defs = document.createElementNS(svgNS, 'defs');

        // Cria o elemento linearGradient
        const linearGradient = document.createElementNS(svgNS, 'linearGradient');
        linearGradient.setAttribute('id', 'gradient1');
        linearGradient.setAttribute('gradientTransform', 'rotate(90)');

        // Cria os elementos stop
        const stop1 = document.createElementNS(svgNS, 'stop');
        stop1.setAttribute('offset', '0');
        stop1.setAttribute('stop-color', color1);

        const stop12 = document.createElementNS(svgNS, 'stop');

        // Adiciona os elementos animate aos stops
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
        path.setAttribute('stroke', 'url(#gradient1)');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'transparent');

        // Cria a animação do path
        const animate = document.createElementNS(svgNS, 'animate');
        animate.setAttribute('attributeName', 'd');
        animate.setAttribute('values', 'M 30 30 c 0 30,  30   30, 30 60 c  0  30,  30 30, 30 60; M 30 30 c 0 15, 7.5 22.5, 15 30 c 7.5 7.5, 15 15, 15 30');
        animate.setAttribute('dur', '1s');
        animate.setAttribute('fill', 'freeze');
        animate.setAttribute('calcMode', 'spline');
        animate.setAttribute('keyTimes', '0; 1');
        animate.setAttribute('keySplines', '0.5 0 0.5 1');

        // Adiciona a animação ao path
        path.appendChild(animate);

        // Adiciona o path ao grupo
        group.appendChild(path);

        return group;
    }

    // Chama a função com as cores desejadas
    createSVGWithGradient('red', 'green', 'blue');
});