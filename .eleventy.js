export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/style.css");
}

export const config = {
  dir: {
    input: "src",
    output: "_site",
  },
};
