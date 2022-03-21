"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeDataToFile = void 0;
const fs_1 = require("fs");
function writeDataToFile(filepath, content) {
    try {
        if ((0, fs_1.existsSync)(filepath)) {
            (0, fs_1.writeFileSync)(filepath, JSON.stringify(content, null, 2));
        }
        else {
            (0, fs_1.appendFile)(filepath, content, (err) => {
                if (err) {
                    console.log(err);
                }
                console.log(`${filepath} file created writen to`);
            });
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.writeDataToFile = writeDataToFile;
