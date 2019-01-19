const FileModels = require('../../models/Files');

const Files = {
  uploadFile: (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    const { file } = req.files;


    FileModels.upload(file)
      .then((data) => res.status(201).json({
        success: true,
        message: 'File has been uploaded',
        data: {
          ...data,
          created_at: +data.created_at,
          updated_at: +data.updated_at
        }
      }))
      .catch((err) => res.status(400).json({
        success: false,
        message: err
      }));
  },

  getFile: (req, res) => {},

  getFiles: (req, res) => {
    const file_ids = req.query.id;

    FileModels.findAllByArray(file_ids)
      .then((data) => res.status(200).json({
        success: true,
        data
      }))
      .catch((err) => res.status(404).json({
        success: false,
        message: err
      }));
  },

  deleteFile: (req, res) => {
    FileModels.delete(Number(req.params.file_id))
      .then(() => res.status(204).send())
      .catch((err) => res.status(400).json({
        message: err
      }))
  }
};

module.exports = Files;
