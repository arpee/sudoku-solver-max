var delay = document.getElementById("delay").value;
var possible = [];


function check(thing, val) {
    var ok = true;
    //console.log(document.querySelectorAll("." + thing));
    document.querySelectorAll("." + thing).forEach(s => {
        if (val == s.value) {
            //console.log(val + " - " + s.value);
            ok = false;
        }
    });
    return ok;
}

function checkSq(id, val) {
    var ok = true;
    document.getElementById(id).classList.forEach(c => {
        if (!check(c, val)) {
            ok = false;
        }
    });
    return ok;
}

function set() {
    var setup_good = true;
    document.querySelectorAll(".grid input").forEach(ip => {
        if (ip.value > 0) {
            //console.log(ip.id + " - " + ip.value);
            var tmp = ip.value;
            ip.value = "";
            if (checkSq(ip.id, tmp)) {
                ip.disabled = true;
                ip.style.color = "#369";
            } else {
                ip.style.color = "#f00";
                setup_good = false;
            }
            ip.value = tmp;
        }
    });
    if (setup_good == true) {
        console.log(setup_good);
        document.getElementById('solve').disabled = false;
        document.getElementById('solve').addEventListener('click', () => {
            solve();
        });
    }
}

document.getElementById('set').addEventListener('click', () => {
    set();
});
document.getElementById('reset').addEventListener('click', () => {
    window.location = window.location;
});


async function solve() {
    delay = document.getElementById("delay").value;
    await smartsolve();
    bruteforce();
}

function bruteforce() {
    var sq = 0;
    fwd(sq);
}

function fwd(sq) {
    var trysq = sq + 1;
    var succ = false;
    if (document.getElementById(trysq).disabled == true) {
        succ = true;
    } else {
        for (let n = 1; n <= 9; n++) {
            if (checkSq(trysq, n) == true) {
                document.getElementById(trysq).value = n;
                succ = true;
                console.log("added " + n + " to " + trysq);
                n = 10;
            }
        }
    }
    if (succ == true) {
        if (trysq == 81) {
            console.log("Success!");
            document.querySelector(".announce").innerHTML = "Success!";
            document.getElementById("reset").style.display = "block";
            document.getElementById("set").style.display = "none";
            document.getElementById("solve").style.display = "none";
        } else {
            setTimeout(() => {
                fwd(trysq);
            }, delay);
        }
    } else {
        console.log(false);
        document.getElementById(trysq).value = "";
        setTimeout(() => {
            bk(trysq);
        }, delay);
    }
}

function bk(sq) {
    trysq = sq - 1;
    //console.log('back to ' + trysq);
    var succ = false;
    if (document.getElementById(trysq).disabled == true) {
        succ = false;
    } else {
        var n = parseInt(document.getElementById(trysq).value);
        var m = n + 1;
        //console.log("m = " + m);

        while (m < 10) {
            console.log("m = " + m);
            if (checkSq(trysq, m) == true) {
                document.getElementById(trysq).value = m;
                succ = true;
                m = 11;
            } else {
                m++;
            }
        }
    }
    if (succ == true) {
        //console.log("found an option");
        setTimeout(() => {
            fwd(trysq);
        }, delay);
    } else {
        //console.log('cant add, n = ' + n);
        //console.log('cant add - back trysq = ' + trysq);
        if (document.getElementById(trysq).disabled == false) {
            document.getElementById(trysq).value = null;
        }
        if (trysq == 1) {
            console.log("Unsolveable");
            document.querySelector(".announce").innerHTML = "Unsolveable!";
        } else {
            setTimeout(() => {
                bk(trysq);
            }, delay);
        }
    }
}

async function smartsolve() {
    console.log("Starting Smart Solve");
    var boardupdated = "no";
    for (let sq = 1; sq <= 81; sq++) {
        if (document.getElementById(sq).disabled != true) {
            var uniq = await findunique(sq);
            if (uniq == "yes") {
                boardupdated = "yes";
            }
        }
        await sleep(delay);
    }
    if (boardupdated == "yes") {
        //setTimeout(() => {
        await smartsolve();
        //}, delay);
    }
    console.log("Smart Solve Complete");
    return "finished";
}

async function findunique(sq) {
    possible = [];
    for (let num = 1; num <= 9; num++) {
        var test = checkSq(sq, num);
        if (test) {
            possible.push(num);
        }
        document.getElementById(sq).value = num;
        await sleep(delay);
        document.getElementById(sq).value = "";
    }
    if (possible.length == 1) {
        console.log("Only one possibility: " + possible[0]);
        var sqtoset = document.getElementById(sq);
        sqtoset.value = possible[0];
        sqtoset.disabled = true;
        sqtoset.style.color = "#396";
        return "yes";
    } else {
        return "no";
    }
}


function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}




function clear() {
    document.querySelectorAll(".grid input").forEach(ip => {
        if (ip.disabled == false || ip.style.color == "#396") {
            ip.disabled = false;
            ip.value = "";
            ip.style.color = "#FFF";
        }
    });
}