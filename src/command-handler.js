/**
 * @fileoverview Exports the callback function passed to embark to handle solium commands
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


const Solium = require("solium"), fs = require("fs"),
    consts = require("./constants"), path = require("path"), Table = require("text-table");


function tokenize(command) {
    const tokens = command
        .split(" ")
        .map(t => t.trim())
        .filter(t => t.length > 0);

    return tokens;
}

function createConfigFiles() {
    const defaultConfig = Solium.getDefaultConfig(),
        soliumrc = path.join(consts.ROOT_DIR, consts.SOLIUMRC_JSON),
        soliumignore = path.join(consts.ROOT_DIR, consts.SOLIUMIGNORE);

    fs.writeFileSync(soliumrc, JSON.stringify(defaultConfig[consts.SOLIUMRC_JSON], null, 2));
    fs.writeFileSync(soliumignore, defaultConfig[consts.SOLIUMIGNORE]);
}

function help() {
    return Table([[`Solium v${Solium.version}:`, "solium [option]", "|", "--init", "--help"]]);
}


// eslint-disable-next-line no-unused-vars
module.exports = (Embark, command, options) => {

    const tokens = tokenize(command);

    // If command doesn't start with "solium", return the control back to embark (or next plugin in chain)
    if (tokens[0] !== "solium") {
        return false;
    }

    if (tokens.length === 1) {
        return help();
    }

    /* eslint-disable indent */
    switch(tokens[1]) {
        case "--init":
        case "-i":
            try {
                createConfigFiles();
            } catch (e) {
                return `Error while creating Solium config files in root dir: ${e.message}`;
            }

            return `Created ${consts.SOLIUMRC_JSON} & ${consts.SOLIUMIGNORE} in root directory.`;

        case "--help":
        case "-h":
            return help();

        default:
            return `Invalid option "${tokens[1]}".\n${help()}`;
    }
    /* eslint-enable indent */

};
