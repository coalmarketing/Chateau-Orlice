const slugify = require("slugify");

module.exports = {
	layout: "layouts/post.njk",
	tags: "specialOffer",
	eleventyComputed: {
		preloadImg: data => data.image,
		lang: data => {
			const parts = data.page.inputPath.split("/");
			return parts[parts.length - 2];
		},
		permalink: data => {
			const parts = data.page.inputPath.split("/");
			const lang = parts[parts.length - 2];
			return `/${lang}/akcni-nabidky/${slugify(data.url, { lower: true })}/index.html`;
		}
	}
};