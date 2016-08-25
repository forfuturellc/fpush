/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC < we@forfuture.co.ke>
 */


// npm-installed modules
const load = require("load-grunt-tasks");


exports = module.exports =  function(grunt) {
    load(grunt);

    grunt.initConfig({
        eslint: {
            src: ["lib/**/*.js"],
        },
        mochaTest: {
            test: {
                options: {
                    reporter: "spec",
                    quiet: false,
                    clearRequireCache: false,
                },
                src: ["test/test.*.js"],
            },
        },
    });

    grunt.registerTask("default", ["test"]);
    grunt.registerTask("test", ["eslint", "mochaTest"]);
};
