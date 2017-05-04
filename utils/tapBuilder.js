module.exports = {
    build: (lineObj) => {
        var tap = {
            site_id : lineObj['Site ID'],
            node_market: lineObj['Market'],
            tap_gen: lineObj['Tap'],
            node_name : lineObj['Node'],
            num_taps : lineObj['Number of Taps'],
            tap_id: lineObj['Tap ID'],
            structure_id : lineObj['Structure ID'],
            structure_type : lineObj['Structure Type'],
            num_addresses : lineObj['Number of addresses'],
            lat : parseFloat(lineObj['Lat']),
            long : parseFloat(lineObj['Long']),
            addresses_served : lineObj['Street Addresses Served'],
            is_known : 2,
            number_traps: 0,
            number_traps_copy : 0
        }
        tap.gps = [tap.long, tap.lat];

        return tap;
    }
};