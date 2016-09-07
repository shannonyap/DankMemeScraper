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
      createLogoutButton();
      createAccordionList();
      getRedditDankMemes();
      getFacebookMemes();
    } else {
      createTitleElements();
      createLoginButton();
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
      removeMainContentElements();
      createTitleElements();
      createLoginButton();
    });
  });
}

/* Button methods */
function createLoginButton() {
  var loginButton = $("<button/>").addClass("huge ui red button").html("Login").appendTo($("<div/>").addClass("centerDiv").appendTo("body"));
  $(loginButton).click(function() {
    FB.login(function(response){
      removeTitleElements();
      createLogoutButton();
      createAccordionList();
      getRedditDankMemes();
      getFacebookMemes();
    });
  });
}

function createLogoutButton() {
  var logoutButton = $("<button/>").addClass("ui yellow button").html("Logout").appendTo("body");
  $(logoutButton).click(function() {
    logout();
  });
}

function createMoreMemesButton(element) {
  var moreMemesButton = $("<button/>").addClass("ui blue button").html("Moar Dank Memes!").appendTo(element);
  $(moreMemesButton).click(function(){
    moreMemes();
  });
}
/* End button methods */

/* Remove element functions */
function removeTitleElements() {
  $(".centerDiv").remove();
  $(".ui.header").remove();
}

function removeMainContentElements() {
  $(".ui.accordion").remove();
  $(".ui.button").remove();
}
/* End remove element functions */

function createAccordionList() {
  var accordion = $("<div/>").addClass("ui styled accordion");
  var activeTitle = $("<div/>").addClass("active title");
  var activeContent = $("<div/>").addClass("active content");
  var dropDownIcon = $("<i/>").addClass("dropdown icon");
  activeTitle.appendTo(accordion);
  dropDownIcon.appendTo(activeTitle);
  activeTitle.append("Reddit");
  activeContent.appendTo(accordion);
  accordion.appendTo("body");
  $(accordion).accordion();
  createAccordionTable(activeContent);
}

var tableBody;

function createAccordionTable(activeContent) {
  var table = $("<table/>").addClass("ui selectable celled table");
  var tableHead = $("<thead/>");
  $("<th/>").html("Image").appendTo(tableHead);
  $("<th/>").html("Selected").appendTo(tableHead);
  tableHead.appendTo(table);
  tableBody = $("<tbody/>")
  tableBody.appendTo(table);
  createMoreMemesButton(table);
  table.appendTo(activeContent);
}

function createTitleElements() {
  $("<div/>").addClass("ui huge header").html("Dank Meme Scraper").appendTo("body");
  $("<div/>").addClass("ui small header").html("For all your Dank Meme needs").appendTo("body");
}

function createTableEntries(url) {
  var image = $("<img/>").attr("src", url).addClass("ui image small");
  var imageRow = $("<tr/>");
  ($("<td/>").append(image)).appendTo(imageRow);
  createCheckboxes(imageRow);
  imageRow.appendTo(tableBody);
}

function createCheckboxes(imageRow) {
  var checkbox = $("<td/>").addClass("center aligned");
  var uiCheckbox = $("<div/>").addClass("ui checkbox");
  uiCheckbox.append($('<input>').attr('type', 'checkbox'));
  uiCheckbox.append($("<label/>"));
  uiCheckbox.appendTo(checkbox);
  checkbox.appendTo(imageRow);
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
              createTableEntries(url);
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
            createTableEntries(response["data"][i]["images"][0]["source"]);
          }
        }
      }
  );
}
