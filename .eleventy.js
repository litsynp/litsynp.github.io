import { DateTime } from "luxon";

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/style.css");

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
