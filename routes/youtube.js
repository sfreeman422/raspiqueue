const router = require("./api");
const { google } = require("googleapis");

const youtube = google.youtube({
  version: "v3",
  auth: process.env.youtubeApikey
});

router.post("/api/youtube", async (req, res) => {
  const requestParams = {
    maxResults: "25",
    part: "snippet",
    q: req.body.query,
    type: "video"
  };

  const response = await youtube.search.list(requestParams);
  console.log(response);
  res.send(response.data.items);
});

module.exports = router;
