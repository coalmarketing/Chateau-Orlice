// ─────────────────────────────────────────────────────────────────────────────
// ELEVENTY CONFIGURATION
// This file configures how Eleventy builds your static site
// Documentation: https://www.11ty.dev/docs/config/
// ─────────────────────────────────────────────────────────────────────────────

// 📦 Plugin Imports
const pluginImages = require("@codestitchofficial/eleventy-plugin-sharp-images");
const pluginMinifier = require("@codestitchofficial/eleventy-plugin-minify");
const pluginNavigation = require("@11ty/eleventy-navigation");
const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");
const { EleventyI18nPlugin } = require("@11ty/eleventy");

// ⚙️ Configuration Files
const configSitemap = require("./src/config/plugins/sitemap");
const configImages = require("./src/config/plugins/images");
const configI18n = require("./src/config/plugins/i18n");

// 🔧 Processing Functions
const javascript = require("./src/config/processors/javascript");

// 🛠️ Utilities
const filterPostDate = require("./src/config/filters/postDate");
const filterIsoDate = require("./src/config/filters/isoDate");
const isProduction = process.env.ELEVENTY_ENV === "PROD";


module.exports = function (eleventyConfig) {
    // ═════════════════════════════════════════════════════════════════════════
    // LANGUAGES
    // Using Eleventy's build events to process non-template languages
    // Learn more: https://www.11ty.dev/docs/events/
    // ═════════════════════════════════════════════════════════════════════════

    /*
     * JavaScript Processing
     * These processors handle bundling, transpiling, and minification
     * - JavaScript: Compiled with esbuild for modern bundling
     */
    eleventyConfig.on("eleventy.after", javascript);

    // ═════════════════════════════════════════════════════════════════════════
    // PLUGINS
    // Extend Eleventy with additional functionality
    // Learn more: https://www.11ty.dev/docs/plugins/
    // ═════════════════════════════════════════════════════════════════════════

    /*
     * 🖼️ Image Optimization
     * Resize and optimize images for better performance using {% getUrl %}
     * Documentation: https://github.com/CodeStitchOfficial/eleventy-plugin-sharp-images
     */
    eleventyConfig.addPlugin(pluginImages, configImages);

    /*
     * 🧭 Navigation Plugin
     * Enables hierarchical navigation structure via front matter
     * Documentation: https://www.11ty.dev/docs/plugins/navigation/
     */
    eleventyConfig.addPlugin(pluginNavigation);

    /*
     * 🗺️ Sitemap Generation
     * Creates sitemap.xml automatically using domain from _data/client.json
     * Documentation: https://github.com/quasibit/eleventy-plugin-sitemap
     */
    eleventyConfig.addPlugin(EleventyI18nPlugin, configI18n);

    /*
    * 🌍 Internationalization (i18n) Plugin
    * Adds support for translating content and generating localized URLs
    * Documentation: https://www.11ty.dev/docs/plugins/i18n/
    */
    eleventyConfig.addPlugin(pluginSitemap, configSitemap);

    /*
     * 📦 Production Minification
     * Minifies HTML, CSS, JSON, XML, XSL, and webmanifest files
     * Only runs during production builds (npm run build)
     * Documentation: https://github.com/CodeStitchOfficial/eleventy-plugin-minify
     */
    if (isProduction) {
        eleventyConfig.addPlugin(pluginMinifier);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // PASSTHROUGH COPIES
    // Copy files directly to output without processing
    // Learn more: https://www.11ty.dev/docs/copy/
    // ═════════════════════════════════════════════════════════════════════════

    eleventyConfig.addPassthroughCopy("./src/assets"); // Static assets
    eleventyConfig.addPassthroughCopy("./src/admin"); // CMS admin files
    eleventyConfig.addPassthroughCopy("./src/_redirects"); // Redirect rules

    // ═════════════════════════════════════════════════════════════════════════
    // FILTERS
    // Transform data in templates at build time
    // Learn more: https://www.11ty.dev/docs/filters/
    // ═════════════════════════════════════════════════════════════════════════

    /*
     * 📅 Human-Readable Date Formatting Filter
     * Converts JavaScript dates to human-readable format
     * Usage: {{ "2023-12-02" | postDate }}
     * Powered by Luxon: https://moment.github.io/luxon/api-docs/
     */
    eleventyConfig.addFilter("postDate", filterPostDate);

    /*
     * 📅 ISO Date Formatting Filter
     * Converts JavaScript dates to ISO 8601 format
     * Usage: {{ "2023-12-02" | isoDate }}
     * Powered by Luxon: https://moment.github.io/luxon/api-docs/
     */
    eleventyConfig.addFilter("isoDate", filterIsoDate);

    /*
     * 🔢 Limit Filter
     * Returns a limited number of items from the beginning of an array
     * Usage: {{ collection | limit(5) }}
     * Useful for truncating lists, e.g. showing only the latest N items
     */
    eleventyConfig.addFilter("limit", function (array, limit) {
        return array.slice(0, limit);
    });

    /*
     * 🏷️ Page Language Filter
     * Filters collections by the current page language for i18n compatibility
     * Usage: {{ collections.all | pageLang | eleventyNavigation }}
     */
    eleventyConfig.addFilter("pageLang", function (value) {
        // Figure out the current page’s language
        const currentLang = this.data?.lang || this.page?.lang || this.ctx?.lang;

        return value.filter(item => {
            // Look up the item’s language from page.lang or data.lang
            const itemLang = item.data?.lang || item.page?.lang;
            return itemLang === currentLang;
        });
    });

    /**
     * 🔍 Multi-Property Equality Filter
     * Filters a collection based on multiple property-value pairs.
     * Supports nested properties like "eleventyNavigation.parent".
     * Usage:
     *   {{ collections.all | whereAll({ category: "skola", "eleventyNavigation.parent": "Škola" }) }}
     */
    eleventyConfig.addFilter("whereAll", function (collection, conditions = {}) {
        if (!Array.isArray(collection)) return [];

        // Helper for nested props like "eleventyNavigation.parent"
        function getDeep(obj, path) {
            return path.split(".").reduce((acc, key) => acc && acc[key], obj);
        }

        return collection.filter((item) => {
            return Object.entries(conditions).every(([prop, expected]) => {
                const actual = getDeep(item.data, prop);
                return actual === expected;
            });
        });
    });

    /**
     * 🎯 Find a Single Item in a Collection
     * Finds the first item in a collection that matches multiple property-value pairs.
     * Supports nested properties like "eleventyNavigation.key".
     * Returns the first matching item object, or undefined if no match is found.
     *
     * Usage:
     *   {% set pageNav = collections.all | findWhere({ "eleventyNavigation.key": page.fileSlug }) %}
     *   {% if pageNav %}
     *     <h2>{{ pageNav.data.title }}</h2>
     *   {% endif %}
     */
    eleventyConfig.addFilter("findWhere", function (collection, conditions = {}) {
        // Return undefined if the collection is not a valid array
        if (!Array.isArray(collection)) {
            return undefined;
        }

        // Helper to safely access nested properties (e.g., "eleventyNavigation.key")
        function getDeep(obj, path) {
            return path.split(".").reduce((acc, key) => acc && acc[key] !== undefined ? acc[key] : undefined, obj);
        }

        // Use Array.prototype.find() to return the FIRST item that matches the criteria
        return collection.find((item) => {
            // Use Object.entries().every() to ensure ALL conditions are met for the item
            return Object.entries(conditions).every(([prop, expectedValue]) => {
                // Get the actual value from the item's data, supporting nested paths
                const actualValue = getDeep(item.data, prop);

                // Return true if the actual value matches the expected value
                return actualValue === expectedValue;
            });
        });
    });

    // ═════════════════════════════════════════════════════════════════════════
    // SHORTCODES
    // Generate dynamic content with JavaScript
    // Learn more: https://www.11ty.dev/docs/shortcodes/
    // ═════════════════════════════════════════════════════════════════════════

    /*
     * 📆 Current Year Shortcode
     * Outputs the current year (useful for copyright notices)
     * Usage: {% year %}
     * Updates automatically with each build
     */
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    // ═════════════════════════════════════════════════════════════════════════
    // BUILD CONFIGURATION
    // Define input/output directories and template engine
    // ═════════════════════════════════════════════════════════════════════════

    return {
        dir: {
            input: "src", // Source files directory
            output: "public", // Build output directory
            includes: "_includes", // Partial templates directory
            data: "_data", // Global data files directory
        },
        htmlTemplateEngine: "njk", // Nunjucks for HTML templates
    };
};
