/**
 * @fileoverview Reporter handles all logging on the Embark console
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


const Table = require("text-table"), linterVersion = require("solium").version;

class Reporter {

    constructor(Logger) {
        this.Logger = Logger;
    }

    reportLintIssues(filename, issues) {
        if (issues.length === 0) {
            this.Logger.info(`Solium v${linterVersion}: No lint issues found.`);
            return;
        }

        const issueEntries = [];

        this.Logger.error(`Lint issues (Solium v${linterVersion}):`);
        this.Logger.error("=".repeat(35));

        issues.forEach(issue => {
            const { line, column, message, ruleName } = issue;
            issueEntries.push([`${line}:${column}`, message, ruleName]);
        });

        this.Logger.warn(Table(issueEntries));
    }

    reportFatal(message) {
        this._log(message, "error");
    }

    warn(message) {
        this._log(message, "warn");
    }

    info(message) {
        this._log(message, "info");
    }

    _log(message, logType) {
        this.Logger[logType](message);
    }

}


module.exports = Reporter;
