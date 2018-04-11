class Rummager {
  static matchesFilter(filterTextArray, value) {
    return filterTextArray.reduce((isMatched, filter) => {
      if (!isMatched) { return false; }
      return filter.startsWith('^') ? !value.includes(filter.substr(1)) : value.includes(filter);
    }, true);
  }

  static clearFilters() {
    $('#itemFilter').val('');
    $('#notesFilter').val('');
    $('#countryFilter').val('');
    $('#priceFilter').val('');
    $('#itemFilter').keyup();
  }

  static generateFilterArray(item) {
    return item.val().toLowerCase().trim().split(' ');
  }

  static handleFilter() {
    $('.item').hide();

    const onlyAvailable = $('#showAvailableOnly').is(':checked');
    const onlyUnsigned = $('#showUnsignedOnly').is(':checked');
    let $rows = (onlyAvailable) ? $('.item:not(.historic-item)') : $('.item');

    if (onlyUnsigned) {
      $rows =
        $($rows.toArray().filter(item => $(item).find('.request-status').text().trim() === 'REQ'));
    }


    const itemFilterTextArray = Rummager.generateFilterArray($('#itemFilter'));
    const notesFilterTextArray = Rummager.generateFilterArray($('#notesFilter'));
    const countryFilterTextArray = Rummager.generateFilterArray($('#countryFilter'));
    const priceFilter = $('#priceFilter').val();

    $rows.each((index, row) => {
      const $row = $(row);
      const item = {
        name: $row.find('.item-name').text().toLowerCase(),
        notes: $row.find('.notes').text().toLowerCase(),
        price: Number($($row.children()[2]).text().replace(/[^0-9.]+/g, '')),
        country: $($row.children()[0]).text().toLowerCase(),
      };
      const rowMatched =
        Rummager.matchesFilter(itemFilterTextArray, item.name) &&
        Rummager.matchesFilter(notesFilterTextArray, item.notes) &&
        Rummager.matchesFilter(countryFilterTextArray, item.country) &&
        (priceFilter === '' || item.price <= priceFilter);

      if (rowMatched) {
        $row.show();
      } else {
        $row.hide();
      }
    });

    $('#count').html($('.item:visible').length);
  }

  static overlayRummager() {
    if ($('#notesFilter').length !== 0 || $('#itemFilter').length === 0) {
      return;
    }
    $('#itemFilter').attr({ placeholder: 'Search Name' });
    $('<input type="number" class="form-control" id="priceFilter" placeholder="Upper Price Limit">')
      .insertAfter($('#itemFilter'));
    $('<input type="text" class="form-control" id="notesFilter" placeholder="Search Notes">')
      .insertAfter($('#itemFilter'));
    $('<input type="text" class="form-control" id="countryFilter" placeholder="Search Country">')
      .insertAfter($('#itemFilter'));
    $('<input type="checkbox" id="showUnsignedOnly">Hide Signed & Requested<br/>')
      .insertAfter($('.item-locator'));
    $('<br/><button class="btn btn-primary" id="clearFilters">Clear Filters</button>')
      .insertBefore($('table'));

    $('#clearFilters').click(Rummager.clearFilters);
    $('#showUnsignedOnly').change(Rummager.handleFilter);
    $('#notesFilter').keyup(Rummager.handleFilter);
    $('#countryFilter').keyup(Rummager.handleFilter);
    $('#priceFilter').keyup(Rummager.handleFilter);
    $('#itemFilter').keyup(Rummager.handleFilter);
  }
}

Rummager.overlayRummager();
