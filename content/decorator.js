const COORDINATES_EXPRESSION = /(?<lon_degrees>\d{1,3})°(?<lon_minutes>\d{1,2})'(?<lon_seconds>\d{1,2}\.\d+)'' (?<east_west>[EW]) \/ (?<lat_degrees>\d{1,2})°(?<lat_minutes>\d{1,2})'(?<lat_seconds>\d{1,2}\.\d+)'' (?<north_south>[NS])/g;
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=';

chrome.storage.sync.get({mapTarget: ''}, function (options) {
    addGCoordinates(options);
});

function addGCoordinates(options) {
    let tables = document.getElementById('td-main-table').getElementsByTagName('table');
    let positionTableRows = tables.item(0).getElementsByTagName('tr')
    let locationCells = positionTableRows.item(0).getElementsByTagName('td');

    let coordinatesCell = locationCells.item(1);

    let cellContent = coordinatesCell.innerHTML;
    let items = cellContent.split('<br>');

    let coordinatesText = items[2];
    let gCoordinates = getGCoordinates(coordinatesText);

    coordinatesCell.innerHTML += '<br>' + '<span id="od_g_coordinates">' + gCoordinates + '</span>';

    let copyAnchor = getClipboardAnchor(gCoordinates);
    if (copyAnchor) {
        coordinatesCell.innerHTML += '&nbsp;';
        coordinatesCell.appendChild(copyAnchor);
    }

    let mapsAnchor = getMapsAnchor(gCoordinates, options.mapTarget);
    if (mapsAnchor) {
        coordinatesCell.innerHTML += '&nbsp;';
        coordinatesCell.appendChild(mapsAnchor);
    }
}

function getGCoordinates(coordinatesText) {
    let match = COORDINATES_EXPRESSION.exec(coordinatesText);

    let latitude = parseInt(match.groups.lat_degrees) + parseInt(match.groups.lat_minutes) / 60 + parseFloat(match.groups.lat_seconds) / 3600;
    latitude = latitude * (match.groups.north_south === 'N' ? 1 : -1);

    let longitude = parseInt(match.groups.lon_degrees) + parseInt(match.groups.lon_minutes) / 60 + parseFloat(match.groups.lon_seconds) / 3600;
    longitude = longitude * (match.groups.east_west === 'E' ? 1 : -1);

    return latitude + ' , ' + longitude;
}

function getClipboardAnchor(coordinatesText) {
    if (!navigator.clipboard) {
        console.log('[Ornitho Decorator] Copying to the clipboard is not supported by the browser');
        return null;
    }

    let actionId = 'copy_coordinates_action';

    let img = document.createElement('img');
    img.id = actionId;
    img.alt = chrome.i18n.getMessage('copyToClipboardLinkAlt');
    img.src = chrome.runtime.getURL('/images/copy16.png');

    let anchor = document.createElement('a');
    anchor.style = 'cursor : pointer;';
    anchor.appendChild(img);

    document.body.addEventListener('click', function (event) {
        if (actionId === event.target.id) {
            navigator.clipboard
                .writeText(coordinatesText)
                .catch(ex => console.log('[Ornitho Decorator] Unable to copy coordinates to the clipboard: ' + ex));
        }
    });

    return anchor;
}

function getMapsAnchor(gCoordinates, mapTarget) {
    let img = document.createElement('img');
    img.alt = chrome.i18n.getMessage('locationLinkAlt');
    img.src = chrome.runtime.getURL('/images/location16.png');

    let anchor = document.createElement('a');
    anchor.href = MAPS_URL + encodeURI(gCoordinates);
    if (mapTarget !== '') {
        anchor.target = mapTarget;
    }
    anchor.appendChild(img);

    return anchor;
}
