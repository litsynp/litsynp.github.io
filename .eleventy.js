import { DateTime } from "luxon";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

const addSeries = (mapping, series, seriesDescription, date, post) => {
  if (!mapping.has(series)) {
    mapping.set(series, {
      posts: [],
      description: seriesDescription,
      date,
    });
  }

  // get the entry for this series
  const existing = mapping.get(series);

  // add the current post to the list
  existing.posts.push({
    title: post.data.title,
    url: post.url,
  });

  // update the date so we always have the date from the latest post
  existing.date = date;
};

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/style.css");

  // CNAME
  eleventyConfig.addPassthroughCopy({ "./src/static": "/" });

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

  eleventyConfig.addFilter("jsonStringify", (value) => {
    return JSON.stringify(value);
  });

  eleventyConfig.addFilter("postDate", (date) => {
    const dateTimeFormat = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    if (date && typeof date.getMonth === "function") {
      return DateTime.fromJSDate(date).toLocaleString(dateTimeFormat);
    }
    if (typeof date === "object") {
      return DateTime.fromObject(date).toLocaleString(dateTimeFormat);
    }
    return DateTime.fromISO(date).toLocaleString(dateTimeFormat);
  });

  eleventyConfig.addFilter("threePosts", (posts) => {
    return posts.slice(0, 3);
  });

  eleventyConfig.addCollection("series", (collection) => {
    // get all posts in chronological order
    const posts = collection.getSortedByDate();

    // this will store the mapping from series to lists of posts; it can be a
    // regular object if you prefer
    const mapping = new Map();

    // loop over the posts
    for (const post of posts) {
      // get any series data for the current post, and store the date for later
      const { series, seriesDescription, date } = post.data;

      // ignore anything with no series data
      if (series === undefined) {
        continue;
      }

      // If the series is an array, we’ll treat each element as a separate series
      if (Array.isArray(series)) {
        for (const s of series) {
          addSeries(mapping, s, seriesDescription, date, post);
        }
        continue;
      } else {
        addSeries(mapping, series, seriesDescription, date, post);
      }
    }

    // now to collect series containing more than one post as an array that
    // Eleventy can paginate
    const normalized = [];

    // loop over the mapping (`k` is the series title)
    for (const [k, { posts, description, date }] of mapping.entries()) {
      if (posts.length > 1) {
        // add any series with multiple posts to the new array
        normalized.push({ title: k, posts, description, date });
      }
    }

    // return the array
    return normalized;
  });
}

export const config = {
  dir: {
    input: "src",
    output: "_site",
  },
};
