// function Checkfunc() {
//     var checkBox = document.getElementById("check-detect");
//     var location = document.getElementById("location");
  
//     if (checkBox.checked == true) {
//       location.value = "Auto-Detecting";
//       location.disabled = true;
//     } else {
//       location.disabled = false;
//     }
// }

// function clear() {
//     document.getElementById("result-area").innerHTML = "";
//     document.getElementById("keyword").value = "";
//     document.getElementById("location").value = "";
//     document.getElementById("distance").value = "10";
//     document.getElementById("category").value = "default";
//     document.getElementById("check-detect").checked = false;
//   }

function showMore1() {
  var text = document.getElementById("openHoursDetail");
  var button = document.getElementById("showMoreButton1");
  if (text) {
    if (text.style.overflow === "visible") {
      text.style.overflow = "hidden";
      text.style.maxHeight = "40px";
      button.innerHTML = "Show More&or;";
    } else {
      text.style.overflow = "visible";
      text.style.maxHeight = "50000px";
      button.innerHTML = "Show Less&and;";
    }
  }

}

function showMore2() {
  var text = document.getElementById("generalRule");
  var button = document.getElementById("showMoreButton2");
  if (text) {
    if (text.style.overflow === "visible") {
      text.style.overflow = "hidden";
      text.style.maxHeight = "40px";
      button.innerHTML = "Show More&or;";

    } else {
      text.style.overflow = "visible";
      text.style.maxHeight = "50000px";
      button.innerHTML = "Show Less&and;";
    }
  }

}

function showMore3() {
  var text = document.getElementById("childRule");
  var button = document.getElementById("showMoreButton3");
  if (text) {
    if (text.style.overflow === "visible") {
      text.style.overflow = "hidden";
      text.style.maxHeight = "40px";
      button.innerHTML = "Show More&or;";
    } else {
      text.style.overflow = "visible";
      text.style.maxHeight = "50000px";
      button.innerHTML = "Show Less&and;";
    }
  }

}
