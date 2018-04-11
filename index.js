function showCopyAlert() {
  $('#copy-alert').show();
  setTimeout(() => {
    $('#copy-alert').hide();
  }, 2000);
}

function copySnippet() {
  /* Get the text field */
  $('#code-snippet').select();

  /* Copy the text inside the text field */
  document.execCommand('Copy');

  /* Alert the copied text */
  showCopyAlert();
}

$('#copy-button').on('click', copySnippet);

