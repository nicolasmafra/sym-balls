document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');

    function createSVGWithGradient() {
        const svgNS = "http://www.w3.org/2000/svg";

        // Cria o elemento SVG
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'draggable');
        svg.setAttribute('id', 'item1');
        svg.setAttribute('viewBox', '0 0 120 240');
        svg.setAttribute('width', '120');
        svg.setAttribute('height', '240');

        // Chama a função que monta o grupo e adiciona ao SVG
        const group = createGroupWithGradient(svgNS, 'g1', 'red', 'green', 'blue', 30, 60, 90);
        svg.appendChild(group);

        // Adiciona o SVG ao container
        container.appendChild(svg);
    }

    function createGroupWithGradient(svgNS, id, color1, color2, color3, x0, x1, x2) {
        const y0 = 30;
        const dy = 60;
        const dx1 = x1 - x0;
        const dx2 = x2 - x1;

        // Cria o elemento grupo
        const group = document.createElementNS(svgNS, 'g');

        // Cria o elemento defs
        const defs = document.createElementNS(svgNS, 'defs');

        // Cria o elemento linearGradient
        const linearGradient = document.createElementNS(svgNS, 'linearGradient');
        linearGradient.setAttribute('id', id);
        linearGradient.setAttribute('gradientTransform', 'rotate(90)');

        // Cria os elementos stop
        const stop1 = document.createElementNS(svgNS, 'stop');
        stop1.setAttribute('offset', '0');
        stop1.setAttribute('stop-color', color1);

        const stop2 = document.createElementNS(svgNS, 'stop');
        stop2.setAttribute('offset', '0.5');
        stop2.setAttribute('stop-color', color2);
        stop2.classList.add('animated-stop1');

        const stop3 = document.createElementNS(svgNS, 'stop');
        stop3.setAttribute('offset', '1');
        stop3.setAttribute('stop-color', color3);
        stop3.classList.add('animated-stop2');

        // Adiciona os elementos stop ao linearGradient
        linearGradient.appendChild(stop1);
        linearGradient.appendChild(stop2);
        linearGradient.appendChild(stop3);

        // Adiciona o linearGradient ao defs
        defs.appendChild(linearGradient);

        // Adiciona o defs ao grupo
        group.appendChild(defs);

        // Cria o elemento path
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('stroke', `url(#${id})`);
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'transparent');

        // Cria a animação do path
        const animate = document.createElementNS(svgNS, 'animate');
        animate.setAttribute('attributeName', 'd');
        animate.setAttribute('values',
            `M ${x0} ${y0} c 0 ${dy/2}, ${dx1} ${dy/2}, ${dx1} ${dy} c  0 ${dy/2}, ${dx2} ${dy/2}, ${dx2} ${dy};
             M ${x0} ${y0} c 0 ${dy/4}, 7.5 ${dy*3/8}, 15 ${dy/2} c 7.5 ${dy/8}, 15 ${dy/4}, 15 ${dy/2}`);
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
    createSVGWithGradient();
});