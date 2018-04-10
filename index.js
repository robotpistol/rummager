function copySnippet() {
  /* Get the text field */
  $("#code-snippet").select();

  /* Copy the text inside the text field */
  document.execCommand("Copy");

  /* Alert the copied text */
  showCopyAlert();
}

function showCopyAlert(){
  $("#copy-alert").show();
  setTimeout(function(){
    $("#copy-alert").hide();
  }, 2000);
}

$('#copy-button').on('click', copySnippet);

