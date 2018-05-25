
import StreamingDownloader from './src/streaming_downloader';

// Shove both of these into the global scope
var context = (typeof window !== 'undefined' && window) || global;

var oldmtn = context.oldmtn;
if (!oldmtn) {
  oldmtn = context.oldmtn = {};
}

// Begin Tools
oldmtn.StreamingDownloader = StreamingDownloader;
// End Tools


export default oldmtn;

