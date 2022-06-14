const COORDINATES_EXPRESSION = /(?<lon_degrees>\d{1,3})°(?<lon_minutes>\d{1,2})'(?<lon_seconds>\d{1,2}\.\d+)'' (?<east_west>[EW]) \/ (?<lat_degrees>\d{1,2})°(?<lat_minutes>\d{1,2})'(?<lat_seconds>\d{1,2}\.\d+)'' (?<north_south>[NS])/g;
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=";

addGCoordinates();

function addGCoordinates() {
    let tables = document.getElementById("td-main-table").getElementsByTagName("table");
    let positionTableRows = tables.item(0).getElementsByTagName("tr")
    let locationCells = positionTableRows.item(0).getElementsByTagName("td");

    let coordinatesCell = locationCells.item(1);

    let cellContent = coordinatesCell.innerHTML;
    let items = cellContent.split("<br>");

    let coordinatesText = items[2];
    let gCoordinates = getGCoordinates(coordinatesText);
    let gUrl = getGUrl(gCoordinates);

    coordinatesCell.innerHTML += "<br>" + gCoordinates + "&nbsp;" + gUrl;
}

function getGCoordinates(coordinatesText) {

    let match = COORDINATES_EXPRESSION.exec(coordinatesText);
    let latitude = parseInt(match.groups.lat_degrees) + parseInt(match.groups.lat_minutes) / 60 + parseFloat(match.groups.lat_seconds) / 3600;

    latitude = latitude * (match.groups.north_south === "N" ? 1 : -1);
    let longitude = parseInt(match.groups.lon_degrees) + parseInt(match.groups.lon_minutes) / 60 + parseFloat(match.groups.lon_seconds) / 3600;

    longitude = longitude * (match.groups.east_west === "E" ? 1 : -1);
    return latitude + " , " + longitude;

}

function getGUrl(gCoordinates) {
    let href = MAPS_URL + encodeURI(gCoordinates);
    let imgUrl = chrome.runtime.getURL("/images/location16.png");
    return "<a href=\"" + href + "\" target=\"_blank\"><img alt=\"Location icon\" src=\"" + imgUrl + "\"></a>";
}
