/**
 * @fileoverview Entry Point of Embark Framework Solium Plugin
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

"use strict";


function handler(Embark) {
    Embark.events.on("file-event", (fileType, path) => {
        if (fileType === "contract") {
            Embark.logger.info(`File changed: ${path}`);
        }

        Embark.logger.info(`Plugin configuration:\n${JSON.stringify(Embark.pluginConfig, null, 4)}`);
    });
}


module.exports = handler;
