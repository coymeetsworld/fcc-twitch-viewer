$(document).ready(function() {

  const NO_USER_ICON_URL= "http://www.brandsoftheworld.com/sites/default/files/styles/logo-thumbnail/public/022015/twitch.png?itok=kKyIL2PQ";

  function createImage(src) {
    var img_tag = $('<img>');
    if (src != null) {
      img_tag.attr('src', src);
    } else {
      img_tag.attr('src', NO_USER_ICON_URL);
    }
    return img_tag;
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

    $.getJSON('https://api.twitch.tv/kraken/users/' + user + '?callback=?', function (data) {
      console.log(data);
      var channel_row = $('<div>');
      channel_row.attr('class', 'row channel');
      var icon_column = $('<div>');
      icon_column.attr('class', 'col-md-1');

      $(createImage(data.logo)).appendTo(icon_column);
      $(icon_column).appendTo(channel_row);

      var name_column = $('<div>');
      name_column.attr('class', 'col-md-3 twitch_link_column');

      $(createLink(data.display_name)).appendTo(name_column);
      $(name_column).appendTo(channel_row);

      $.getJSON('https://api.twitch.tv/kraken/streams/' + data.name + '?callback=?', function(data) {

        var desc_column = $('<div>');
        desc_column.attr('class', 'col-md-8 twitch_status');

        if (data.status == 422) {
          channel_row.addClass('channel_offline');
          desc_column.text('Account closed');
          $(desc_column).appendTo(channel_row);
          $(channel_row).appendTo("#channels");
        }
        else if (data.stream == null) {
          channel_row.addClass('channel_offline');
          desc_column.text('Offline');
          $(desc_column).appendTo(channel_row);
          $(channel_row).appendTo("#channels");
        } else {
          channel_row.addClass('channel_online');
          desc_column.text(data.stream.channel.game + ": " + data.stream.channel.status);
          $(desc_column).appendTo(channel_row);
          $(channel_row).prependTo("#channels");
        }

        //$(channel_row).appendTo("#channels");
      });
    });

  }


  var usernames = ["freecodecamp", "magic", "celinalin", "nanonoko","wsopreplaystream","jonathanlittle", "liveatthebike", "esl_sc2", "ogamingsc2", "habathcx", "terakilobyte", "thomasballinger", "comster404", "brunofin"];
  //var usernames = ["coymeetsworld", "brunofin"];
  for (var i = 0; i < usernames.length; i++) {
    getUsers(usernames[i]);
  }
});
