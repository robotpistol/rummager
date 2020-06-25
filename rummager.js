class Rummager {
  static matchesFilter(filterTextArray, value) {
    return filterTextArray.reduce((isMatched, filter) => {
      if (!isMatched) { return false; }
      return filter.startsWith('^') ? !value.includes(filter.substr(1)) : value.includes(filter);
    }, true);
  }

  static generateTabs() {
    $(`
      <div role="tabpanel">
        <!-- Nav tabs -->
        <ul class="nav nav-tabs" role="tablist">
          <li role="presentation" class="active"><a href="#home" aria-controls="profile" role="tab" data-toggle="tab">Home</a></li>
          <li role="presentation"><a href="#country-stats" aria-controls="profile" role="tab" data-toggle="tab">Country Stats</a></li>
          <li role="presentation"><a href="#price-stats" aria-controls="profile" role="tab" data-toggle="tab">Price Stats</a></li>
          <li role="presentation"><a href="#independent-bottler" aria-controls="profile" role="tab" data-toggle="tab">Independent Bottlers</a></li>
        </ul>

        <!-- Tab panes -->
        <div id="rummager-tabs" class="tab-content">
        </div>
      </div>
    `).insertBefore($('#originalTable'));
    Rummager.remakeHomeTab();
    Rummager.addCountryCountTab();
    Rummager.addPriceStatsTab();
    Rummager.addIndependentBottlerTab();
  }

  static pickRandomRum() {
    const items = $('.item:visible');
    const itemCount = items.size();
    const randomIndex = Math.floor(Math.random() * itemCount);
    const $row = $(items[randomIndex]);
    $row.find('.item-name').click();
  }

  static remakeHomeTab() {
    $('#rummager-tabs').append(`
      <div role="tabpanel" class="tab-pane active" id="home">
        <table id="mainTable" class="table table-condensed sortable"">
          <thead>
            <tr>
              <th style="width: 60px;">Country</th>
              <th>Item Name</th>
              <th>Price</th>
              <th style="width: 88px;">Sign</th>
              <th style="width: 40px;" class="sorttable_alpha">Notes</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    `);

    $('#itemsFound').each((index, item) => {
      $('#home').prepend($(item));
    });

    $('#home').prepend($('.item-locator'));

    $('.item').each((index, item) => {
      $('#mainTable tbody').append(item);
      const requestedAt = $(item).attr('data-requested');
      const date = Rummager.parseDate(requestedAt);
      const msec = date ? date.valueOf() : '';
      const requestedAtFormatted = date ? date.toLocaleDateString() : '';
      const requestStatus = $(item).find('.request-status');
      requestStatus.append(requestedAtFormatted);
      requestStatus.attr('sorttable_customkey', msec);
    });
    // eslint-disable-next-line no-undef
    sorttable.makeSortable($('#mainTable')[0]);
    $('#originalTable').remove();
  }

  static addIndependentBottlerTab() {
    if ($('#independentBottlerCountTable').length === 0) {
      $('#rummager-tabs').append(`
        <div role="tabpanel" class="tab-pane" id="independent-bottler">
          <table id="independentBottlerCountTable" class="table table-condensed sortable"">
            <thead>
              <tr>
                <th style="width: 60px;">Bottler</th>
                <th class="sorttable_numeric">Goal</th>
                <th class="sorttable_numeric">Signed</th>
                <th class="sorttable_numeric">Unsigned</th>
                <th class="sorttable_numeric">% Signed</th>
                <th class="sorttable_numeric">Total</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      `);

      $.each(Rummager.generateBottlerStats(), (index, item) => {
        $('#independentBottlerCountTable tbody').append(`
          <tr class="bottlerItem" data-requested style="display: table-row;">
            <td>${item.label}</td>
            <td>${item.needed}</td>
            <td>${item.signed}</td>
            <td>${item.unsigned}</td>
            <td>${item.percentComplete}%</td>
            <td>${item.total}</td>
          </tr>
        `);
      });
      // eslint-disable-next-line no-undef
      sorttable.makeSortable($('#independentBottlerCountTable')[0]);
    }
  }

  static addCountryCountTab() {
    if ($('#countryCountTable').length === 0) {
      $('#rummager-tabs').append(`
        <div role="tabpanel" class="tab-pane" id="country-stats">
          <table id="countryCountTable" class="table table-condensed sortable"">
            <thead>
              <tr>
                <th style="width: 60px;">Country</th>
                <th class="sorttable_numeric">Total</th>
                <th class="sorttable_numeric">Signed</th>
                <th class="sorttable_numeric">Unsigned</th>
                <th class="sorttable_numeric">% Signed</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      `);
      Rummager.refreshTable();
    }
  }

  static addPriceStatsTab() {
    $('#rummager-tabs').append(`
      <div role="tabpanel" class="tab-pane" id="price-stats">
        <table id="priceStatsTable" class="table table-condensed sortable"">
          <thead>
            <tr>
              <th class="sorttable_numeric">Price</th>
              <th class="sorttable_numeric">Count</th>
              <th class="sorttable_numeric">Signed</th>
              <th class="sorttable_numeric">Unsigned</th>
              <th class="sorttable_numeric">% Signed</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    `);
    $.each(Rummager.generatePriceCount(), (index, item) => {
      $('#priceStatsTable tbody').append(`
        <tr class="priceCountItem" data-requested style="display: table-row;">
          <td>${item.price}</td>
          <td>${item.count}</td>
          <td>${item.signed}</td>
          <td>${item.unsigned}</td>
          <td>${item.percentComplete}%</td>
        </tr>
      `);
    });
    // eslint-disable-next-line no-undef
    sorttable.makeSortable($('#priceStatsTable')[0]);
  }

  static generateBottlerStats() {
    return [
      { label: 'Blackadder', accept: 'blackadder', needed: 15 },
      { label: 'Boutique-y', accept: 'boutique', needed: 18 },
      {
        label: 'Bristol Classic/Spirits',
        accept: 'bristol',
        reject: ['^avery'],
        needed: 17,
      },
      { label: 'Cadenhead', accept: 'cadenhead', needed: 14 },
      { label: 'Duncan Taylor', accept: 'duncan', needed: 8 },
      { label: 'Hamilton', accept: 'hamilton', needed: 15 },
      {
        label: 'Plantation',
        accept: 'plantation',
        reject: ['^grove', '^myer'],
        needed: 16,
      },
      { label: 'Samaroli', accept: 'samaroli', needed: 22 },
      { label: 'Velier', accept: 'velier', needed: 42 },
    ].map((bottlerRow) => {
      const bottler = $.extend({
        total: 0,
        signed: 0,
        unsigned: 0,
        minPriceNeededToFinish: 0,
        cheapestUnsigned: null,
      }, bottlerRow);

      let matchArray;
      matchArray = [bottler.accept];
      if (bottler.reject) {
        matchArray = matchArray.concat(bottler.reject);
      }

      const priceList = [];
      $('.item').each((index, item) => {
        const $item = $(item);
        if ($item.is('.historic-item') && $item.is("[data-requested='']")) {
          return;
        }
        const itemName = $item.find('.item-name').text().toLowerCase().trim();
        if (Rummager.matchesFilter(matchArray, itemName)) {
          const price = Rummager.parsePrice(item);
          if ($item.is("[data-requested!='']")) {
            bottler.signed += 1;
          } else {
            priceList.push(price);
            bottler.unsigned += 1;
            bottler.cheapestUnsigned = Math.min(
              bottler.cheapestUnsigned || price,
              price,
            );
          }
          bottler.total += 1;
        }
      });
      bottler.minPriceNeededToFinish = priceList
        .sort()
        .slice(0, Math.max(bottler.needed - bottler.signed, 0))
        .reduce((a, b) => a + b, 0);
      bottler.percentComplete = Math.min(
        Math.round((bottler.signed * 100.0) / bottler.needed),
        100,
      );
      return bottler;
    });
  }

  static generatePriceCount() {
    const priceCount = {};
    $('.item').each((index, item) => {
      const $item = $(item);
      /* Ignore items that are no longer available and unrequested/signed */
      if ($item.is('.historic-item') && $item.is("[data-requested='']")) {
        return;
      }
      const price = Rummager.parsePrice(item);
      const countryItem = $item.find('.item-country');
      const country = countryItem.text().toLowerCase().trim();
      if (priceCount[price] === undefined) {
        priceCount[price] = {
          price,
          count: 0,
          countries: new Set(),
          signed: 0,
          unsigned: 0,
          percentComplete: 0,
        };
      }
      const countItem = priceCount[price];

      if ($item.is("[data-requested!='']")) {
        countItem.signed += 1;
      } else {
        countItem.unsigned += 1;
      }

      countItem.count += 1;
      countItem.countries.add(country);
      countItem.percentComplete = Math.round((countItem.signed * 100.0) / countItem.count);
    });
    return priceCount;
  }

  static generateCountryCount() {
    const countryCount = {};
    $('.item').each((index, item) => {
      const $item = $(item);
      /* Ignore items that are no longer available and unrequested/signed */
      if ($item.is('.historic-item') && $item.is("[data-requested='']")) {
        return;
      }

      const countryItem = $item.find('.item-country');
      const country = countryItem.text().toLowerCase().trim();
      const itemPrice = Rummager.parsePrice(item);

      if (countryCount[country] === undefined) {
        countryCount[country] = {
          country,
          total: 0,
          signed: 0,
          unsigned: 0,
          minPrice: 1000,
          maxPrice: 0,
          percentComplete: 0,
        };
      }
      const countItem = countryCount[country];

      countItem.total += 1;
      if ($item.is("[data-requested!='']")) {
        countItem.signed += 1;
      } else {
        countItem.unsigned += 1;
      }
      countItem.minPrice = Math.min(countItem.minPrice, itemPrice);
      countItem.maxPrice = Math.max(countItem.maxPrice, itemPrice);
      countItem.percentComplete = Math.round((countItem.signed * 100.0) / countItem.total);
    });
    return Object
      .values(countryCount)
      .sort((a, b) => b.total - a.total);
  }

  static refreshTable() {
    $('#countryCountTable tbody tr').remove();
    $.each(Rummager.generateCountryCount(), (index, item) => {
      $('#countryCountTable tbody').append(`
        <tr class="countItem" data-requested style="display: table-row;">
          <td>${item.country}</td>
          <td>${item.total}</td>
          <td>${item.signed}</td>
          <td>${item.unsigned}</td>
          <td>${item.percentComplete}%</td>
        </tr>
      `);
    });
    // eslint-disable-next-line no-undef
    sorttable.makeSortable($('#countryCountTable')[0]);
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

  static parseDate(dateText) {
    if (!dateText) { return null; }
    const date = new Date(dateText.replace(' at ', ' '));
    const yearlessDate = new Date('Jan 1');
    if (date.getFullYear() === yearlessDate.getFullYear()) {
      date.setYear(new Date().getFullYear());
    }
    return date;
  }

  static hideNotes() {
    if ($('#hideNotes').is(':checked')) {
      $('.notes').hide();
    } else {
      $('.notes').show();
    }
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
      const rowMatched = Rummager.matchesFilter(itemFilterTextArray, item.name)
        && Rummager.matchesFilter(notesFilterTextArray, item.notes)
        && Rummager.matchesFilter(countryFilterTextArray, item.country)
        && (priceFilter === '' || item.price <= priceFilter);

      if (rowMatched) {
        $row.show();
      } else {
        $row.hide();
      }
    });

    const $visibleRows = $('.item:visible');
    $('#count').html($visibleRows.length);
    $('#immortalCount').html($visibleRows.find('.immortal-item').length);

    const requestedSignedCount = $('.item:visible[data-requested!=""]').length;
    const signedCount = $('.item:visible .request-status :first-child.text-success').length;
    $('#requestedCount').html(requestedSignedCount - signedCount);
    $('#signedCount').html(signedCount);
    $('#requestedSignedCount').html(requestedSignedCount);
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

  static addTabs() {
    $(`
      <ul class="nav nav-tabs">
        <li role="presentation" class="active"><a href="#">Home</a></li>
        <li role="presentation"><a href="#">Profile</a></li>
        <li role="presentation"><a href="#">Messages</a></li>
      </ul>
    `).insertBefore($('table'));
  }

  static overlayRummager() {
    if ($('#clearFilters').length !== 0 || $('#itemFilter').length === 0) {
      return;
    }
    $('table').attr('id', 'originalTable');
    Rummager.generateTabs();

    Rummager.deleteUnwrappedText($('#showAvailableOnly').parent());
    $('#showAvailableOnly').remove();
    $('#hideSignedRequested').remove();

    $('<div><label><input type="checkbox" id="hideNotes">Hide Notes</label></div>')
      .insertAfter($('.item-locator'));
    $('<div><label><input type="checkbox" id="showAvailableOnly" checked="checked">Show Available Only</label></div>')
      .insertAfter($('.item-locator'));
    $('<div><label><input type="checkbox" id="hideSignedRequested" checked="checked">Hide Signed & Requested</label></div>')
      .insertAfter($('.item-locator'));
    $('<button class="btn btn-primary" id="randrumize" style="margin-top: 5px; margin-bottom: 10px">Randrumize!!!!</button>')
      .insertAfter($('.item-locator'));
    $('<button class="btn btn-primary" id="clearFilters" style="margin-top: 5px; margin-bottom: 10px">Clear Filters</button>')
      .insertAfter($('.item-locator'));
    $('<div id="itemsFound"><span id="requestedCount">0</span> Requested Items</div>')
      .insertAfter($('#itemsFound'));
    $('<div id="itemsFound"><span id="signedCount">0</span> Signed Items</div>')
      .insertAfter($('#itemsFound'));
    $('<div id="itemsFound"><span id="requestedSignedCount">0</span> Requested/Signed Items</div>')
      .insertAfter($('#itemsFound'));
    $('<div id="itemsFound"><span id="immortalCount">0</span> Immortal Items</div>')
      .insertAfter($('#itemsFound'));

    $('#randrumize').click(Rummager.pickRandomRum);
    $('#clearFilters').click(Rummager.clearFilters);
    $('#hideNotes').change(Rummager.hideNotes);
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
