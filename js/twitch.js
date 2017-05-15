$(document).ready(function() {

  const NO_USER_ICON_URL= "imgs/twitchDefaultIcon.png";

  /* List of users to query. */
  const USERNAMES = ["freecodecamp", "maximilian_dood", "magic", "channelfireball", "liveatthebike", "karltowns32", "celinalin", "nanonoko","wsopreplaystream","jonathanlittle", "esl_sc2", "ogamingsc2", "habathcx", "terakilobyte", "thomasballinger", "comster404", "brunofin" ];

  const CLIENT_ID = "skji05ppnsavrfz5ydkkttvbbzj2h29";
  const TWITCH_URL = "https://www.twitch.tv";
  let featuredUsernames = [];


  /* Creates click function for filtering out streams. */
  const createFilterActions = () => {
    $("#filter-none").click(function() {
      $(".channel-featured").removeClass("hidden");
      $(".channel-online").removeClass("hidden");
      $(".channel-offline").removeClass("hidden");
      $(".channel-closed").removeClass("hidden");
    });
    $("#filter-offline").click(function() {
      $(".channel-online").addClass("hidden");
      $(".channel-featured").addClass("hidden");
      $(".channel-offline").removeClass("hidden");
      $(".channel-closed").removeClass("hidden");
    });
    $("#filter-online").click(function() {
      $(".channel-offline").addClass("hidden");
      $(".channel-closed").addClass("hidden");
      $(".channel-online").removeClass("hidden");
      $(".channel-featured").removeClass("hidden");
    });
  }


  /* Creates the image tag for the user. If they do not have an image a default will be used in place.*/
  const createUserImage = (src) => {
    let imageTag = $("<img>");
    imageTag.addClass("user-icon");

    if (src != null) imageTag.attr("src", src);
    else imageTag.attr("src", NO_USER_ICON_URL);
    return imageTag;
  }


  const createLink = (streamerName) => {
    let link = $("<a>");
    link.attr("href", `${TWITCH_URL}/${streamerName}`);
    link.attr("target", "_blank");
    return link;
  }


  /* Creates the image tag for showing the preview of the stream. Only used when a stream is live, there are no previews on offline streams. */
  const createPreviewImage = (streamerName, src) => {
    let link = createLink(streamerName);
    let imageTag = $("<img>");
    imageTag.attr("src", src);
    link.html(imageTag);
    return link;
  }


  /* Creates the link for the streamer to go to their Twitch page. Will also display if its a featured stream or not.*/
  const createTitle = (streamerName, isFeatured) => {
    let link = createLink(streamerName);
    if (isFeatured) {
      link.html("<strong>Featured:</strong> " + streamerName);
    } else {
      link.html(streamerName);
    }
    return link;
  }


  const createTooltip = (bio) => {
    let span = $("<span>");
    span.attr("tooltip", bio);
    span.attr("tooltip-position", "top");
    let img = $("<img>");
    img.attr("src", "imgs/info.png");
    img.appendTo(span);
    return span;
  }


  /* Pulls information about a featured streamer. */
  const getFeaturedInfo = (name) => {
    $.getJSON(`https://api.twitch.tv/kraken/users/${name}?client_id=${CLIENT_ID}`, (userData) => {
      if (userData.bio != null && userData.bio != '') {
        console.log("Username: " + userData.name);
        featuredUsernames.push(userData.name);
        createTooltip(userData.bio).appendTo($(`#featured-stream${name}`));
      }
    });
  }

  const createUserIcon = (logo = null) => {
    let iconColumn = $('<div>');
    iconColumn.attr('class', 'streamer-icon');
    $(createUserImage(logo)).appendTo(iconColumn);
    return iconColumn;
  }

  const createStreamHeader = (username, bio = null, isFeatured = false) => {
    let nameColumn = $("<div>");
    nameColumn.attr("class", "streamer-name");
    createTitle(username, isFeatured).appendTo(nameColumn);
    nameColumn.attr("id", `featured-stream${username}`);
    if (bio && bio !== "") createTooltip(bio).appendTo(nameColumn);
    return nameColumn;
  }

  const createStreamStatus = (status, channel = null) => {

    let statusColumn = $("<div>");
    statusColumn.attr("class", "stream-status");

    switch (status) {
      case "closed":
        statusColumn.text("Account closed");
        break;
      case "offline":
        statusColumn.text("Offline");
        break;
      case "online":
        statusColumn.text(`${channel.game} : ${channel.status}`);
        break;
    }
    return statusColumn;
  }




  // from featured users: featuredData.featured[i].stream.channel
  // from normal users: userData
  const createChannelItem = (streamData, isFeatured) => {
    let channelItem = $('<li>');
    channelItem.attr('class', 'flex-item');

    createUserIcon(streamData.logo).appendTo(channelItem);
    createStreamHeader(streamData.display_name, streamData.bio, isFeatured).appendTo(channelItem);
    return channelItem;
  }

  const createClosedChannelItem = (username) => {
    let channelItem = $('<li>');
    channelItem.attr('class', 'flex-item');
    createUserIcon().appendTo(channelItem);
    createStreamHeader(username).appendTo(channelItem);
    return channelItem;
  }


  /* Makes an API call to get the top 5 featured streams on Twitch and render them on the page.
    TODO: can't limit the rate with the client_id, investigate
    https://api.twitch.tv/kraken/streams/featured?client_id=skji05ppnsavrfz5ydkkttvbbzj2h29?limit=5&offset=0
  */
  const getFeaturedStreams = () => {
    $.getJSON(`https://api.twitch.tv/kraken/streams/featured?client_id=${CLIENT_ID}`, (featuredData) => {
      //console.log(featuredData.featured.slice(0,5));

      let stream;
      for (let i = 0; i < 5; i++) {
        stream = featuredData.featured[i].stream;

        let channelItem = createChannelItem(featuredData.featured[i].stream.channel, true);
        channelItem.addClass("channel-featured");
        createStreamStatus("online", stream.channel, true).appendTo(channelItem);

        /*let statusColumn = $('<div>');
        statusColumn.attr('class', 'stream-status');
        channelItem.addClass('channel-featured');
        statusColumn.text(stream.channel.game + ": " + stream.channel.status);
        $(statusColumn).appendTo(channelItem);*/

        let streamPreview = $('<div>');
        $(createPreviewImage(stream.channel.display_name, stream.preview.large)).appendTo(streamPreview);
        streamPreview.addClass('stream-preview');
        $(streamPreview).appendTo(channelItem);
        let streamPreviewInfo = $('<div>');
        streamPreviewInfo.addClass('stream-preview-info');
        streamPreviewInfo.html("Viewers: " + stream.viewers);
        $(streamPreviewInfo).appendTo(channelItem);

        $(channelItem).appendTo("#channels");
        getFeaturedInfo(stream.channel.display_name);


      }
      USERNAMES.map((user) => getUserInfo(user)); // So API call isn't made until featured streams finishes. This is done to prevent a duplicate channel from showing up (i.e. if one of the predefined channels ends up being featured at the time.)
    });
  }


  const renderStreamData = (streamData, userData, channelItem) => {
    if (streamData.stream === null) {
      channelItem.addClass("channel-offline");
      createStreamStatus("offline").appendTo(channelItem);

    } else {
      channelItem.addClass("channel-online");
      createStreamStatus("online", streamData.stream.channel).appendTo(channelItem);

      let streamPreview = $('<div>');
      $(createPreviewImage(userData.name, streamData.stream.preview.large)).appendTo(streamPreview);
      streamPreview.addClass('stream-preview');
      $(streamPreview).appendTo(channelItem);
      let streamPreviewInfo = $('<div>');
      streamPreviewInfo.addClass('stream-preview-info');
      streamPreviewInfo.html("Viewers: " + streamData.stream.viewers);
      $(streamPreviewInfo).appendTo(channelItem);
    }

    $(channelItem).appendTo("#channels");
  }

  const renderUserData = (userName, userData) => {


      if (featuredUsernames.includes(userName)) return;


      let channelItem;
      //need to keep if statement so ajax isn't run here?
      if (userData.hasOwnProperty("status")) {
        if (userData.status == 422) {
          channelItem = createClosedChannelItem(userName);
          createStreamStatus("closed").appendTo(channelItem);
          channelItem.addClass("channel-closed");
          $(channelItem).appendTo("#channels");
        }
        else if (userData.status == 404) {
          console.log(`${userData.status} ${userData.error}: ${userData.message}, not creating an entry.`);
        }
          /*let statusColumn = $('<div>'); //repeated code in renderStreamData, should refactor
          statusColumn.attr('class', 'stream-status');

          channelItem.addClass('channel-closed');
          statusColumn.text('Account closed');
          $(statusColumn).appendTo(channelItem);
          $(channelItem).appendTo("#channels");*/
          return;
      }
      channelItem = createChannelItem(userData, false);

    $.ajax({
      type: "GET",
      url: 'https://api.twitch.tv/kraken/streams/'+userData.name,
      headers: {
        'CLIENT-ID': 'skji05ppnsavrfz5ydkkttvbbzj2h29'
      },
      success: function(data, textStatus, jqXHR ){
         renderStreamData(data, userData, channelItem);
      },
      error: function(jqXHR, textStatus, errorThrown ) {
         console.log(errorThrown);
         console.log("Status: " + textStatus);
         console.log(jqXHR);
      }
    });

  }


  /* Makes an API call to get information on a specific Twitch user and renders it on the page. */
  const getUserInfo = (user) => {

    $.ajax({
      type: "GET",
      url: 'https://api.twitch.tv/kraken/users/'+user,
      headers: {
        'CLIENT-ID': 'skji05ppnsavrfz5ydkkttvbbzj2h29'
      },
      success: function(data, textStatus, jqXHR ){
         renderUserData(user, data);
      },
      error: function(jqXHR, textStatus, errorThrown ) {
         renderUserData(user, jqXHR.responseJSON);
      }
    });

  }

  createFilterActions();
  getFeaturedStreams();

});
