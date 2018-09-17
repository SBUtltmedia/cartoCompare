// Factory to make a new base for videos when a spot is clicked
var tubeFactory = {
  newVid: function(data) {
    // All parts of the vidBase and the base itself
    if (!player) {
      var crossSVG = $(xCross);
      var vidBase = $('<div>');
      var vidVideo = $('<div>');
      var vidTitle = $('<div>');

      vidBase.append(vidTitle, crossSVG, vidVideo);

      // Displays the videobase on the website
      $('#playerHolder').append(vidBase)

      //---------------------\\

      vidTitle.attr('id', 'vidTitle')
      vidTitle.css('text-align', 'center')

      vidBase.attr('id', 'vidBase');
      vidBase.attr('class', 'vidBase');

      vidVideo.attr('id', 'vidVideoHolder');
      vidVideo.css('width: 420px; height: 236.75px;padding:10px');

      crossSVG.attr("id", 'vidCross');
      crossSVG.css("margin", "-17.5 405 0");
      crossSVG.css("display", "block");
      //---------------------\\

      // The functions of each svg
      //---------------------\\
      crossSVG.on("click", function(evt) {
        vidBase.css('visibility', 'hidden');
        crossSVG.css('visibility', 'hidden');
        player.loadVideoById('');
      })
      //---------------------\\

      //console.log(document.getElementById(vidBase.attr('id')));
      dragElement(document.getElementById(vidBase.attr('id')));
    }
  }
}

// When the video is ready, play it
function onPlayerReady(event) {
  event.target.playVideo();
}
