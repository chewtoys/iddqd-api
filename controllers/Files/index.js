const FileModels = require('../../models/Files');

const Files = {
  uploadFile: (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    const { file } = req.files;


    FileModels.upload(file)
      .then((d) => {
        console.log(d)
      })
      .catch((err) => {

      })

      // res.json({
      //   success: true,
      //   status: 'File uploaded!',
      //   extension: '',
      //   size: '',
      //   original_uri: '',
      //   created_at: ''
      // });
    // });
  }
};

module.exports = Files;
