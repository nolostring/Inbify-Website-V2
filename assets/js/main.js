$(document).ready(function() {

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
     var time = 0;
      $('.how-block').each(function() {
          var self = $(this);
          time += 500;
          setTimeout(function() {
            self.addClass('turn-on');
          }, time);
          
      });
    } 
  $('.video-loop-container').css({'background-position-y': '-' + ($(window).scrollTop()/2) + 'px'});
  
  $('.video-cta').on('click', function() {
    post('play');
  });

  $('.close').on('click', function() {
    post('pause');
    // post('seekTo', 0);
  });

      var player = $('iframe');
      var playerOrigin = '*';
      var status = $('.status');

      // Listen for messages from the player
      if (window.addEventListener) {
          window.addEventListener('message', onMessageReceived, false);
      }
      else {
          window.attachEvent('onmessage', onMessageReceived, false);
      }

      // Handle messages received from the player
      function onMessageReceived(event) {
          // Handle messages from the vimeo player only
          if (!(/^https?:\/\/player.vimeo.com/).test(event.origin)) {
              return false;
          }
          
          if (playerOrigin === '*') {
              playerOrigin = event.origin;
          }
          
          var data = JSON.parse(event.data);
          
          switch (data.event) {
              case 'ready':
                  onReady();
                  break;
                 
              case 'playProgress':
                  onPlayProgress(data.data);
                  break;
                  
              case 'pause':
                  onPause();
                  break;
                 
              case 'finish':
                  onFinish();
                  break;
          }
      }

      // Call the API when a button is pressed
      $('button').on('click', function() {
          post($(this).text().toLowerCase());
      });

      // Helper function for sending a message to the player
      function post(action, value) {
          var data = {
            method: action
          };
          
          if (value) {
              data.value = value;
          }
          
          var message = JSON.stringify(data);
          // if (value == 0) {
          //   player[0].contentWindow.postMessage('seekTo', 0);
          // } else {
            player[0].contentWindow.postMessage(data, playerOrigin);
          // }
          
      }

      function onReady() {
          status.text('ready');
          post('addEventListener', 'pause');
          post('addEventListener', 'finish');
          post('addEventListener', 'playProgress');
      }

      function onPause() {
          status.text('pause');
          // player.api("seekTo", 0);
//           $('iframe').each(function() {
//   this.contentWindow.location.reload(true);
// });
      }

      function onFinish() {
          $('.close').click();
          status.text('finished');
      }

      function onPlayProgress(data) {
          status.text(data.seconds + 's played');
      }

  
});


