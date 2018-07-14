import FactoryMaker from '../core/FactoryMaker';
import Debug from '../core/Debug';

/* Reference
 * 1. https://segmentfault.com/a/1190000007019545
 * 2. https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 * 3. https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 */

// class FetchLoaderContext {
//   constructor() {
//     this.url = null;
//     this.cbSuccess = null;
//   }
// }

function FetchLoader() {
  let context_ = this.context;
  let debug_ = Debug(context_).getInstance();

  let request_ = null;

  function load(request) {
    request_ = request;

    //
    let fetchRequest;

    const initParams = {
      method: 'GET',
      mode: 'cors',
      credentials: 'same-origin'
    };

    const headersObj = {};
    initParams.headers = new Headers(headersObj);
    fetchRequest = new Request(request_.url, initParams);

    let totalBytes = 0;
    let fetchPromise = fetch(fetchRequest, initParams);
    // process fetchPromise
    fetchPromise.then(function(response) {
      if (response.ok) {
        var pump = function(reader) {
          return reader.read().then(function(result) {
            // if we're done reading the stream, return
            if (result.done) {
              debug_.log('download ' + fetchRequest.url + ' complete, totalBytes: ' + totalBytes);
              request_.cbSuccess(totalBytes);
              return;
            }

            // retrieve the multi-byte chunk of data
            let chunk = result.value;
            totalBytes += chunk.byteLength;

            debug_.log('fetch download chunk: ' + chunk.byteLength);
            request_.cbProgress(chunk.byteLength);

            return pump(reader);
          });
        };

        // start reading the response stream
        return pump(response.body.getReader());
      } else {
        //callbacks.onError({ text: 'fetch, bad network response' }, context);
      }
    }).catch(function() {
      //callbacks.onError({ text: error.message }, context);
    });
  }

  let instance_ = {
    load: load
  };

  return instance_;
}

FetchLoader.__h5player_factory_name = 'FetchLoader';
export default FactoryMaker.getClassFactory(FetchLoader);