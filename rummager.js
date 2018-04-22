class Rummager {
  static matchesFilter(filterTextArray, value) {
    return filterTextArray.reduce((isMatched, filter) => {
      if (!isMatched) { return false; }
      return filter.startsWith('^') ? !value.includes(filter.substr(1)) : value.includes(filter);
    }, true);
  }

  static generateCountryCount() {
    const countryCount = {};
    $('.item:visible').each((index, item) => {
      const country = $($(item).children()[0]).text().toLowerCase().trim();
      if (countryCount[country] === undefined) {
        countryCount[country] = 0;
      }
      countryCount[country] += 1;
    });

    return Object
      .keys(countryCount)
      .map(key => [key, countryCount[key]])
      .sort((a, b) => b[1] - a[1]);
  }

  static clearFilters() {
    $('#itemFilter').val('');
    $('#notesFilter').val('');
    $('#firstColumn').val('');
    $('#priceFilter').val('');
    $('#itemFilter').keyup();
  }

  static generateFilterArray(element) {
    return element.val().toLowerCase().trim().split(' ');
  }

  static handleFilter() {
    $('.item').hide();

    const onlyAvailable = $('#showAvailableOnly').is(':checked');
    const onlyUnsigned = $('#showUnsignedOnly').is(':checked');
    let $rows = (onlyAvailable) ? $('.item:not(.historic-item)') : $('.item');

    if (onlyUnsigned) {
      $rows = $rows.filter((i, e) => $(e).find('.request-status').text().trim() === 'REQ');
    }

    const itemFilterTextArray = Rummager.generateFilterArray($('#itemFilter'));
    const notesFilterTextArray = Rummager.generateFilterArray($('#notesFilter'));
    const firstColumnTextArray = Rummager.generateFilterArray($('#firstColumn'));
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
        Rummager.matchesFilter(firstColumnTextArray, item.country) &&
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
    let firstColumnLabel = 'Search ' + $($($('thead')[0]).find('th')[0]).text();
    $('#itemFilter').attr({ placeholder: 'Search Name' });
    $('<input type="number" class="form-control" id="priceFilter" placeholder="Upper Price Limit">')
      .insertAfter($('#itemFilter'));
    $('<input type="text" class="form-control" id="notesFilter" placeholder="Search Notes">')
      .insertAfter($('#itemFilter'));
    $('<input type="text" class="form-control" id="firstColumn" placeholder="' + firstColumnLabel + '">')
      .insertAfter($('#itemFilter'));
    $('<input type="checkbox" id="showUnsignedOnly" checked="checked">Hide Signed & Requested<br/>')
      .insertAfter($('.item-locator'));
    $('<br/><button class="btn btn-primary" id="clearFilters">Clear Filters</button>')
      .insertBefore($('table'));

    $('#clearFilters').click(Rummager.clearFilters);
    $('#showUnsignedOnly').change(Rummager.handleFilter);
    $('#notesFilter').keyup(Rummager.handleFilter);
    $('#firstColumn').keyup(Rummager.handleFilter);
    $('#priceFilter').keyup(Rummager.handleFilter);
    $('#itemFilter').keyup(Rummager.handleFilter);
    $('#itemFilter').keyup();
  }
}

Rummager.overlayRummager();
