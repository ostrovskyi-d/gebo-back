import multer from 'multer';
import moment from 'moment';

const fieldsConfig = [
    {name: 'avatar', maxCount: 1},
    {name: 'img', maxCount: 3}
];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        const date = moment().format('DDMMYYYY-HHmm_SS');
        cb(null, `${date}--${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    switch (file.mimetype) {
        case 'image/jpeg':
        case 'image/png':
        case 'image/jpg':
            return cb(null, true)
        default:
            cb(null, false)
    }
};

const limits = {fileSize: 3000 * 3000 * 5};

export default {
    multer: multer({storage, limits, fileFilter}).fields(fieldsConfig)
}

