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
      const $item = $(item);
      const country = $($item.children()[0]).text().toLowerCase().trim();
      if (countryCount[country] === undefined) {
        countryCount[country] = { count: 0, minPrice: 1000, maxPrice: 0 };
      }
      countryCount[country].count += 1;
      countryCount[country].minPrice = Math.min(
        countryCount[country].minPrice,
        Rummager.parsePrice(item),
      );

      countryCount[country].maxPrice = Math.max(
        countryCount[country].maxPrice,
        Rummager.parsePrice(item),
      );
    });

    return Object
      .keys(countryCount)
      .map(key => [key, countryCount[key].count, countryCount[key]])
      .sort((a, b) => b[1] - a[1]);
  }

  static clearFilters() {
    $('#itemFilter').val('');
    $('#notesFilter').val('');
    $('#firstColumn').val('');
    $('#priceFilter').val('');
    $('#itemFilter').keyup();
  }

  static parsePrice(row) {
    return Number($($(row).children()[2]).text().replace(/[^0-9.]+/g, ''));
  }

  static generateFilterArray(element) {
    return element.val().toLowerCase().trim().split(' ');
  }

  static handleFilter() {
    $('.item').hide();

    const onlyAvailable = $('#showAvailableOnly').is(':checked');
    const onlyUnsigned = $('#showUnsignedOnly').is(':checked');
    let $rows = (onlyAvailable) ? $('.item:not(.historic-item)') : $('.item');

    const $requestedRows = $rows.filter((i, e) => $(e).find('.request-status').text().trim() === 'REQ');
    const $unrequestedRows = $rows.filter((i, e) => $(e).find('.request-status').text().trim() !== 'REQ');
    if (onlyUnsigned) {
      $rows = $requestedRows;
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
        price: Rummager.parsePrice($row),
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
    $('#requestedCount').html($unrequestedRows.filter(':visible').length);
    $('#immortalCount').html($('.immortal-item:visible').length);
  }

  static deleteUnwrappedText(node) {
    const parent = node[0]; // Get reference to DOM

    for (let i = 0; i < parent.childNodes.length; i += 1) {
      const currentChild = parent.childNodes[i];
      if (currentChild.nodeType === 3) {
        parent.removeChild(currentChild);
      }
    }
  }

  static overlayRummager() {
    if ($('#notesFilter').length !== 0 || $('#itemFilter').length === 0) {
      return;
    }
    const firstColumnName = $($($('thead')[0]).find('th')[0]).text();
    const firstColumnLabel = `Search ${firstColumnName}`;
    $('#itemFilter').attr({ placeholder: 'Search Name' });
    $('<input type="number" class="form-control" id="priceFilter" placeholder="Upper Price Limit">')
      .insertAfter($('#itemFilter'));
    $('<input type="text" class="form-control" id="notesFilter" placeholder="Search Notes">')
      .insertAfter($('#itemFilter'));
    $(`<input type="text" class="form-control" id="firstColumn" placeholder="${firstColumnLabel}">`)
      .insertAfter($('#itemFilter'));
    $('<button class="btn btn-primary" id="clearFilters" style="margin-top: 5px;">Clear Filters</button>')
      .insertAfter($('#priceFilter'));

    Rummager.deleteUnwrappedText($('#showAvailableOnly').parent());
    $('#showAvailableOnly').remove();

    $('<label><input type="checkbox" id="showAvailableOnly" checked="checked">Show Available Only</label><br/>')
      .insertAfter($('.item-locator'));
    $('<label><input type="checkbox" id="showUnsignedOnly" checked="checked">Hide Signed & Requested</label><br/>')
      .insertAfter($('.item-locator'));

    $('<div id="itemsFound"><span id="requestedCount">0</span> Requested/Signed Items</div>')
      .insertAfter($('#itemsFound'));
    $('<div id="itemsFound"><span id="immortalCount">0</span> Immortal Items</div>')
      .insertAfter($('#itemsFound'));

    $('#clearFilters').click(Rummager.clearFilters);
    $('#showAvailableOnly').change(Rummager.handleFilter);
    $('#showUnsignedOnly').change(Rummager.handleFilter);
    $('#notesFilter').keyup(Rummager.handleFilter);
    $('#firstColumn').keyup(Rummager.handleFilter);
    $('#priceFilter').keyup(Rummager.handleFilter);
    $('#itemFilter').keyup(Rummager.handleFilter);
    $('#itemFilter').keyup();
  }
}

Rummager.overlayRummager();
