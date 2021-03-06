function getYouTubeVideoId(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\??v?=?))([^#&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[7].length === 11) {
    return match[7];
  }

  return false;
}

function getVimeoVideoId(url) {
  // TODO(Vladimir) - find a shorter regex that covers all of our usecases, remove eslint-disable
  // The eslint line length rule is disabled so we can use our old battle-tested regex for vimeo
  const regExp = /https?:\/\/(?:[\w]+\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/; // eslint-disable-line max-len
  const match = url.match(regExp);

  if (match && match[3]) {
    return match[3];
  }

  return false;
}

function getDailymotionVideoID(url) {
  var m = url.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/);
  if (m !== null) {
    if(m[4] !== undefined) {
      return m[4];
    }
    return m[2];
  }

  return false;
}

function getYouTubeEmbedUrl(id, playerParams) {
  const serializedParams = JSON.stringify(playerParams);
  return `https://www.youtube.com/embed/${id}?${serializedParams}`;
}

function getVimeoEmbedUrl(id) {
  return `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`;
}

function getDailymotionEmbedUrl(id) {
  return `https://www.dailymotion.com/embed/video/${id}`;
}

function getGoogleDriverVideoId(url) {
  if(url.match('https://drive.google.com')) {
    url = url.replace("view", "preview");
    return url
  }
  return false;
}

function getGoogleDriverEmbedUrl(url) {
  return `${url}`;
}

/**
 * Reads the video source and provides the video
 * url in embedded form if necessary
 */

export default class VideoSourceReader {
  constructor(source, playerParams) {
    this.source = source;
    this.playerParams = playerParams;
    this.isYouTube = !!getYouTubeVideoId(source);
    this.isVimeo = !!getVimeoVideoId(source);
    this.isDamilymotion = !!getDailymotionVideoID(source);
    this.isGoogleDriver = !!getGoogleDriverVideoId(source);
  }

  isEmbeddableVideo() {
    return this.isYouTube || this.isVimeo || this.isDamilymotion || this.isGoogleDriver;
  }

  getUrl() {
    if (this.isYouTube) {
      return getYouTubeEmbedUrl(getYouTubeVideoId(this.source), this.playerParams);
    } else if (this.isVimeo) {
      return getVimeoEmbedUrl(getVimeoVideoId(this.source));
    } else if (this.isDamilymotion) {
      return getDailymotionEmbedUrl(getDailymotionVideoID(this.source));
    } else if(this.isGoogleDriver) {
      return getGoogleDriverEmbedUrl(getGoogleDriverVideoId(this.source));
    }

    return this.source;
  }
}