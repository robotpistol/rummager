javascript:(function(){
  if($('#notesFilter').length == 0 && $('#itemFilter').length != 0) {
    $('<input type="text" class="form-control" id="notesFilter" placeholder="Search Notes">')
      .insertAfter($('#itemFilter'));
    $('<input type="number" class="form-control" id="priceFilter" placeholder="Upper Price Limit">')
      .insertAfter($('#notesFilter'));
    $('<input type="checkbox" id="showUnsignedOnly">Show Unsigned/Unrequested<br/>')
      .insertAfter($('.item-locator'));

    function matchesFilter(filterTextArray, value) {
      if(filterTextArray === null) { return true; }
      for(var i = 0; i < filterTextArray.length; i++) {
        if(value.indexOf(filterTextArray[i]) === -1) {
          return false;
        }
      }
      return true;
    }

    function handleFilter() {
      var itemFilterText = $("#itemFilter").val();
      var notesFilterText = $("#notesFilter").val();
      var filterText = $(this).val();

      $(".item").hide();

      var onlyAvailable = $("#showAvailableOnly").is(":checked");
      var onlyUnsigned = $("#showUnsignedOnly").is(":checked");
      var $rows = (onlyAvailable) ? $(".item:not(.historic-item)") : $(".item");
      if (onlyUnsigned) {
        $rows = $(
          $rows.toArray().filter(item => $(item).find('.request-status').text().trim() === 'REQ')
        );
      }

      var itemFilterTextArray = itemFilterText.toLowerCase().split(" ");
      var notesFilterTextArray = notesFilterText.toLowerCase().split(" ");
      var priceFilter = $("#priceFilter").val();

      $rows.each(function(index, row){
        var $row = $(row);
        var itemName = $row.find(".item-name").text().toLowerCase();
        var itemNotes = $row.find(".notes").text().toLowerCase();
        var price = Number($($row.children()[2]).text().replace(/[^0-9\.]+/g,""));
        var rowMatched = true;
        rowMatched = matchesFilter(itemFilterTextArray, itemName) &&
          matchesFilter(notesFilterTextArray, itemNotes) &&
          (priceFilter === "" || price < priceFilter);

        rowMatched ? $row.show() : $row.hide();
      });

      $("#count").html($(".item:visible").length);
    }

    $("#showUnsignedOnly").change(handleFilter);
    $("#notesFilter").keyup(handleFilter);
    $("#priceFilter").keyup(handleFilter);
    $("#itemFilter").keyup(handleFilter);
  }
})();
