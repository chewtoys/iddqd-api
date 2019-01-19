const db = require('../../config/db');
const uuidv4 = require('uuid/v4');
const { getFileNameExt } = require('../../helpers');

const uploadFile = (file, uploadPath) => new Promise((resolve, reject) => {
  file.mv(uploadPath, (err) => {
    if (err) reject(err);
    resolve()
  })
});

const File = {
  upload: (file) => new Promise((resolve, reject) => {
    const ext = getFileNameExt(file.name);
    const name = uuidv4();
    const filename = `${name}.${ext}`;
    const original_uri = '/uploads/' + filename
    const uploadPath = process.cwd() + original_uri;
    const size = file.data.length;

    uploadFile(file, uploadPath)
      .then(() => {
        db.query('INSERT INTO files (original_name, extension, size, original_uri, preview_uri, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp) returning *', [name, ext, size, original_uri, original_uri])
      })
      .then((res) => resolve(res.rows[0]))
      .catch((err) => reject(err))
  }),
  findOneById: () => {},
  findAllByArray: () => {},
  delete: () => {},
};

module.exports = File;
