import { Op } from 'sequelize';
import DB  from '../../config/db';
import uuidv4 from 'uuid/v4';
import {
  getFileNameExt,
  uploadFile
} from '../../helpers';

const Files = {
  uploadFile: (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    const { file } = req.files;
    const file_extension = getFileNameExt(file.name);
    const file_name = uuidv4();
    const file_full_name = `${file_name}.${file_extension}`;
    const original_uri = '/uploads/' + file_full_name;
    const uploadPath = process.cwd() + original_uri;
    const file_size = file.data.length;

    uploadFile(file, uploadPath)

      .then(() => DB.File.create({
        original_name: file_name,
        extension: file_extension,
        size: file_size,
        original_uri: original_uri,
        preview_uri: original_uri,
        created_at: +new Date(),
        updated_at: +new Date(),
      }))
      .then((data) => {
        data = data.get({ plain: true });
        res.status(201).json({
          msg: 'File has been uploaded',
          data: {
            ...data,
            created_at: +data.created_at,
            updated_at: +data.updated_at
          }
        })
      })
      .catch((err) => res.status(400).json({
        msg: err
      }));
  },

  getFile: (req, res) => {
    DB.File.findById(req.params.file_id, {
      raw: true
    })
      .then((data) => {
        res.status(200).json({
          data: {
            ...data,
              created_at: +data.created_at,
              updated_at: +data.updated_at
          }
        })
      })
      .catch(() => res.status(404).json({
        msg: 'File not found'
      }));
  },

  getFiles: (req, res) => {
    const { id } = req.query;
    const condition = id && {
      where: {
        id: {
          [Op.in]: id.replace(/\s/g, '').split(',')
        }
      }
    };

    DB.File.findAll({
        ...condition,
      raw: true
    })
      .then((data) => res.status(200).json({
        data: data.map((file) => ({
          ...file,
          created_at: +file.created_at,
          updated_at: +file.updated_at
        }))
      }))
      .catch((err) => res.status(404).json({
        msg: err
      }));
  },

  deleteFile: (req, res) => {
    DB.File.destroy({
      where: {
        id: Number(req.params.file_id)
      },
      raw: true
    })
      .then(() => res.status(204).send())
      .catch((err) => res.status(400).json({
        msg: err
      }))
  }
};

module.exports = Files;
