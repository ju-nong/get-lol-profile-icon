import fs from "fs";
import path from "path";
import sharp from "sharp";

const directory = "./images";

fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
        const filePath = path.join(directory, file);
        sharp(filePath)
            .metadata()
            .then(() => {
                console.log(`Image ${file} is valid.`);
            })
            .catch((err) => {
                console.log(
                    `Error with image ${file}: ${err.message}, removing...`,
                );
                fs.unlink(filePath, (err) => {
                    if (err) throw err;
                    console.log(`Successfully removed ${file}`);
                });
            });
    }
});
