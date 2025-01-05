import { DateTime } from "luxon";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/style.css");

  // CNAME
  eleventyConfig.addPassthroughCopy("./src/static/CNAME");

  // Image support
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// which file extensions to process
		extensions: "html",

		// Add any other Image utility options here:

		// optional, output image formats
		formats: ["webp", "jpeg"],
		// formats: ["auto"],

		// optional, output image widths
		// widths: ["auto"],

		// optional, attributes assigned on <img> override these values.
		defaultAttributes: {
			loading: "lazy",
			decoding: "async",
			sizes: "auto",
		},

    // urlPath: "/img/",
	});

  eleventyConfig.addFilter("postDate", date => {
    const dateTimeFormat = DateTime.DATE_SHORT;
    if (date && typeof date.getMonth === "function") {
      return DateTime.fromJSDate(date).toLocaleString(dateTimeFormat);
    }
    if (typeof date === "object") {
      return DateTime.fromObject(date).toLocaleString(dateTimeFormat);
    }
    return DateTime.fromISO(date).toLocaleString(dateTimeFormat);
  });
}

export const config = {
  dir: {
    input: "src",
    output: "_site",
  },
};
