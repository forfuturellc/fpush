/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC < we@forfuture.co.ke>
 *
 * The Ftpush Library
 */


// load require extension for '.toml'
require('toml-require').install();


exports = module.exports = {
    // inner modules
    cli: require('./cli'),
    defaults: require('./defaults'),
    main: require('./main'),
};
