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
      const country = $(item).find('.item-country').text().toLowerCase().trim();
      if (countryCount[country] === undefined) {
        countryCount[country] = { country: country, count: 0, minPrice: 1000, maxPrice: 0 };
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
      .values(countryCount)
      .sort((a, b) => b.count - a.count);
  }

  static clearFilters() {
    $('#itemFilter').val('');
    $('#notesFilter').val('');
    $('#countryFilter').val('');
    $('#priceFilter').val('');
    $('#itemFilter').keyup();
  }

  static parsePrice(row) {
    return Number($(row).find('.price').text().replace(/[^0-9.]+/g, ''));
  }

  static generateFilterArray(element) {
    return element.val().toLowerCase().trim().split(' ');
  }

  static handleFilter() {
    $('.item').hide();

    const onlyAvailable = $('#showAvailableOnly').is(':checked');
    const hideSignedRequested = $('#hideSignedRequested').is(':checked');

    let matchString = '.item';
    if (onlyAvailable) {
      matchString += ':not(.historic-item)';
    }
    if (hideSignedRequested) {
      matchString += ":not([data-requested!=''])";
    }
    const $rows = $(matchString);


    const itemFilterTextArray = Rummager.generateFilterArray($('#itemFilter'));
    const notesFilterTextArray = Rummager.generateFilterArray($('#notesFilter'));
    const countryFilterTextArray = Rummager.generateFilterArray($('#countryFilter'));
    const priceFilter = $('#priceFilter').val();

    $rows.each((index, row) => {
      const $row = $(row);
      const item = {
        name: $row.find('.item-name').text().toLowerCase(),
        notes: $row.find('.notes').text().toLowerCase(),
        price: Rummager.parsePrice($row),
        country: $row.find('.item-country').text().toLowerCase(),
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

    const $visibleRows = $('.item:visible');

    $('#count').html($visibleRows.length);
    $('#requestedCount').html($visibleRows.filter((i, e) => $(e).is("[data-requested!='']")).length);
    $('#immortalCount').html($visibleRows.find('.immortal-item').length);
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
    if ($('#clearFilters').length !== 0 || $('#itemFilter').length === 0) {
      return;
    }

    Rummager.deleteUnwrappedText($('#showAvailableOnly').parent());
    $('#showAvailableOnly').remove();
    $('#hideSignedRequested').remove();

    $('<div><label><input type="checkbox" id="showAvailableOnly" checked="checked">Show Available Only</label></div>')
      .insertAfter($('.item-locator'));
    $('<div><label><input type="checkbox" id="hideSignedRequested" checked="checked">Hide Signed & Requested</label></div>')
      .insertAfter($('.item-locator'));
    $('<button class="btn btn-primary" id="clearFilters" style="margin-top: 5px; margin-bottom: 10px">Clear Filters</button>')
      .insertAfter($('.item-locator'));

    $('<div id="itemsFound"><span id="requestedCount">0</span> Requested/Signed Items</div>')
      .insertAfter($('#itemsFound'));
    $('<div id="itemsFound"><span id="immortalCount">0</span> Immortal Items</div>')
      .insertAfter($('#itemsFound'));

    $('#clearFilters').click(Rummager.clearFilters);
    $('#showAvailableOnly').change(Rummager.handleFilter);
    $('#hideSignedRequested').change(Rummager.handleFilter);
    $('#notesFilter').keyup(Rummager.handleFilter);
    $('#countryFilter').keyup(Rummager.handleFilter);
    $('#priceFilter').keyup(Rummager.handleFilter);
    $('#itemFilter').keyup(Rummager.handleFilter);
    Rummager.handleFilter();
  }
}

Rummager.overlayRummager();
