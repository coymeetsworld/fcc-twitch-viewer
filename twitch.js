$(document).ready(function() {

  //const NO_USER_ICON_URL= "http://www.brandsoftheworld.com/sites/default/files/styles/logo-thumbnail/public/022015/twitch.png?itok=kKyIL2PQ";
  const NO_USER_ICON_URL= "https://dl.dropboxusercontent.com/u/26748984/web-project-resources/freecodecamp/TwitchViewer/twitchDefaultIcon.png";
  function createUserImage(src) {
    var imageTag = $('<img>');
    imageTag.addClass('userIcon');

    if (src != null) {
      imageTag.attr('src', src);
    } else {
      imageTag.attr('src', NO_USER_ICON_URL);
    }
    return imageTag;
  }

  /* DRY */
  function createPreviewImage(src) {
    var imageTag = $('<img>');
    imageTag.attr('src',src);
    return imageTag;
  }

  function createLink(streamer_name) {
    var link = $('<a>');
    link.attr('href', 'http://www.twitch.tv/' + streamer_name);
    link.attr('target', '_blank');
    link.html(streamer_name);
    return link;
  }

  $("#filter_none").click(function() {
    $(".channel_online").removeClass("hidden");
    $(".channel_offline").removeClass("hidden");
  });
  $("#filter_offline").click(function() {
    $(".channel_online").addClass("hidden");
    $(".channel_offline").removeClass("hidden");
  });
  $("#filter_online").click(function() {
    $(".channel_offline").addClass("hidden");
    $(".channel_online").removeClass("hidden");
  });

  function getUsers(user) {

    $.getJSON('https://api.twitch.tv/kraken/users/' + user + '?callback=?', function (userData) {

      console.log("User data");
      console.log("-------------------------");
      console.log(userData);
      console.log("-------------------------");
      console.log("End user data");

      /*
        What this contains:
        bio: "Wizards of the Coast's official live streaming channel for Magic: The Gathering tournaments and convention coverage."
        display_name: Magic
        logo: logo url
      */
      var channelItem = $('<li>');
      channelItem.attr('class', 'flex-item');

      var iconColumn = $('<div>');
      iconColumn.attr('class', 'streamerIcon');
      $(createUserImage(userData.logo)).appendTo(iconColumn);
      $(iconColumn).appendTo(channelItem);

      var nameColumn = $('<div>');
      nameColumn.attr('class', 'streamerName');
      $(createLink(userData.display_name)).appendTo(nameColumn);
      $(nameColumn).appendTo(channelItem);

      $.getJSON('https://api.twitch.tv/kraken/streams/' + userData.name + '?callback=?', function(streamData) {

        console.log("Stream data");
        console.log("-------------------------");
        console.log(streamData);
        console.log("-------------------------");
        console.log("Stream data");
        /* What it contains
            stream.preview.large;
            stream.channel.created_at: Time when stream started(Can list how long its been going?)
            stream.channel.game: "Name of game (i.e. Starcraft II, Poker)"
            stream.channel.status "Best of Live at the Bike! "
        */
        var statusColumn = $('<div>');
        statusColumn.attr('class', 'streamStatus');

        if (streamData.status == 422) {
          /* TODO */
          channelItem.addClass('channelClosed');
          statusColumn.text('Account closed');
          $(statusColumn).appendTo(channelItem);
          $(channelItem).appendTo("#channels");
        }
        else if (streamData.stream == null) {
          /* TODO */
          channelItem.addClass('channelOffline');
          statusColumn.text('Offline');
          $(statusColumn).appendTo(channelItem);
          $(channelItem).appendTo("#channels");
        } else {
          channelItem.addClass('channelOnline');
          statusColumn.text(streamData.stream.channel.game + ": " + streamData.stream.channel.status);
          $(statusColumn).appendTo(channelItem);

          var streamPreview = $('<div>');
          $(createPreviewImage(streamData.stream.preview.large)).appendTo(streamPreview);
          streamPreview.addClass('streamPreview');
          $(streamPreview).appendTo(channelItem);
          $(channelItem).prependTo("#channels");
        }

        //$(channelItem).appendTo("#channels");
      });
    });

  }


  var usernames = ["freecodecamp", "magic", "celinalin", "nanonoko","wsopreplaystream","jonathanlittle", "liveatthebike", "esl_sc2", "ogamingsc2", "habathcx", "terakilobyte", "thomasballinger", "comster404", "brunofin", "karltowns32"];
  //var usernames = ["liveatthebike", "ogamingsc2", "magic", "freecodecamp"];

  //var usernames = ["coymeetsworld", "brunofin"];
  for (var i = 0; i < usernames.length; i++) {
    getUsers(usernames[i]);
  }
});
