const slugify = require("slugify");

module.exports = {
	tags: ["galleryAlbum"],
	eleventyComputed: {
		lang: data => {
			const parts = data.page.inputPath.split("/");
			return parts[parts.length - 2];
		},
		permalink: data => {
			const parts = data.page.inputPath.split("/");
			const lang = parts[parts.length - 2];
			return `/${lang}/gallery-albums/${slugify(data.title, { lower: true })}/index.html`;
		}
	}
};