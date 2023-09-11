jQuery(document).ready(function ($) {

  //get the theme of the code block
  var theme_name = $('.EnlighterJSRAW.enlighter-origin').attr('data-enlighter-theme');
  console.log("theme_name: " + theme_name);


  var dark_themes = ["atomic", "dracula", "monokai"]; // Declare an array 'dark_themes' containing theme names for dark themes.
  var ligth_themes = ["bootstrap4"]; // Declare an array 'ligth_themes' containing theme names for light themes. 
  var icon_themes = ["enlighter", "godzilla", "beyond", "classic", "mowtwo", "eclipse", "droide", "minimal", "rowhammer",];

  // Create a jQuery object 'runButton_dark_theme' that represents an HTML <div> element with specific classes and attributes.
  var runButton_dark_theme = $('<div class="enlighter-btn enlighter-btn-run" id="dark_btn">Run <div class="enlighter-tooltip">Run Code</div></div>'); 

  // Create a jQuery object 'runButton_light_theme' that represents an HTML <div> element with specific classes and attributes.
  var runButton_light_theme = $('<div class="enlighter-btn enlighter-btn-run" id="light_btn">Run <div class="enlighter-tooltip">Run Code</div></div>'); 

    // Create a jQuery object 'runButton_icon_theme' that represents an HTML <div> element with specific classes and attributes.
  var runButton_icon_theme = $('<div class="enlighter-btn enlighter-btn-run" id="icon_btn" style="background-color: transparent;border: none;"><span style="text-align: center;font-size: 20px;color: black;border: 1px solid #adadad;border-radius: 4px;margin: 0 0 0 5px;padding: 2px 2px 0px 3px;">&#9654;</span> <div class="enlighter-tooltip">Run Code</div></div>');

  // Initialize a variable 'runButton' with the 'runButton_dark_theme'.
  var runButton = runButton_dark_theme

  // Check if the value of 'theme_name' exists in the 'light_themes' array.
  if ($.inArray(theme_name, ligth_themes) !== -1) {
    // If 'theme_name' is in 'light_themes', set 'runButton' to 'runButton_light_theme'.
    runButton = runButton_light_theme
  } else if (($.inArray(theme_name, icon_themes) !== -1)) {
    // If 'theme_name' is in 'icon_themes', set 'runButton' to 'runButton_icon_theme'.
    runButton = runButton_icon_theme
  }


  // append the run button to enlighter tool bar
  $('.enlighter-toolbar-top').append(runButton);


  // onclick event of run button
  $('.enlighter-btn-run').click(function () {



    // get the source code
    code_element = this.parentElement.parentElement
    const container_raw = code_element.querySelector('.enlighter-raw');
    var code = container_raw.innerHTML

    // get the programming language select
    langague = $(this).parent().parent().next().attr('data-enlighter-language');
    console.log($(this).parent().parent().attr("class"))

    // check if the compiler api key is defined or not.If not defined we take the default API key
    if (typeof techaroha_compiler_api_key == 'undefined')
      techaroha_compiler_api_key = "DEsPEDyUKA1d9QjUQX1Lz2q5M8glhIhSaNfDD0Me"

    // Define a JavaScript object 'settings' with various configuration properties for an AJAX request.
    var settings = {
      "url": "https://zk5o9y8pse.execute-api.ap-south-1.amazonaws.com/default/run_code",
      "method": "POST",
      "timeout": 0, // Timeout for the request (0 means no timeout).
      "headers": {
        "x-api-key": techaroha_compiler_api_key, // Custom header with an API key.
        "Content-Type": "application/json"
      },
      // JSON-encoded data to be sent in the request body.
      "data": JSON.stringify({
        "programming_langauge_user": langague,
        "code": code
      }),
    };
    // Send an AJAX request using the specified 'settings'.
    $.ajax(settings).done(function (response) {
      console.log(response);
      if (response.statusCode == '200') {
        // If the status code is '200' (OK):
        if (response.body.status == 'success') {
          var user_url = response.body.data.compiler_url;
          window.open(user_url, "_blank");
        } else if (response.body.status == 'failed') {
          // If the response body indicates failure:
          if (response.body.code_view == 'possible') {
            // If code view is possible, show a confirmation dialog with an error message.
            let errortext = response.body.message;
            if (confirm(errortext) == true) {
              // If the user confirms, extract the compiler URL and open it in a new tab.
              var url = response.body.data.compiler_url;
              window.open(url, "_blank");
            } else {
              // If the user cancels the confirmation, no action is taken.
              // Here, you could specify what should happen in this case.
            }
          } else {
            // If code view is not possible, display an alert with an error message.
            alert(response.body.message);
          }
        } else {
          // Handle other failure cases (unspecified technical issue).
          alert("some issue technical issue");
        }
      } else if (response.statusCode == '403') {
        // If the status code is '403' (Forbidden), display an access denied alert.
        alert("Forbidden (403): Access denied due to invalid API key. Please provide a valid key for access.");
      } else if (statusCode === 500 || statusCode === 410) {
        // If the status code is 500 (Internal Server Error) or 410, display an internal server error alert.
        alert("Internal Server Error (500): Something went wrong on our end. Please try again later or contact support.");
      }
      else {
        // Handle other status codes by displaying a generic error alert.
        alert("Something went wrong on our end. Please try again later or contact support.");
      }

    });
  });


});