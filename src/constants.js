/**
 * @fileoverview The big book of all constants used by embark-solium
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";

module.exports = Object.freeze({

    errors: {
        MODULE_NOT_FOUND: "MODULE_NOT_FOUND",
        NO_SUCH_FILE_OR_DIR: "ENOENT"
    },

    MSG_PREFIX: "",
    SOLIUMIGNORE: ".soliumignore",
    SOLIUMRC_JSON: ".soliumrc.json",
    ROOT_DIR: process.cwd()

});