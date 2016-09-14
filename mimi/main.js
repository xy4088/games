(function() {
    var startBtn = document.getElementById('startBtn'),
        run = document.getElementById('rotary-run'),
        light = document.getElementById('light'),
        degArr = [22, 66, 112, 156, 202, 247, 292, 336],
        btnClick = false;
    startBtn.onclick = function() {
        if(btnClick) return;
        btnClick = true;
        run.setAttribute("style", "-webkit-transform: rotate(0deg); transform: rotate(0deg);");
        var random = degArr[Math.floor(Math.random()*7)];
        run.setAttribute("style", "-webkit-transform: rotate("+(random+720)+"deg); transform: rotate("+(random+720)+"deg); transition: all 3s ease-in-out; transition: all 3s ease-in-out;");
        setTimeout(function() {
            run.setAttribute("style", "-webkit-transform: rotate("+random+"deg); transform: rotate("+random+"deg);");
            btnClick = false;
        }, 3000);
    }
})();