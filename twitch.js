$(document).ready(function() {

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
  function createPreviewImage(streamerName, src) {
    var link = $('<a>');
    link.attr('href', 'http://www.twitch.tv/' + streamerName);
    link.attr('target', '_blank');
    var imageTag = $('<img>');
    imageTag.attr('src', src);
    link.html(imageTag);
    return link;
  }

  function createLink(streamerName, isFeatured) {
    var link = $('<a>');
    link.attr('href', 'http://www.twitch.tv/' + streamerName);
    link.attr('target', '_blank');
    if (isFeatured) {
      link.html("<strong>Featured:</strong> " + streamerName);
    } else {
      link.html(streamerName);
    }

    return link;
  }

  $("#filterNone").click(function() {
    console.log("Click no filter");
    $(".channelFeatured").removeClass("hidden");
    $(".channelOnline").removeClass("hidden");
    $(".channelOffline").removeClass("hidden");
    $(".channelClosed").removeClass("hidden");
  });
  $("#filterOffline").click(function() {
    console.log("Click offline filter");
    $(".channelOnline").addClass("hidden");
    $(".channelFeatured").addClass("hidden");
    $(".channelOffline").removeClass("hidden");
    $(".channelClosed").removeClass("hidden");
  });
  $("#filterOnline").click(function() {
    console.log("Click online filter");
    $(".channelOffline").addClass("hidden");
    $(".channelClosed").addClass("hidden");
    $(".channelOnline").removeClass("hidden");
    $(".channelFeatured").removeClass("hidden");
  });

  function getFeaturedInfo(name) {
    $.getJSON('https://api.twitch.tv/kraken/users/' + name + '?callback=?', function (userData) {
      if (userData.bio != null && userData.bio != '') {
        console.log("Username: " + userData.name);
        console.log("Bio: '" + userData.bio + "'");
        var infoTag = $('<img>');
        infoTag.attr('src', 'https://dl.dropboxusercontent.com/u/26748984/web-project-resources/freecodecamp/TwitchViewer/info.png');
        infoTag.attr('data-toggle', 'tooltip');
        infoTag.attr('title',userData.bio);
        infoTag.appendTo($('#featuredStream'+name));
        $('[data-toggle="tooltip"]').tooltip();
      }
    });
  }

  function getFeaturedStreams() {

    $.getJSON('https://api.twitch.tv/kraken/streams/featured?limit=5&offset=0', function (featuredData) {
      console.log(featuredData);
      var stream;
      for (var i = 0; i < 5; i++) {
        stream = featuredData.featured[i].stream;

        var channelItem = $('<li>');
        channelItem.attr('class', 'flex-item');
        var iconColumn = $('<div>');
        iconColumn.attr('class', 'streamerIcon');
        $(createUserImage(stream.channel.logo)).appendTo(iconColumn);
        $(iconColumn).appendTo(channelItem);

        var nameColumn = $('<div>');
        nameColumn.attr('class', 'streamerName');
        $(createLink(stream.channel.display_name, true)).appendTo(nameColumn);
        nameColumn.attr('id', 'featuredStream' + stream.channel.display_name);


        $(nameColumn).appendTo(channelItem);

        var statusColumn = $('<div>');
        statusColumn.attr('class', 'streamStatus');
        channelItem.addClass('channelFeatured');
        statusColumn.text(stream.channel.game + ": " + stream.channel.status);
        $(statusColumn).appendTo(channelItem);
        var streamPreview = $('<div>');
        $(createPreviewImage(stream.channel.display_name, stream.preview.large)).appendTo(streamPreview);
        streamPreview.addClass('streamPreview');
        $(streamPreview).appendTo(channelItem);
        var streamPreviewInfo = $('<div>');
        streamPreviewInfo.addClass('streamPreviewInfo');
        streamPreviewInfo.html("Viewers: " + stream.viewers);
        $(streamPreviewInfo).appendTo(channelItem);

        $(channelItem).appendTo("#channels");
        getFeaturedInfo(stream.channel.display_name);

      }
    });
  }

  function getUsers(user) {

    $.getJSON('https://api.twitch.tv/kraken/users/' + user + '?callback=?', function (userData) {

      if (userData.status == 404) {
        console.log("404 " + userData.error + ": " + userData.message);
        return;
      }

      console.log("User data");
      console.log("-------------------------");
      console.log(userData);
      console.log("-------------------------");
      console.log("End user data");


      var channelItem = $('<li>');
      channelItem.attr('class', 'flex-item');

      var iconColumn = $('<div>');
      iconColumn.attr('class', 'streamerIcon');
      $(createUserImage(userData.logo)).appendTo(iconColumn);
      $(iconColumn).appendTo(channelItem);

      var nameColumn = $('<div>');
      nameColumn.attr('class', 'streamerName');
      $(createLink(userData.display_name, false)).appendTo(nameColumn);

      if (userData.bio != null && userData.bio != '') {
        console.log("Username: " + userData.name);
        console.log("Bio: '" + userData.bio + "'");
        var infoTag = $('<img>');
        infoTag.attr('src', 'https://dl.dropboxusercontent.com/u/26748984/web-project-resources/freecodecamp/TwitchViewer/info.png');
        infoTag.attr('data-toggle', 'tooltip');
        infoTag.attr('title',userData.bio);
        infoTag.appendTo(nameColumn);

      }
      $(nameColumn).appendTo(channelItem);

      $.getJSON('https://api.twitch.tv/kraken/streams/' + userData.name + '?callback=?', function(streamData) {

        console.log("Stream data");
        console.log("-------------------------");
        console.log(streamData);
        console.log("-------------------------");
        console.log("Stream data");

        var statusColumn = $('<div>');
        statusColumn.attr('class', 'streamStatus');

        if (streamData.status == 422) {
          channelItem.addClass('channelClosed');
          statusColumn.text('Account closed');
          $(statusColumn).appendTo(channelItem);
        }
        else if (streamData.stream == null) {
          channelItem.addClass('channelOffline');
          statusColumn.text('Offline');
          $(statusColumn).appendTo(channelItem);
        } else {
          channelItem.addClass('channelOnline');
          statusColumn.text(streamData.stream.channel.game + ": " + streamData.stream.channel.status);
          $(statusColumn).appendTo(channelItem);
          var streamPreview = $('<div>');
          $(createPreviewImage(userData.name, streamData.stream.preview.large)).appendTo(streamPreview);
          streamPreview.addClass('streamPreview');
          $(streamPreview).appendTo(channelItem);
          var streamPreviewInfo = $('<div>');
          streamPreviewInfo.addClass('streamPreviewInfo');
          streamPreviewInfo.html("Viewers: " + streamData.stream.viewers);
          $(streamPreviewInfo).appendTo(channelItem);
        }

        $(channelItem).appendTo("#channels");
        $('[data-toggle="tooltip"]').tooltip(); // enable tooltips by hovering over info icon.

      });
    });

  }


  var usernames = ["freecodecamp", "magic", "liveatthebike", "karltowns32", "celinalin", "nanonoko","wsopreplaystream","jonathanlittle", "esl_sc2", "ogamingsc2", "habathcx", "terakilobyte", "thomasballinger", "comster404", "brunofin", "somejunkuserthatdoesntexist"];

  getFeaturedStreams();
  for (var i = 0; i < usernames.length; i++) {
    getUsers(usernames[i]);
  }

});
