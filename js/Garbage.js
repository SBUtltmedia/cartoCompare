// function getParameterByName(name, url) {
//   if (!url) url = window.location.href;
//   name = name.replace(/[\[\]]/g, "\\$&");
//   var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
//     results = regex.exec(url);
//   if (!results) return null;
//   if (!results[2]) return '';
//   return decodeURIComponent(results[2].replace(/\+/g, " "));
// }
// function extractLayerDecades() {
//   $.each($("input[name='L']:checked"), function(year) {
//     IDsHover["L"] = year
//   });
//   $.each($("input[name='R']:checked"), function(year) {
//     IDsHover["R"] = year
//   });
//     console.log(IDsHover);
// }
