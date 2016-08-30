// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    FB.login(function(response){
      getRedditDankMemes();
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
    });
  });
}

function logout() {
  FB.getLoginStatus(function(response) {
    FB.logout(function(response) {
      // user is now logged out
    });
  });
}

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
      $(".ui.red.button").remove();
      getRedditDankMemes();
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
    } else {
      $(".ui.blue.button").remove();
      $(".ui.yellow.button").remove();
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
