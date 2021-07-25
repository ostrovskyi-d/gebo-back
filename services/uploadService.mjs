import multer from 'multer';

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, 'images/');
    },

    filename(req, file, callback) {
        callback(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const types = ['image/jpeg', 'image/png', 'image/jpg'];

const fileFilter = (req, file, callback) => {
    if(types.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(null, false);
    }
}
        /* todo: images upload to be continued... */
