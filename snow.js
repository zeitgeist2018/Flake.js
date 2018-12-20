const fps = 25;
const maxFlakes = 250;
const flakeSize = {
    min: 5,
    max: 15
};
const vels = {
    x: {
        min: 1,
        max: 1
    },
    y: {
        min: 1,
        max: 2
    }
}

const screenSize = getScreenSize();

function getScreenSize(){
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    w = w.innerWidth || e.clientWidth || g.clientWidth,
    h = w.innerHeight|| e.clientHeight|| g.clientHeight;
    return {w, h}
}

function Flake(props){
    var that = {};
    that.id = 'snowflake_' + Math.random().toString(36).substr(2, 9);
    that.inDom = false;
    that.x = props.x || 0;
    that.y = props.y || 0;
    that.velX = props.velX || getRandomVelX();
    that.velY = props.velY || getRandomVelY();
    that.life = props.life || 100;
    that.size = Math.round((Math.random() * flakeSize.max) + flakeSize.min);
    that.rotation = Math.round(Math.random() * 360);
    that.direction = Math.random() >= 0.5 ? 'left' : 'right';
    that.swingLimit = 1;
    that.swingVel = 0.1;

    that.move = function(){
        that.x = (that.x + that.velX);
        that.y += that.velY;
        that.life = Math.round(((screenSize.h - that.y) * 100) / screenSize.h);
        if(that.direction === 'left' && that.velX > -that.swingLimit){
            that.velX -= that.swingVel;
        } else if(that.direction === 'left' && that.velX <= -that.swingLimit){
            that.velX += that.swingVel;
            that.direction = 'right'
        } else if(that.direction === 'right' && that.velX < that.swingLimit){
            that.velX += that.swingVel;
        } else {
            that.velX -= that.swingVel;
            that.direction = 'left'
        }
    }

    that.render = function(){
        let flakeElement = undefined;
        if(that.inDom === false){
            flakeElement = document.createElement('div');
            flakeElement.setAttribute("id", that.id);
            flakeElement.classList.add('snowflake');
            document.body.appendChild(flakeElement);
            that.inDom = true;
        } else {
            flakeElement = document.getElementById(that.id);
        }
        flakeElement.innerHTML = '&#x2744;';
        const opacity = (that.y < 5 ? that.y / 5 : that.life / 50).toFixed(2);
        flakeElement.setAttribute("style", `
                left: ${that.x}px;
                top: ${that.y}px;
                font-size: ${that.size}px;
                opacity: ${opacity};
                -webkit-transform: rotate(${that.rotation}deg);
        `);
    }

    that.clear = function(){
        document.body.removeChild(document.getElementById(that.id));
    }

    return that;
}
const flakes = [];

init();

function init(){
    setSnowFlakesStyles();
    setInterval(renderSnow, 1000 / fps);
}

function setSnowFlakesStyles(){
    const styles = document.createElement('style');
    styles.innerHTML = `
        .snowflake{
            color: white;
            position: absolute;
        }
    `;
    document.head.appendChild(styles);
}

function renderSnow(){
    if(flakesBelowLimit() && Math.random() >= 0.5){
        createFlake();
    }
    removeDeadFlakes();
    moveFlakes();
    clearDeadFlakes();
    renderFlakes();
}

function clearDeadFlakes(){
    const flakesToClear = flakes.filter(f => f.life < 0);
    flakesToClear.forEach(flake => {
        flake.clear();
        flakes.splice(flakes.indexOf(flake), 1);
    });
}

function renderFlakes(){
    flakes.forEach(flake => flake.render());
}

function applyWind(){
    flakes.forEach(flake => flake.applyWind());
}

function moveFlakes(){
    flakes.forEach(flake => flake.move());
}

function removeDeadFlakes(){
    for(let i = flakes.length - 1; i >= 0; i--){
        if(flakes[i].life <= 0){
            flakes[i].clear();
            flakes.splice(i, 1);
        }
    }
}

function createFlake(){
    const pos = generateNewPosition();
    flakes.push(new Flake({
        x: pos.x,
        y: pos.y,
    }));
}

function generateNewPosition(){
    return {
        x: Math.round(Math.random() * screenSize.w),
        y: 1
    }
}

function getRandomVelX(){
    let vel = Math.round((Math.random() * vels.x.max) + vels.x.min);
    return Math.random() >= 0.5 ? vel * -1 : vel;
}

function getRandomVelY(){
    return Math.round((Math.random() * vels.y.max) + vels.y.min);
}

function flakesBelowLimit(){
    return flakes.length < maxFlakes;
}