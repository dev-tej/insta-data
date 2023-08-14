const express = require("express");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

const app = express();
app.use(cors());

const port = 6565;

// Instagram cookie
_cookie = process.env.COOKIE;
// Instagram user agent
_userAgent = process.env.USER_AGENT;
// Instagram x-ig-app-id
_xIgAppId = process.env.X_IG_APP_ID;

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// Get User info by username
app.get("/user/info/:username", async (req, res) => {
  const username = req?.params?.username;
  const response = await fetch(
    `https://www.instagram.com/${username}?__a=1&__d=di`,
    {
      headers: {
        cookie: _cookie,
        "user-agent": _userAgent,
        "x-ig-app-id": _xIgAppId,
        ["sec-fetch-site"]: "same-origin",
      },
    }
  );
  const json = await response.json();
  const items = json?.graphql?.user ?? null;
  res.json(items);
});

// Get Post info by shortcode
app.get("/post/info/:shortcode", async (req, res) => {
  const shortcode = req?.params?.shortcode;
  const response = await fetch(
    `https://www.instagram.com/p/${shortcode}?__a=1&__d=di`,
    {
      headers: {
        cookie: _cookie,
        "user-agent": _userAgent,
        "x-ig-app-id": _xIgAppId,
        ["sec-fetch-site"]: "same-origin",
      },
    }
  );
  const json = await response.json();
  const items = json.items[0];
  const json_data = {
    shortcode: items.code ?? null,
    created_at: items.taken_at ?? null,
    username: items.user.username ?? null,
    full_name: items.user.full_name ?? null,
    profile_picture: items.user.profile_pic_url ?? null,
    is_verified: items.user.is_verified ?? null,
    is_paid_partnership: items.is_paid_partnership ?? null,
    product_type: items.product_type ?? null,
    caption: items.caption?.text ?? null,
    like_count: items.like_count ?? null,
    comment_count: items.comment_count ?? null,
    view_count:
      items.view_count !== undefined
        ? items.view_count
        : items.play_count ?? null,
    video_duration: items.video_duration ?? null,
    location: items.location ?? null,
    height: items.original_height ?? null,
    width: items.original_width ?? null,
    image_versions: items.image_versions2?.candidates ?? null,
    video_versions: items.video_versions ?? null,
  };
  res.json(json_data);
});

// Get Tags info by tag name
app.get("/tag/info/:tagname", async (req, res) => {
  const tagname = req?.params?.tagname;
  const response = await fetch(
    `https://www.instagram.com/api/v1/tags/web_info/?tag_name=${tagname}`,
    {
      headers: {
        cookie: _cookie,
        "user-agent": _userAgent,
        "x-ig-app-id": _xIgAppId,
        ["sec-fetch-site"]: "same-origin",
      },
    }
  );
  const json = await response.json();
  res.json(json);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
