const slugify = require("slugify");

module.exports = {
	layout: "layouts/post.njk",
	tags: "jobPost",
	eleventyComputed: {
		preloadImg: data => data.image,
		permalink: data => {
			return `/cs/kariera/${slugify(data.url, { lower: true })}/index.html`;
		}
	}
};