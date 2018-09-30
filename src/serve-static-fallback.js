const path = require('path');
module.exports = (fs, dirs) => {
    return (req, res, next) => {
        const searchDirs = dirs.slice().filter(dir => (dir));
        const assetsDir = '/assets/';
        const indexOfDir = req.path.indexOf(assetsDir);
        if (indexOfDir > -1) {
            const relativePath = req.path.substring(indexOfDir + assetsDir.length);
            const searchInDir = (searchDir, relativePath) => {
                if(searchDir) {
                    const absolutePath = path.resolve(searchDir, relativePath);
                    fs.stat(absolutePath, err => {
                        if (err) {
                            searchInDir(searchDirs.shift(), relativePath);
                        } else {
                            res.sendFile(absolutePath);
                        }
                    });
                } else {
                    next();
                }
            };
            searchInDir(searchDirs.shift(), relativePath);
        } else {
            next();
        }
    };
};