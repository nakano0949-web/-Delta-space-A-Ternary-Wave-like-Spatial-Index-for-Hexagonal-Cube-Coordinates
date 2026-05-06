const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const panel = document.getElementById('ui-panel');
const hexSize = 18;

panel.onclick = (e) => {
    if (!e.target.closest('.info-content'))
        panel.classList.toggle('collapsed');
};

// Delta-space 2.0: 6方向ベクトル (DIR6)
const DIR6 = [
    {x: 1, y:-1, z: 0}, {x: 1, y: 0, z:-1}, {x: 0, y: 1, z:-1},
    {x:-1, y: 1, z: 0}, {x:-1, y: 0, z: 1}, {x: 0, y:-1, z: 1}
];

function getCube(px, py) {
    let x = (px - window.innerWidth/2) / hexSize * (2/3);
    let z = (-(px - window.innerWidth/2)/3 + Math.sqrt(3)/3 * (py - window.innerHeight/2)) / hexSize;
    let y = -x - z;

    let rx = Math.round(x), ry = Math.round(y), rz = Math.round(z);

    if (Math.abs(rx-x) > Math.abs(ry-y) && Math.abs(rx-x) > Math.abs(rz-z)) rx = -ry-rz;
    else if (Math.abs(ry-y) > Math.abs(rz-z)) ry = -rx-rz;
    else rz = -rx-ry;

    return { x: rx, y: ry, z: rz };
}

canvas.onclick = (e) => {
    const target = getCube(e.clientX, e.clientY);
    const l1 = (Math.abs(target.x) + Math.abs(target.y) + Math.abs(target.z)) / 2;

    document.getElementById('coords').innerText =
        `座標: (${target.x}, ${target.y}, ${target.z})`;

    document.getElementById('dist').innerText = `L1 Dist: ${l1}`;

    let rx = target.x, ry = target.y, rz = target.z;
    const digitsDiv = document.getElementById('digits');
    digitsDiv.innerHTML = "";
    let keyBinary = "";

    for (let d = 0; d < 12; d++) {

        if (rx === 0 && ry === 0 && rz === 0) {
            keyBinary += "00000";
            digitsDiv.innerHTML +=
                `<div class="digit-item">D${d.toString().padStart(2,'0')}: ZERO [00000]</div>`;
            continue;
        }

        let maxDot = -Infinity;
        let bestDirIdx = 0;

        for (let i = 0; i < 6; i++) {
            const dot = rx * DIR6[i].x + ry * DIR6[i].y + rz * DIR6[i].z;
            if (dot > maxDot) {
                maxDot = dot;
                bestDirIdx = i;
            }
        }

        const digitValue = bestDirIdx;
        keyBinary += digitValue.toString(2).padStart(5, '0');

        digitsDiv.innerHTML +=
            `<div class="digit-item">D${d.toString().padStart(2,'0')}: Dir${bestDirIdx} [${digitValue.toString(2).padStart(5,'0')}]</div>`;

        rx -= DIR6[bestDirIdx].x;
        ry -= DIR6[bestDirIdx].y;
        rz -= DIR6[bestDirIdx].z;
    }

    document.getElementById('key-display').innerText =
        `Key: 0x${target.x.toString(16).padStart(4,'0')}${target.y.toString(16).padStart(4,'0')}${target.z.toString(16).padStart(4,'0')}`.toUpperCase();

    draw();
    highlightHex(target.x, target.y, target.z);
};

function draw() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let q = -30; q <= 30; q++) {
        for (let r = Math.max(-30, -q-30); r <= Math.min(30, -q+30); r++) {
            const pos = {
                x: hexSize * 3/2 * q + canvas.width/2,
                y: hexSize * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r) + canvas.height/2
            };

            ctx.beginPath();
            for (let i = 0; i < 6; i++)
                ctx.lineTo(pos.x + hexSize * Math.cos(Math.PI/3*i),
                           pos.y + hexSize * Math.sin(Math.PI/3*i));

            ctx.closePath();
            ctx.strokeStyle = "rgba(0, 200, 255, 0.25)";
            ctx.stroke();
        }
    }
}

function highlightHex(x, y, z) {
    const p = {
        x: hexSize * 3/2 * x + canvas.width/2,
        y: hexSize * (Math.sqrt(3)/2 * x + Math.sqrt(3) * z) + canvas.height/2
    };

    ctx.beginPath();
    for (let i = 0; i < 6; i++)
        ctx.lineTo(p.x + hexSize * Math.cos(Math.PI/3*i),
                   p.y + hexSize * Math.sin(Math.PI/3*i));

    ctx.closePath();
    ctx.fillStyle = "rgba(0, 229, 255, 0.3)";
    ctx.fill();
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 2;
    ctx.stroke();
}

window.onresize = draw;
draw();
