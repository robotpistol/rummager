function overlayRummager() {
  if ($('#notesFilter').length === 0 && $('#itemFilter').length !== 0) {
    $('#itemFilter').attr({ placeholder: 'Search Name' });
    $('<input type="number" class="form-control" id="priceFilter" placeholder="Upper Price Limit">')
      .insertAfter($('#itemFilter'));
    $('<input type="text" class="form-control" id="notesFilter" placeholder="Search Notes">')
      .insertAfter($('#itemFilter'));
    $('<input type="text" class="form-control" id="countryFilter" placeholder="Search Country">')
      .insertAfter($('#itemFilter'));
    $('<input type="checkbox" id="showUnsignedOnly">Hide Signed & Requested<br/>')
      .insertAfter($('.item-locator'));
    $('<br/><button class="btn btn-primary" id="clearAll">Clear Filters</button>')
      .insertBefore($('table'));

    function matchesFilter(filterTextArray, value) {
      return filterTextArray.reduce((isMatched, filter) => {
        if (!isMatched) { return false; }
        return filter.startsWith('^') ? !value.includes(filter.substr(1)) : value.includes(filter);
      }, true);
    }

    function handleFilter() {
      $('.item').hide();

      const onlyAvailable = $('#showAvailableOnly').is(':checked');
      const onlyUnsigned = $('#showUnsignedOnly').is(':checked');
      let $rows = (onlyAvailable) ? $('.item:not(.historic-item)') : $('.item');

      if (onlyUnsigned) {
        $rows = $($rows.toArray().filter((item) => {
          $(item).find('.request-status').text().trim() === 'REQ';
        }));
      }

      const itemFilterTextArray = $('#itemFilter').val().toLowerCase().trim()
        .split(' ');
      const notesFilterTextArray = $('#notesFilter').val().toLowerCase().trim()
        .split(' ');
      const countryFilterTextArray = $('#countryFilter').val().toLowerCase().trim()
        .split(' ');
      const priceFilter = $('#priceFilter').val();

      $rows.each((index, row) => {
        const $row = $(row);
        const item = {
          name: $row.find('.item-name').text().toLowerCase(),
          notes: $row.find('.notes').text().toLowerCase(),
          price: Number($($row.children()[2]).text().replace(/[^0-9.]+/g, '')),
          country: $($row.children()[0]).text().toLowerCase(),
        };
        const rowMatched = matchesFilter(itemFilterTextArray, item.name) &&
          matchesFilter(notesFilterTextArray, item.notes) &&
          matchesFilter(countryFilterTextArray, item.country) &&
          (priceFilter === '' || item.price <= priceFilter);

        rowMatched ? $row.show() : $row.hide();
      });

      $('#count').html($('.item:visible').length);
    }

    function clearAll() {
      $('#itemFilter').val('');
      $('#notesFilter').val('');
      $('#countryFilter').val('');
      $('#priceFilter').val('');
      $('#itemFilter').keyup();
    }

    $('#clearAll').click(clearAll);
    $('#showUnsignedOnly').change(handleFilter);
    $('#notesFilter').keyup(handleFilter);
    $('#countryFilter').keyup(handleFilter);
    $('#priceFilter').keyup(handleFilter);
    $('#itemFilter').keyup(handleFilter);
  }
}
overlayRummager();
