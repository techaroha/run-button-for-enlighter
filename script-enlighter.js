jQuery(document).ready(function($) {

  //get the theme of the code block
  var theme_name = $('.EnlighterJSRAW.enlighter-origin').attr('data-enlighter-theme');
  console.log("theme_name: "+theme_name);
 
  var dark_themes = ["atomic","dracula", "monokai"];
  var ligth_themes = [  "bootstrap4"];
  var icon_themes = ["enlighter","godzilla","beyond","classic","mowtwo","eclipse","droide","minimal","rowhammer",];

  var runButton_dark_theme = $('<div class="enlighter-btn enlighter-btn-run" id="dark_btn">Run <div class="enlighter-tooltip">Run Code</div></div>');
  var runButton_light_theme = $('<div class="enlighter-btn enlighter-btn-run" id="light_btn">Run <div class="enlighter-tooltip">Run Code</div></div>');
  var runButton_icon_theme = $('<div class="enlighter-btn enlighter-btn-run" id="icon_btn" style="background-color: transparent;border: none;"><span style="text-align: center;font-size: 20px;color: black;border: 1px solid #adadad;border-radius: 4px;margin: 0 0 0 5px;padding: 2px 2px 0px 3px;">&#9654;</span> <div class="enlighter-tooltip">Run Code</div></div>');

  var runButton = runButton_dark_theme

  if ($.inArray(theme_name, ligth_themes) !== -1) {
    runButton = runButton_light_theme
  } else if ( ($.inArray(theme_name, icon_themes) !== -1) ) {
    runButton = runButton_icon_theme
  }


    // append the run button to enlighter tool bar
    $('.enlighter-toolbar-top').append(runButton); 

    
    // onclick event of run button
    $('.enlighter-btn-run').click(function() {
    
    
    
    // get the source code
    code_element = this.parentElement.parentElement
    const container_raw = code_element.querySelector('.enlighter-raw');
    var code = container_raw.innerHTML
    
    // get the programming language select
    langague = $(this).parent().parent().next().attr('data-enlighter-language');
    console.log($(this).parent().parent().attr("class"))
   
    // check if the compiler api key is defined or not.If not defined we take the default API key
    if (typeof techaroha_compiler_api_key == 'undefined')
        techaroha_compiler_api_key ="DEsPEDyUKA1d9QjUQX1Lz2q5M8glhIhSaNfDD0Me"
        
    var settings = {
      "url": "https://zk5o9y8pse.execute-api.ap-south-1.amazonaws.com/default/run_code",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "x-api-key": techaroha_compiler_api_key,
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({ 
        "programming_langauge_user": langague,
         "code": code 
      }),
    };
    $.ajax(settings).done(function (response) {
      console.log(response);
      if(response.statusCode == '200'){
        if(response.body.status == 'success'){
            var user_url = response.body.data.compiler_url;  
            window.open(user_url, "_blank");
          }else if (response.body.status == 'failed'){
            if (response.body.code_view == 'possible'){
                let errortext = response.body.message;
                if (confirm(errortext) == true) { 
                   var url = response.body.data.compiler_url;
                   window.open(url, "_blank");
                } else { 
                    //Here cancel button functionality on alert button
                } 
            }else{
                //here alert for the code view not possible
            alert(response.body.message);
            }
          
            }
          else{
            alert("some issue technical issue");
          }
      }else if (response.statusCode == '403'){
        alert("Forbidden (403): Access denied due to invalid API key. Please provide a valid key for access.");
      }else if (statusCode === 500 || statusCode === 410) {
          alert("Internal Server Error (500): Something went wrong on our end. Please try again later or contact support.");
      }
      else{
        alert("Something went wrong on our end. Please try again later or contact support.");
      } 

    });
    });
 

});