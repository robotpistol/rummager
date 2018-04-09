function copySnippet() {
  /* Get the text field */
  $("#code-snippet").select();

  /* Copy the text inside the text field */
  document.execCommand("Copy");

  /* Alert the copied text */
  $('#copy-alert').show();
}

$('#copy-button').on('click', copySnippet);
