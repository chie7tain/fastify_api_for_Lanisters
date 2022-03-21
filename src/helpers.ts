import {
  writeFile,
  writeFileSync,
  appendFileSync,
  existsSync,
  appendFile,
} from "fs";

export function writeDataToFile(filepath: string, content: string) {
  try {
    if (existsSync(filepath)) {
      writeFileSync(filepath, JSON.stringify(content, null, 2));
    } else {
      appendFile(filepath, content, (err) => {
        if (err) {
          console.log(err);
        }
        console.log(`${filepath} file created writen to`);
      });
    }
  } catch (error) {
    console.log(error);
  }
}
