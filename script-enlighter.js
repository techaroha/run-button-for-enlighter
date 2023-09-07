jQuery(document).ready(function($) {
    var runButton = $('<div class="enlighter-btn enlighter-btn-run">&#9654; <div class="enlighter-tooltip">Run Code</div></div>');
 
    $('.enlighter-toolbar-top').append(runButton); 

    $('.enlighter-btn-run').click(function() {
    
    code_element = this.parentElement.parentElement
    const container = code_element.querySelector('.enlighter-code');
    const container_raw = code_element.querySelector('.enlighter-raw');
    langague = $(this).parent().parent().next().attr('data-enlighter-language');
    var code = container_raw.innerHTML
  
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