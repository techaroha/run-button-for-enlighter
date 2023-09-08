jQuery(document).ready(function($) {

	//define the run button
    var runButton = $('<div class="enlighter-btn enlighter-btn-run">&#9654; Run <div class="enlighter-tooltip">Run Code</div></div>');
 
    // append the run button to enlighter tool bar
    $('.enlighter-toolbar-top').append(runButton); 

    
    // onclick event of run button
    $('.enlighter-btn-run').click(function() {
    
    //get the theme of the code block
    theme_code_div_class_attribute =$(this).parent().parent().attr("class")
    prefix_theme_class="enlighter-t-" 
    const regex = /\benlighter-t-\w*/ig;
    const arr_full_theme_class_names = theme_code_div_class_attribute.match(regex);
    const full_theme_class_name = arr_full_theme_class_names[0];
    var theme_name = full_theme_class_name.replace(prefix_theme_class, '');
   
    
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