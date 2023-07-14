import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import sharp from "sharp";

let imageNumber = 0;
const directory = "./images";

// directory doesn't exist, create it
if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
}

const saveImage = () => {
    const imageUrl = `https://cdn-store.leagueoflegends.co.kr/images/v2/profileicons/${imageNumber}.jpg`;

    fetch(imageUrl)
        .then((res) => {
            const dest = fs.createWriteStream(
                path.join(directory, `${imageNumber}.jpg`),
            );
            res.body.pipe(dest);
            res.body.on("error", (err) => {
                console.log(
                    `Error in saving image number: ${imageNumber}, Error: ${err}`,
                );
            });
            dest.on("finish", () => {
                console.log(`Saved image number: ${imageNumber}`);
                imageNumber += 1;
                saveImage(); // recursive call to download next image
            });
        })
        .catch((err) => {
            console.log(
                `Error in fetching image number: ${imageNumber}, Error: ${err}`,
            );
        });
};

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

// saveImage(); // start downloading images
