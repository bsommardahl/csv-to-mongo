module.exports = {
    parse: (line) => {

        var tap = {
            _id : randomstring.generate(7),
            site_id : jsonObj['Site ID'],
            node_market: jsonObj['Market'],
            tap_gen: jsonObj['Tap'],
            node_name : jsonObj['Node'],
            num_taps : jsonObj['Number of Taps'],
            tap_id: jsonObj['Tap ID'],
            structure_id : jsonObj['Structure ID'],
            structure_type : jsonObj['Structure Type'],
            num_addresses : jsonObj['Number of addresses'],
            lat : parseFloat(jsonObj['Lat']),
            long : parseFloat(jsonObj['Long']),
            addresses_served : jsonObj['Street Addresses Served'],
            is_known : 2,
            number_traps: 0,
            number_traps_copy : 0
            }
            tap.gpsclean = Geo(Math.abs(tap.long),Math.abs(tap.lat));
            tap.gps = [tap.long, tap.lat];

        return {

        };
    }
};