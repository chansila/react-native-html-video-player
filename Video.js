import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {
  View,
  WebView,
} from 'react-native';

import VideoSourceReader from './VideoSourceReader';

function createSourceObject(source, playerParams, poster) {
  const sourceReader = new VideoSourceReader(source.uri, playerParams);
  const url = sourceReader.getUrl();

  if (sourceReader.isEmbeddableVideo()) {
    return {
      uri: url,
    };
  }

  const HTML = `
    <video width="100%" height="auto" poster="${poster}" controls  >
       <source src="${url}" >
     </video>
  `;

  return {
    html: HTML,
  };
}

class Video extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    // `playerParams` currently only works for Youtube
    playerParams: PropTypes.object,
    source: PropTypes.shape({
      uri: PropTypes.string,
    }),
    style: PropTypes.object,
    poster: PropTypes.string,
  };

  static defaultProps = {
    playerParams: {
      showinfo: 0,
    },
  };

  render() {
    const {
      width,
      height,
      source,
      style,
      playerParams,
      poster,
    } = this.props;

    return (
      <View style={style.container}>
        <WebView
          source={createSourceObject(source, playerParams, poster)}
          scrollEnabled={false}
        />
      </View>
    );
  }
}

export default Video;