/**
 * @fileoverview Exports the callback function passed to embark to handle solium commands
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


const Solium = require("solium"), fs = require("fs"),
    consts = require("./constants"), path = require("path"), Table = require("text-table");

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
module.exports = {
    description: "Interacts with the solium plugin for embark.",
    matches: (cmd) => {
        const [commandName] = cmd.split(" ");
        return commandName && commandName.toLowerCase() === "solium";
    },
    usage: help(),
    process: (cmd, callback) => {
        const [, option] = cmd.split(" ");
        if (!option) {
            return callback(null, help());
        }

        /* eslint-disable indent */
        switch(option) {
            case "--init":
            case "-i":
            try {
                createConfigFiles();
            } catch (e) {
                return callback(null, `Error while creating Solium config files in root dir: ${e.message}`);
            }

            return callback(null, `Created ${consts.SOLIUMRC_JSON} & ${consts.SOLIUMIGNORE} in root directory.`);

            case "--help":
            case "-h":
                return callback(null, help());

            default:
                return callback(null, `Invalid option "${option}".\n${help()}`);
        }
        /* eslint-enable indent */
    }
};
