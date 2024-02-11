const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

// For security enhancement
const extension = (joi) => ({
  // Remove the 'type' property if not used
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });

        if (clean !== value) {
          return helpers.createError("string.escapeHTML", { value });
        }
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

// Basic campground schema
module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    //image: Joi.string().required(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

// Basic review schema
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }),
});
