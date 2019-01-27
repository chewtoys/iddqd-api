const TagModels = require('../../models/Tags');

const Tags = {
  addTag: (req, res) => {
    const { name } = req.body;

    TagModels.add(name)
      .then((data) => res.status(201).json({
        data: {
          ...data,
          created_at: +data.created_at,
          updated_at: +data.updated_at
        }
      }))
      .catch((err) => res.status(400).json({
        msg: err
      }));
  },

  getTag: (req, res) => {
    TagModels.findOneById(req.params.tag_id)
      .then((data) => res.status(200).json({
        data: {
          ...data,
          created_at: +data.created_at,
          updated_at: +data.updated_at
        }
      }))
      .catch((err) => res.status(404).json({
        success: false,
        msg: err
      }));
  },

  getTags: (req, res) => {
    const { name } = req.query;

    TagModels.findByName(name)
      .then((data) => res.status(200).json({
        data: data.map((tag) => ({
          ...tag,
          created_at: +tag.created_at,
          updated_at: +tag.updated_at
        }))
      }))
      .catch((err) => res.status(404).json({
        msg: err
      }));
  },

  deleteTag: (req, res) => {
    TagModels.delete(Number(req.params.tag_id))
      .then(() => res.status(204).send())
      .catch((err) => res.status(400).json({
        msg: err
      }))
  }
};

module.exports = Tags;
