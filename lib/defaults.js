exports.serverSettings = {
    host: '127.0.0.1',
    port: 0,
    username: "username",
    password: "password",
    number: "123-456-7890",
    ip: "11.11.11.11"
}
exports.server = {
    "server_id":"\"VX Engine\"",
    "server_version":"2.0.0",
    "server_caps":"\"bBrhit\"",
    "lwcp_version":"1",
    "zone":"US",
    "uid":"\"1A2B3C4D5E6F\""
}

exports.studio = function(id){
    return {
        name: "Studio "+id,
        id: id,
        shows: 2,
        showName: "Show "+id,
        showId: 1,
        lines: 6,
        hybrids: 2,
        fixedHybrids: 0
    }
}

//Keys are the names of valid objects while arrays are names of valid operations within object
exports.validObjects = {
    'cc': ['get','set','login','ping'],
    'studio': ['get','select','select_show','im','busy_all','drop','hold'],
    'studio.line': ['get','set','call','seize','take','drop','lock','unlock','hold','raise','sub','unsub'],
    'studio.book': ['get','set','add','del'],
    'studio.log': ['get']
}