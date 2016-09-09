/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC <we@forfuture.co.ke>
 *
 * Constants
 */


// npm-installed modules
const fixedobj = require('fixed-object');


exports = module.exports = fixedobj({
    status: {
        queued: 1,
        push: 2,
        done: 3,
        error: 4,
    },
    stage: {
        remoteState: 1,
        localState: 2,
        diffs: 3,
        update: 4,
    },
});
