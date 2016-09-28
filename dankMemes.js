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
      createAccordionList("Reddit");
      createAccordionList("Facebook");
      createDownloadAllMemesButton();
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
      createAccordionList("Reddit");
      createAccordionList("Facebook");
      createDownloadAllMemesButton();
    });
  });
}

function createLogoutButton() {
  var logoutButton = $("<button/>").addClass("ui yellow button").html("Logout").appendTo("body");
  $(logoutButton).click(function() {
    logout();
  });
}

function createMoreMemesButton(element, name) {
  var moreMemesButton = $("<button/>").addClass("ui blue button").html("Moar Dank Memes!").appendTo(element);
  $(moreMemesButton).click(function(){
    if (name == "Reddit") {
      moreMemes();
    }
  });
}

function createDownloadSelectedMemesButton(element, name) {
  var downloadButton = $("<button/>").addClass("ui green button").html("Download Selected Memes").appendTo(element);
  $(downloadButton).click(function() {
    var table = document.getElementById(name);
    for (var i = 0; i < table.childNodes.length; i++) {
      var checkbox = table.childNodes[i].childNodes[1].childNodes[0];
      if ($(checkbox).checkbox('is checked')) {
          var downloadLink = document.createElement('a');
          downloadLink.href = $($($($(checkbox).parent()).parent()).children()[0].innerHTML).attr('src');
          downloadLink.download = "output.png";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
      }
    }
  });
}

function createDownloadAllMemesButton() {
  var downloadAllMemesButton = $("<button/>").addClass("ui violet button").html("Download All Memes").appendTo("body");
    $(downloadAllMemesButton).click(function() {
      var allCheckboxes = document.getElementsByClassName("ui checkbox");
      for (var i = 0; i < allCheckboxes.length; i++) {
        if ($(allCheckboxes[i]).checkbox('is checked')) {
          var imageSource = $($($(allCheckboxes[i]).parent()).parent()).children()[0];
          var link = document.createElement('a');
          link.href = $(imageSource.innerHTML).attr('src');
          link.download = "output.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
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

function createAccordionList(name) {
  var accordion = $("<div/>").addClass("ui styled accordion");
  var activeTitle = $("<div/>").addClass("active title");
  var activeContent = $("<div/>").addClass("active content");
  var dropDownIcon = $("<i/>").addClass("dropdown icon");
  activeTitle.appendTo(accordion);
  dropDownIcon.appendTo(activeTitle);
  activeTitle.append(name);
  activeContent.appendTo(accordion);
  accordion.appendTo("body");
  $(accordion).accordion();
  createAccordionTable(activeContent, name);
  createMoreMemesButton(activeContent, name);
  createDownloadSelectedMemesButton(activeContent, name);
}

function createAccordionTable(activeContent, name) {
  var table = $("<table/>").addClass("ui selectable celled table");
  var tableHead = $("<thead/>");
  $("<th/>").html("Image").appendTo(tableHead);
  $("<th/>").html("Selected").appendTo(tableHead);
  tableHead.appendTo(table);
  var tableBody = $("<tbody/>");
  tableBody.attr("id", name);
  tableBody.appendTo(table);
  table.appendTo(activeContent);
  if (name == "Reddit") {
    getRedditDankMemes(name);
  } else {
    getFacebookMemes(name);
  }
}

function createTitleElements() {
  var heading = $("<div/>").addClass("ui huge header").html("Dank Meme Scraper").appendTo("body");
  var subHeading = $("<div/>").addClass("ui small header").html("For all your Dank Meme needs").appendTo("body");
}

function createTableEntries(url, name) {
  var image = $("<img/>").attr("src", url).addClass("ui image small");
  var imageRow = $("<tr/>");
  ($("<td/>").append(image)).appendTo(imageRow);
  createCheckboxes(imageRow);
  if (typeof name === 'string' || name instanceof String) {
      imageRow.appendTo($("#" + name));
  } else {
      imageRow.appendTo($("#Reddit"));
  }
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
              createTableEntries(url, params);
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

function getFacebookMemes(name) {
  FB.api(
      "DankMemesFromOuterSpace/photos?fields=images&type=uploaded" ,
      function (response) {
        if (response && !response.error) {
          for (i = 0; i < response["data"].length; i++) {
            createTableEntries(response["data"][i]["images"][0]["source"], name);
          }
        }
      }
  );
}
