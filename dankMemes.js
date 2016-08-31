window.fbAsyncInit = function() {
  FB.init({
    appId      : '150990782010944',
    cookie     : true,  // enable cookies to allow the server to access
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.5' // use graph api version 2.5
  });

  // Now that we've initialized the JavaScript SDK, we call
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.
  FB.getLoginStatus(function(response) {
    if (response["status"] == "connected") {
      $(".centerDiv").remove();
      $(".ui.header").remove();
      getRedditDankMemes();
      getFacebookMemes();
    } else {
      $("<div/>").addClass("ui huge header").html("Dank Meme Scraper").appendTo("body");
      $("<div/>").addClass("ui small header").html("For all your Dank Meme needs").appendTo("body");
      var loginButton = $("<button/>").addClass("huge ui red button").html("Login").appendTo($("<div/>").addClass("centerDiv").appendTo("body"));
      $(loginButton).click(function() {
        FB.login(function(response){
          $(".centerDiv").remove();
          $(".ui.header").remove();
          getRedditDankMemes();
          getFacebookMemes();
        });
      });
    }
  });
};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function logout() {
  FB.getLoginStatus(function(response) {
    FB.logout(function(response) {
      $(".ui.images").remove();
      $(".ui.button").remove();
      $("<div/>").addClass("ui huge header").html("Dank Meme Scraper").appendTo("body");
      $("<div/>").addClass("ui small header").html("For all your Dank Meme needs").appendTo("body");
      var loginButton = $("<button/>").addClass("huge ui red button").html("Login").appendTo($("<div/>").addClass("centerDiv").appendTo("body"));
      $(loginButton).click(function() {
        FB.login(function(response){
          $(".centerDiv").remove();
          $(".ui.header").remove();
          getRedditDankMemes();
          getFacebookMemes();
        });
      });
    });
  });
}

var lastId;

function getRedditDankMemes(params) {
    params = params || {};
    $.getJSON("http://www.reddit.com/r/dankMemes/.json?jsonp=?", params, function (data) {
        var children = data.data.children;
        $.each(children, function (i, item) {
            if (i != 0 && i != 1) {
              var url = item.data.url;
              url = url.replace(/amp;/g, "");
              if (!url.includes("i.imgur") && url.includes("imgur")) {
                url = (url.replace("imgur", "i.imgur")).concat(".png");
              }
              $("<img/>").attr("src", url).appendTo($("<div/>").addClass("image").appendTo($("<div/>").addClass("item").appendTo("#images")));
            }
        });
        if (children && children.length > 0) {
            lastId = children[children.length - 1].data.id;
        } else {
            lastId = undefined;
        }
    });
}

function moreMemes() {
  if (lastId) {
      getRedditDankMemes({
          after: 't3_' + lastId
      });
  }
}

function getFacebookMemes() {
  FB.api(
      "DankQualityMemes/photos?fields=images&type=uploaded" ,
      function (response) {
        if (response && !response.error) {
          for (i = 0; i < response["data"].length; i++) {
            $("<img/>").attr("src", response["data"][i]["images"][0]["source"]).appendTo($("<div/>").addClass("image").appendTo($("<div/>").addClass("item").appendTo("#images")));
          }
        }
      }
  );
}
