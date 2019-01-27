// const db = require('../../config/db');
//
// const Tag = {
//   add: (tag) => new Promise((resolve, reject) => {
//     db.query('INSERT INTO tags (name, created_at, updated_at) VALUES ($1, current_timestamp, current_timestamp) returning *', [tag])
//       .then((res) => resolve(res.rows[0]))
//       .catch((err) => reject(err))
//   }),
//
//   findOneById: (id) => new Promise((resolve, reject) => {
//     db.query(`SELECT * FROM tags WHERE id = ${id}`)
//       .then((res) => resolve(res.rows[0]))
//       .catch((err) => reject(err))
//   }),
//
//   findByName: (name) => new Promise((resolve, reject) => {
//     db.query(`SELECT * FROM tags WHERE LOWER(name) LIKE '%${name.toLowerCase()}%'`)
//       .then((res) => resolve(res.rows))
//       .catch((err) => reject(err))
//   }),
//
//   delete: (id) => new Promise((resolve, reject) => {
//     db.query(`DELETE FROM tags WHERE id = ${id} returning id`)
//       .then((res) => res.rows[0])
//       .then((id) => {
//         if (!id) reject('Tag not found');
//
//         resolve();
//       })
//       .catch((err) => reject(err));
//   }),
// };
//
// module.exports = Tag;
