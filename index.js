/**
 * @fileoverview Entry Point of Embark Framework Solium Plugin
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


const Solium = require("solium"),
    fs = require("fs"), path = require("path"),
    commandHandlerV3 = require("./src/command-handler.v3"),
    commandHandler = require("./src/command-handler"),
    Reporter = require("./src/reporter"), 
    consts = require("./src/constants");


function isASolidityContract(filePath, fileType) {
    return (fileType === "contract" && path.extname(filePath) === ".sol");
}

/**
 * - Attempt loading all dotfiles from root dir.
 * - If any of them isn't found or isn't in the right format, throw with appropriate error message & exit.
 * - Else return loaded configs.
 */
function loadConfig() {
    const soliumrcJsonPath = path.join(consts.ROOT_DIR, consts.SOLIUMRC_JSON),
        soliumignorePath = path.join(consts.ROOT_DIR, consts.SOLIUMIGNORE), config = {};
    const soliumInitInstructions = "Use \"solium --init\" to create linter config files in root directory.";

    try {
        config[consts.SOLIUMRC_JSON] = require(soliumrcJsonPath);
    } catch (e) {
        if (e.code === consts.errors.MODULE_NOT_FOUND) {
            throw new Error(`${soliumrcJsonPath} does not exist. ${soliumInitInstructions}`);
        }

        throw e;
    }

    try {
        config[consts.SOLIUMIGNORE] = fs.readFileSync(soliumignorePath, "utf8");
    } catch (e) {
        if (e.code === consts.errors.NO_SUCH_FILE_OR_DIR) {
            throw new Error(`${soliumignorePath} does not exist. ${soliumInitInstructions}`);
        }

        throw e;
    }

    return config;
}


/**
 * .soliumignore would always assume that files & dirs specified are relative to root dir.
 * The technique below function uses to determine ignorance isn't fool-proof.
 * If we have ignore string "a/b" (where 'b' is a file without any ext) and the file under consideration is "a/b.sol",
 * b.sol gets ignored.
 * But chances of such error are negligible, so not worth spending time & effort to devise another strategy.
 */
function isIgnored(exactFilePath, soliumignore) {
    const ignored = soliumignore
        .split("\n")
        .map(i => path.join(consts.ROOT_DIR, i));

    for (let i = 0; i < ignored.length; i++) {
        if (exactFilePath.startsWith(ignored[i])) {
            return true;
        }
    }

    return false;
}

/**
 * - Ensure that file changed is a Solidity Contract
 * - Find soliumrc & soliumignore config files & load them.
 *   - If not found, notify user to use "solium init" then abort.
 * - If the current contract is marked to be ignored, exit now.
 * - Send contract for linting
 * - Write lint output to console
 */
function fileChangeHandler(Embark, {fileType, path: filePath}) {
    if (!isASolidityContract(filePath, fileType)) {
        return;
    }

    let config, issues;
    const reporter = new Reporter(Embark.logger), exactFilePath = path.join(consts.ROOT_DIR, filePath);

    try {
        config = loadConfig();  // load dotfiles from root dir
    } catch (e) {
        return reporter.reportFatal(`${consts.MSG_PREFIX} ${e.message}`);
    }

    if (isIgnored(exactFilePath, config[consts.SOLIUMIGNORE])) {
        return;
    }

    try {
        issues = Solium.lint(fs.readFileSync(exactFilePath, "utf8"), config[consts.SOLIUMRC_JSON]);
    } catch (e) {
        return reporter.reportFatal(`${consts.MSG_PREFIX} ${e.message}`);
    }

    reporter.reportLintIssues(filePath, issues);
}


module.exports = Embark => {
    // support for legacy Embark versions
    const isLegacy = !Embark.version; // Embark.version only exposed in Embark 4
    Embark.events.on("file-event", (...args) => {
        const params = isLegacy ? {fileType: args[0], path: args[1]} : args[0];
        fileChangeHandler(Embark, params);
    });
    if(isLegacy) {
        return Embark.registerConsoleCommand(commandHandlerV3.bind(null, Embark));
    }
    Embark.registerConsoleCommand(commandHandler);
};
