$(document).ready(function() {

  const NO_USER_ICON_URL= "http://www.brandsoftheworld.com/sites/default/files/styles/logo-thumbnail/public/022015/twitch.png?itok=kKyIL2PQ";

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
    link.attr('class', 'twitch_link');
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
      var channelItem = $('<div>');
      channelItem.attr('class', 'flex-item');

      var icon_column = $('<div>');
      icon_column.attr('class', 'col-md-1');

      $(createUserImage(userData.logo)).appendTo(icon_column);
      $(icon_column).appendTo(channelItem);

      var name_column = $('<div>');
      name_column.attr('class', 'col-md-3 twitch_link_column');

      $(createLink(userData.display_name)).appendTo(name_column);
      $(name_column).appendTo(channelItem);

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
        var desc_column = $('<div>');
        desc_column.attr('class', 'col-md-8 twitch_status');

        if (streamData.status == 422) {
          channelItem.addClass('channel_offline');
          desc_column.text('Account closed');
          $(desc_column).appendTo(channelItem);
          $(channelItem).appendTo("#channels");
        }
        else if (streamData.stream == null) {
          channelItem.addClass('channel_offline');
          desc_column.text('Offline');
          $(desc_column).appendTo(channelItem);
          $(channelItem).appendTo("#channels");
        } else {
          channelItem.addClass('channel_online');
          desc_column.text(streamData.stream.channel.game + ": " + streamData.stream.channel.status);
          $(desc_column).appendTo(channelItem);

          var previewRow = $('<div>');
          $(createPreviewImage(streamData.stream.preview.large)).appendTo(previewRow);
          previewRow.addClass('previewRow');
          $(previewRow).appendTo(channelItem);
          $(channelItem).prependTo("#channels");
        }

        //$(channelItem).appendTo("#channels");
      });
    });

  }


  //var usernames = ["freecodecamp", "magic", "celinalin", "nanonoko","wsopreplaystream","jonathanlittle", "liveatthebike", "esl_sc2", "ogamingsc2", "habathcx", "terakilobyte", "thomasballinger", "comster404", "brunofin"];
  var usernames = ["liveatthebike", "ogamingsc2", "magic", "freecodecamp"];

  //var usernames = ["coymeetsworld", "brunofin"];
  for (var i = 0; i < usernames.length; i++) {
    getUsers(usernames[i]);
  }
});
