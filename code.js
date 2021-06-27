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
            }
            ip.value = tmp;
        }
    });
}

document.getElementById('set').addEventListener('click', () => {
    set();
  });
