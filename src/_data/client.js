module.exports = {
  name: "Chateau Orlice",
  email: "recepce@eywan.cz",
  ico: "19538685",
  phoneForTel: "+420774000309",
  phoneFormatted: "+420 774 000 309",
  address: {
    lineOne: "Orlice 1",
    city: "Letohrad",
    zip: "561 51",
    mapLink: "https://maps.app.goo.gl/tp9qCYar7462dqA78"
  },
  socials: {
    facebook: "https://www.facebook.com/chateauorliceletohrad",
    instagram: "https://www.instagram.com/chateauorlice/",
    youtube: "https://www.youtube.com/user/tvrzOrlice"
  },
  //! Make sure you include the file protocol (e.g. https://) and that NO TRAILING SLASH is included
  domain: "https://www.chateauorlice.cz",
  // Passing the isProduction variable for use in HTML templates
  isProduction: process.env.ELEVENTY_ENV === "PROD",
};