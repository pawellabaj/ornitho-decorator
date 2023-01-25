const COORDINATES_EXPRESSION = /(?<lon_degrees>\d{1,3})°(?<lon_minutes>\d{1,2})'(?<lon_seconds>\d{1,2}\.\d+)'' (?<east_west>[EW]) \/ (?<lat_degrees>\d{1,2})°(?<lat_minutes>\d{1,2})'(?<lat_seconds>\d{1,2}\.\d+)'' (?<north_south>[NS])/g;
const BOLD_EXPRESSION =/<b>(.*)<\/b>/g;

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=';
const EBIRD_LOCATION_URL = 'https://ebird.org/submit/map?plat=${latitude}&plng=${longitude}&plot=true&name=${name}';

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

    let locationName = getLocationName(items[0]);
    let ddCoordinates = getDDCoordinates(items[2]);


    coordinatesCell.innerHTML += '<br>' + '<span id="od_dd_coordinates">' + ddCoordinates[0] + ', ' + ddCoordinates[1] + '</span>';

    let copyAnchor = getClipboardAnchor(ddCoordinates);
    if (copyAnchor) {
        coordinatesCell.innerHTML += '&nbsp;';
        coordinatesCell.appendChild(copyAnchor);
    }

    let mapsAnchor = getMapsAnchor(ddCoordinates, options.mapTarget);
    if (mapsAnchor) {
        coordinatesCell.innerHTML += '&nbsp;';
        coordinatesCell.appendChild(mapsAnchor);
    }

    let ebirdAnchor = getEbirdAnchor(locationName, ddCoordinates, options.mapTarget);
    if (ebirdAnchor) {
        coordinatesCell.innerHTML += '&nbsp;';
        coordinatesCell.appendChild(ebirdAnchor);
    }
}

function getLocationName(nameText) {
    let items = BOLD_EXPRESSION.exec(nameText);

    return items[1];
}

function getDDCoordinates(coordinatesText) {
    let match = COORDINATES_EXPRESSION.exec(coordinatesText);

    let latitude = parseInt(match.groups.lat_degrees) + parseInt(match.groups.lat_minutes) / 60 + parseFloat(match.groups.lat_seconds) / 3600;
    latitude = latitude * (match.groups.north_south === 'N' ? 1 : -1);

    let longitude = parseInt(match.groups.lon_degrees) + parseInt(match.groups.lon_minutes) / 60 + parseFloat(match.groups.lon_seconds) / 3600;
    longitude = longitude * (match.groups.east_west === 'E' ? 1 : -1);

    return [latitude, + longitude];
}

function getClipboardAnchor(ddCoordinates) {
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
                .writeText(ddCoordinates[0] + ', ' + ddCoordinates[1])
                .catch(ex => console.log('[Ornitho Decorator] Unable to copy coordinates to the clipboard: ' + ex));
        }
    });

    return anchor;
}

function getMapsAnchor(ddCoordinates, mapTarget) {
    let img = document.createElement('img');
    img.alt = chrome.i18n.getMessage('locationLinkAlt');
    img.src = chrome.runtime.getURL('/images/location16.png');

    let anchor = document.createElement('a');
    anchor.href = MAPS_URL + ddCoordinates[0] + ',' + ddCoordinates[1];
    if (mapTarget !== '') {
        anchor.target = mapTarget;
    }
    anchor.appendChild(img);

    return anchor;
}

function getEbirdAnchor(locationName, ddCoordinates, mapTarget) {
    let img = document.createElement('img');
    img.alt = chrome.i18n.getMessage('eBirdLinkAlt');
    img.src = chrome.runtime.getURL('/images/ebird16.png');

    let anchor = document.createElement('a');
    anchor.href = EBIRD_LOCATION_URL
        .replace('${name}', encodeURI(locationName))
        .replace('${latitude}', ddCoordinates[0])
        .replace('${longitude}', ddCoordinates[1]);

    if (mapTarget !== '') {
        anchor.target = mapTarget;
    }
    anchor.appendChild(img);

    return anchor;
}
