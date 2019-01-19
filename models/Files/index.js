const db = require('../../config/db');
const uuidv4 = require('uuid/v4');
const { getFileNameExt, uploadFile } = require('../../helpers');

const File = {
  upload: (file) => new Promise((resolve, reject) => {
    const file_extension = getFileNameExt(file.name);
    const file_name = uuidv4();
    const file_full_name = `${file_name}.${file_extension}`;
    const original_uri = '/uploads/' + file_full_name;
    const uploadPath = process.cwd() + original_uri;
    const file_size = file.data.length;

    uploadFile(file, uploadPath)
      .then(() => db.query('INSERT INTO files (original_name, extension, size, original_uri, preview_uri, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp) returning *', [file_name, file_extension, file_size, original_uri, original_uri]))
      .then((res) => resolve(res.rows[0]))
      .catch((err) => reject(err))
  }),
  findOneById: (file_id) => new Promise((resolve, reject) => {

  }),
  findAllByArray: (file_ids) => new Promise((resolve, reject) => {

    db.query(`SELECT * FROM files WHERE id IN (${file_ids})`)
      .then((res) => resolve(res.rows))
      .catch((err) => reject(err))
  }),
  delete: (file_id) => new Promise((resolve, reject) => {
    db.query(`DELETE FROM files WHERE id = ${file_id} returning id`)
      .then((res) => res.rows[0])
      .then((id) => {
        if (!id) reject('File not found');

        resolve();
      })
      .catch((err) => reject(err));
  }),
};

module.exports = File;
