jQuery(document).ready(function ($) {

  //get the theme of the code block
  var theme_name = $('.EnlighterJSRAW.enlighter-origin').attr('data-enlighter-theme');

  var dark_themes = ["atomic", "dracula", "monokai"]; // Declare an array 'dark_themes' containing theme names for dark themes.
  var ligth_themes = ["bootstrap4"]; // Declare an array 'ligth_themes' containing theme names for light themes. 
  var icon_themes = ["enlighter", "godzilla", "beyond", "classic", "mowtwo", "eclipse", "droide", "minimal", "rowhammer",];
  var default_themes = [""]; // Declare an array 'ligth_themes' containing theme names for light themes. 

  // Create a jQuery object 'runButton_dark_theme' that represents an HTML <div> element with specific classes and attributes.
  var runButton_dark_theme = $('<div class="enlighter-btn enlighter-btn-run" id="dark_btn" style="display: inline-flex; border: 1px solid #a6a6a6;  padding: 0.5px 10px 0.5px 10px;">Run <svg width="17" height="17" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">  <path d="M9.25 4.75h-2.5a2 2 0 0 0-2 2v10.5a2 2 0 0 0 2 2h10.5a2 2 0 0 0 2-2v-2.5"></path>  <path d="M19.25 9.25v-4.5h-4.5"></path>  <path d="m19 5-7.25 7.25"></path></svg><div class="enlighter-tooltip">Run Code</div></div>'); 

  // Create a jQuery object 'runButton_light_theme' that represents an HTML <div> element with specific classes and attributes.
  var runButton_light_theme = $('<div class="enlighter-btn enlighter-btn-run" id="light_btn" style="display: inline-flex;">Run <svg width="17" height="17" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">  <path d="M9.25 4.75h-2.5a2 2 0 0 0-2 2v10.5a2 2 0 0 0 2 2h10.5a2 2 0 0 0 2-2v-2.5"></path>  <path d="M19.25 9.25v-4.5h-4.5"></path>  <path d="m19 5-7.25 7.25"></path></svg><div class="enlighter-tooltip">Run Code</div></div>'); 

    // Create a jQuery object 'runButton_icon_theme' that represents an HTML <div> element with specific classes and attributes.
  var runButton_icon_theme = $('<div class="enlighter-btn enlighter-btn-run" id="icon_btn" style="background-color: transparent;border: none;"><svg width="27" height="27" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 2a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5H7Zm8.75 11.299c1-.577 1-2.02 0-2.598l-4.5-2.598A1.5 1.5 0 0 0 9 9.402v5.196a1.5 1.5 0 0 0 2.25 1.3l4.5-2.599Z" fill="#000"/></svg> <div class="enlighter-tooltip">Run Code</div></div>');
  

  // Initialize a variable 'runButton' with the 'runButton_dark_theme'.
  var runButton = runButton_dark_theme

  // Check if the value of 'theme_name' exists in the 'light_themes' array.
  if ($.inArray(theme_name, ligth_themes) !== -1) {
    // If 'theme_name' is in 'light_themes', set 'runButton' to 'runButton_light_theme'.
    runButton = runButton_light_theme
  } else if (($.inArray(theme_name, icon_themes) !== -1)) {
    // If 'theme_name' is in 'icon_themes', set 'runButton' to 'runButton_icon_theme'.
    runButton = runButton_icon_theme
  }else if (($.inArray(theme_name, default_themes) !== -1)) {
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
  
    //HTML Entity Decode for special charecter
    // Define an array of HTML entities and their corresponding characters
    var entities = [
      ['amp', '&'],
      ['apos', '\''],
      ['#x27', '\''],
      ['#x2F', '/'],
      ['#39', '\''],
      ['#47', '/'],
      ['lt', '<'],
      ['gt', '>'],
      ['nbsp', ' '],
      ['quot', '"']
  ];
    // Loop through the array of entities
  for (var i = 0, max = entities.length; i < max; ++i)
    // Create a regular expression to match the entity in the code
    // and replace it with the corresponding character
      code = code.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);
 
    // get the programming language select
    langague = $(this).parent().parent().next().attr('data-enlighter-language');
    
    // check if the compiler api key is defined or not.If not defined we take the default API key
    if (typeof taenlighter_api_key == 'undefined')
      taenlighter_api_key = "DEsPEDyUKA1d9QjUQX1Lz2q5M8glhIhSaNfDD0Me"

    // Define a JavaScript object 'settings' with various configuration properties for an AJAX request.
    var settings = {
      "url": "https://zk5o9y8pse.execute-api.ap-south-1.amazonaws.com/default/run_code",
      "method": "POST",
      "timeout": 0, // Timeout for the request (0 means no timeout).
      "headers": {
        "x-api-key": taenlighter_api_key, // Custom header with an API key.
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