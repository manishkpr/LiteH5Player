var div1 = null;
var media = null;
var player = null;
var audioCodec = null;
var videoCodec = null;
var aContents = [];
var vContents = [];
var pdContent = [];
var drmType = null;
var laUrl = null;
var headers;
var key = null; // only for clearkey

var initDataType;
var initData;

///////////////////////////////////////////////////////////////////////////
// UI reference functions
function beginBuffering() {
  var idBufferingContainer = document.getElementById('idBufferingContainer');
  idBufferingContainer.style.display = 'block';
}

function endBuffering() {
  var idBufferingContainer = document.getElementById('idBufferingContainer');
  idBufferingContainer.style.display = 'none';
}


///////////////////////////////////////////////////////////////////////////
// assets
function initAudioContent() {
  audioCodec = 'audio/mp4; codecs="mp4a.40.2"';

  //
  aContents = [];
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/all.mp4');
  return;

  aContents = [];
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/init.mp4');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/1.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/2.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/3.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/4.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/5.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/6.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/7.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/8.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/9.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/10.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/11.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/12.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/13.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/14.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/15.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/16.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/17.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/18.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/19.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/20.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/21.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/22.m4s');
  aContents.push('http://localhost/2/mydash/features/av_nonmuxed/A48/23.m4s');
}

function initVideoContent() {
  videoCodec = 'video/mp4; codecs="avc1.64001e"';

  // case 1
  //vContents = [];
  //vContents.push('http://10.2.72.19/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/first20.mp4');
  //vContents.push('http://localhost/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/all.mp4');
  //return;

  vContents = [];
  vContents.push('http://localhost/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/init.mp4');
  vContents.push('http://localhost/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/1.m4s');
  vContents.push('http://localhost/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/2.m4s');
  vContents.push('http://localhost/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/3.m4s');
  vContents.push('http://localhost/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/4.m4s');
  vContents.push('http://localhost/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/5.m4s');
  vContents.push('http://localhost/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/6.m4s');
  vContents.push('http://localhost/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/7.m4s');
  vContents.push('http://localhost/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/8.m4s');
  vContents.push('http://localhost/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/9.m4s');
  vContents.push('http://localhost/2/mydash/features/av_nonmuxed/V300_with_cc1_and_cc3/10.m4s');

  // case 2
  //vContents.push('http://localhost/2/dash_example/mulitmpd/mp4-main-multi-aaclc_high-.mp4');
  //vContents.push('http://localhost/2/dash_example/mulitmpd/mp4-main-multi-aaclc_high-1.m4s');
  //vContents.push('http://localhost/2/dash_example/mulitmpd/mp4-main-multi-aaclc_high-2.m4s');
  //vContents.push('http://localhost/2/dash_example/mulitmpd/mp4-main-multi-aaclc_high-3.m4s');

  //// case 3
  //vContents.push('http://localhost/2/mydash/common/bbb_30fps_320x180_200k/bbb_30fps_320x180_200k_0.m4v');
  //vContents.push('http://localhost/2/mydash/common/bbb_30fps_320x180_200k/bbb_30fps_320x180_200k_1.m4v');
  //vContents.push('http://localhost/2/mydash/common/bbb_30fps_320x180_200k/bbb_30fps_320x180_200k_2.m4v');
  //vContents.push('http://localhost/2/mydash/common/bbb_30fps_320x180_200k/bbb_30fps_320x180_200k_3.m4v');
  //vContents.push('http://localhost/2/mydash/common/bbb_30fps_320x180_200k/bbb_30fps_320x180_200k_4.m4v');
  //vContents.push('http://localhost/2/mydash/common/bbb_30fps_320x180_200k/bbb_30fps_320x180_200k_5.m4v');
  //vContents.push('http://localhost/2/mydash/common/bbb_30fps_320x180_200k/bbb_30fps_320x180_200k_6.m4v');
}

function initMseCase01()
{
  // video1
  videoCodec = 'video/mp4; codecs="avc1.4D4029"';
  
  var baseUrl = 'http://localhost/2/mse/test2_main_index/Video1/';
  vContents = [];
  vContents.push(baseUrl + 'Header.m4s');
  for (var i = 0; i < 48; i ++) {
    vContents.push(baseUrl + i.toString() + '.m4s');
  }

  // baseUrl = 'http://localhost/2/mse/test2_main_index/Video4/';
  // vContents.push(baseUrl + 'Header.m4s');
  // for (var i = 0; i < 12; i ++) {
  //   vContents.push(baseUrl + i.toString() + '.m4s');
  // }
}

function initAudioVideoContent() {
  videoCodec = 'video/mp4; codecs="mp4a.40.2, avc1.64001e"';

  // case 1
  vContents = [];
  vContents.push('http://localhost/2/pd/mp4/sample_dashinit.mp4');

  //vContents.push('http://localhost/2/dash_example/hh2/cuc_ieschool_dashinit.mp4');

  return { videoCodec: videoCodec, vContents: vContents };
}

function initPDContent() {
  // test webm vp8
  // videoCodec = 'video/webm; codecs="vorbis,vp8"';
  // vContents.push('http://localhost/1/ark64_frontend/source/resource/movie/test.webm');

  //
  videoCodec = 'video/webm; codecs="vp9,opus"';
  pdContent = 'http://localhost/2/pd/webm/cilla_black_bean_sauce_vp9.webm';
}

function initPDContent_ClearKey() {

  // mp4
  if (0) {
  videoCodec = 'video/mp4; codecs="avc1.4d401e"';
  //pdContent = 'http://localhost/2/pd/drm/video_512x288_h264-360k_clear_enc_dashinit.mp4';
  pdContent = 'http://localhost/2/pd/drm/video_512x288_h264-360k_enc_clear_dashinit.mp4';
  //pdContent = 'http://localhost/2/pd/drm/video_512x288_h264-360k_enc_dashinit.mp4';
  drmType = 'org.w3.clearkey';
  key = new Uint8Array([
    0xbe, 0x7d, 0xf8, 0xa3, 0x66, 0x7a, 0x6a, 0x8f,
    0xd5, 0x64, 0xd0, 0xed, 0x81, 0x33, 0x9a, 0x95
    ]);
  
  initDataType = 'keyids';
  initData = new Uint8Array([
    0x7B, 0x22, 0x6B, 0x69, 0x64, 0x73, 0x22, 0x3A,
    0x5B, 0x22, 0x72, 0x52, 0x50, 0x35, 0x36, 0x69,
    0x76, 0x6D, 0x6D, 0x4C, 0x68, 0x31, 0x39, 0x51,
    0x53, 0x6F, 0x34, 0x38, 0x7A, 0x71, 0x5A, 0x41,
    0x22, 0x5D, 0x7D
    ]);

  // pdContent = 'http://localhost/2/pd/drm/video_512x288_h264-360k_enc_clear_dashinit.mp4';
  // drmType = 'com.widevine.alpha';
  // laUrl = 'https://lic.staging.drmtoday.com/license-proxy-widevine/cenc/';
  // headers = {
  //   'x-dt-auth-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcHREYXRhIjoie1wibWVyY2hhbnRcIjpcInczYy1lbWUtdGVzdFwiLFwidXNlcklkXCI6XCIxMjM0NVwiLFwic2Vzc2lvbklkXCI6XCJcIn0iLCJjcnQiOiJbe1wiYXNzZXRJZFwiOlwibXA0LWJhc2ljXCIsXCJvdXRwdXRQcm90ZWN0aW9uXCI6e1wiZGlnaXRhbFwiOmZhbHNlLFwiYW5hbG9ndWVcIjpmYWxzZSxcImVuZm9yY2VcIjpmYWxzZX0sXCJzdG9yZUxpY2Vuc2VcIjpmYWxzZSxcInByb2ZpbGVcIjp7XCJwdXJjaGFzZVwiOnt9fX1dIiwiaWF0IjoxNTA5NTI3NjY2LCJqdGkiOiJoYkcxMkdCWnZUZlZDTFJ5bFBBa3BBIn0.iO-n8y26wcUOti9B5NMEqCv5yWzCcg_WW29VJXg8jQ8'
  // }
    return;
  }
}

function initCK_WebM() {
  // 
  videoCodec = 'video/webm; codecs="vp8"';
  pdContent = 'http://localhost/2/pd/drm/Chrome_44-enc_av.webm';
  drmType = 'org.w3.clearkey';

  key = new Uint8Array([
      0xeb, 0xdd, 0x62, 0xf1, 0x68, 0x14, 0xd2, 0x7b,
      0x68, 0xef, 0x12, 0x2a, 0xfc, 0xe4, 0xae, 0x3c
    ]);
}

function initCK_MP4() {
  // shaka test mp4
  videoCodec = 'video/mp4; codecs="avc1.4d401f"';
  pdContent = 'http://localhost/2/pd/drm/v-0360p-0750k-libx264.mp4';
  drmType = 'org.w3.clearkey';
  laUrl = 'http://cwip-shaka-proxy.appspot.com/clearkey?_u3wDe7erb7v8Lqt8A3QDQ=ABEiM0RVZneImaq7zN3u_w';
}

function initWV_MP4() {
  // case01
  //audioCodec = 'audio/mp4; codecs="mp4a.40.2"';
  //aContents.push('http://10.2.68.51/tasklink/65421_chromecast/content_wv_shaka/a-eng-0128k-aac.mp4');

  videoCodec = 'video/mp4; codecs="avc1.42c01e"';
  pdContent.push('http://10.2.68.51/tasklink/65421_chromecast/content_wv_shaka/v-0144p-0100k-libx264.mp4');

  laUrl = 'https://widevine-proxy.appspot.com/proxy';
  drmType = 'com.widevine.alpha';
}

function initDRM_PR() {
  switch(1)
  {
    case 0:
    {
      videoCodec = 'video/mp4; codecs="avc1.42C014"';
      //vContents.push('http://localhost/tasklink/65421_chromecast/content_pr/dash.mp4');
      vContents.push('https://localhost/tasklink/65421_chromecast/content_pr/dash/tears-of-steel-dash-playready-video_eng=405000.dash');
      vContents.push('https://localhost/tasklink/65421_chromecast/content_pr/dash/tears-of-steel-dash-playready-video_eng=405000-0.dash');
      vContents.push('https://localhost/tasklink/65421_chromecast/content_pr/dash/tears-of-steel-dash-playready-video_eng=405000-49152.dash');
      vContents.push('https://localhost/tasklink/65421_chromecast/content_pr/dash/tears-of-steel-dash-playready-video_eng=405000-98304.dash');
      vContents.push('https://localhost/tasklink/65421_chromecast/content_pr/dash/tears-of-steel-dash-playready-video_eng=405000-147456.dash');
      vContents.push('https://localhost/tasklink/65421_chromecast/content_pr/dash/tears-of-steel-dash-playready-video_eng=405000-196608.dash');
      vContents.push('https://localhost/tasklink/65421_chromecast/content_pr/dash/tears-of-steel-dash-playready-video_eng=405000-245760.dash');
      vContents.push('https://localhost/tasklink/65421_chromecast/content_pr/dash/tears-of-steel-dash-playready-video_eng=405000-294912.dash');

      laUrl = 'https://test.playready.microsoft.com/service/rightsmanager.asmx?PlayRight=1&UseSimpleNonPersistentLicense=1';
      drmType = 'com.microsoft.playready';
    } break;
    case 1:
    {
      videoCodec = 'video/mp4; codecs="avc1.4D400D"';
      vContents.push('http://localhost/2/drm/content-tc/DASH/Encrypted/Envivio-0509/video5/Header.m4s');
      vContents.push('http://localhost/2/drm/content-tc/DASH/Encrypted/Envivio-0509/video5/0.m4s');
      vContents.push('http://localhost/2/drm/content-tc/DASH/Encrypted/Envivio-0509/video5/1.m4s');
      vContents.push('http://localhost/2/drm/content-tc/DASH/Encrypted/Envivio-0509/video5/2.m4s');
      vContents.push('http://localhost/2/drm/content-tc/DASH/Encrypted/Envivio-0509/video5/3.m4s');
      vContents.push('http://localhost/2/drm/content-tc/DASH/Encrypted/Envivio-0509/video5/4.m4s');
      vContents.push('http://localhost/2/drm/content-tc/DASH/Encrypted/Envivio-0509/video5/5.m4s');
      vContents.push('http://localhost/2/drm/content-tc/DASH/Encrypted/Envivio-0509/video5/6.m4s');
      vContents.push('http://localhost/2/drm/content-tc/DASH/Encrypted/Envivio-0509/video5/7.m4s');
      vContents.push('http://localhost/2/drm/content-tc/DASH/Encrypted/Envivio-0509/video5/8.m4s');
      vContents.push('http://localhost/2/drm/content-tc/DASH/Encrypted/Envivio-0509/video5/9.m4s');
      vContents.push('http://localhost/2/drm/content-tc/DASH/Encrypted/Envivio-0509/video5/10.m4s');
      drmType = 'com.microsoft.playready';
    } break;
    default:
    break;
  }
}

function initTestTmp() {
  videoCodec = 'video/mp4;codecs="avc1.42c01f"';

  vContents.push('http://localhost/tasklink/65071/mac_chrome/video_begin_0_1.mp4');
  vContents.push('http://localhost/tasklink/65071/mac_chrome/video_data_0_1_0.mp4');
  vContents.push('http://localhost/tasklink/65071/mac_chrome/video_data_0_1_1.mp4');
  vContents.push('http://localhost/tasklink/65071/mac_chrome/video_data_0_2_0.mp4');
  vContents.push('http://localhost/tasklink/65071/mac_chrome/video_data_0_2_1.mp4');
  vContents.push('http://localhost/tasklink/65071/mac_chrome/video_data_0_3_0.mp4');
  vContents.push('http://localhost/tasklink/65071/mac_chrome/video_data_0_3_1.mp4');

  return;

  videoCodec = 'video/mp4;codecs="avc1.4d401f"';

  
  //vContents.push('http://localhost/tasklink/64128/dump_mf200/111.mp4');

// vContents.push('http://localhost/tasklink/64153/dump_of_IE11/video_begin_4_1.mp4');
// vContents.push('http://localhost/tasklink/64153/dump_of_IE11/video_data_4_0_0.mp4');
// vContents.push('http://localhost/tasklink/64153/dump_of_IE11/video_data_4_0_1.mp4');
// vContents.push('http://localhost/tasklink/64153/dump_of_IE11/video_data_4_1_0.mp4');
// vContents.push('http://localhost/tasklink/64153/dump_of_IE11/video_data_4_1_1.mp4');
// vContents.push('http://localhost/tasklink/64153/dump_of_IE11/video_data_4_2_0.mp4');
// vContents.push('http://localhost/tasklink/64153/dump_of_IE11/video_data_4_2_1.mp4');
// vContents.push('http://localhost/tasklink/64153/dump_of_IE11/video_data_4_3_0.mp4');
// vContents.push('http://localhost/tasklink/64153/dump_of_IE11/video_data_4_3_1.mp4');

vContents.push('http://localhost/tasklink/64153/dump_of_IE11/gear1/video_begin_0_0.mp4');
vContents.push('http://localhost/tasklink/64153/dump_of_IE11/gear1/video_data_0_0_0.mp4');
vContents.push('http://localhost/tasklink/64153/dump_of_IE11/gear1/video_data_0_0_1.mp4');
vContents.push('http://localhost/tasklink/64153/dump_of_IE11/gear1/video_data_0_1_0.mp4');
vContents.push('http://localhost/tasklink/64153/dump_of_IE11/gear1/video_data_0_1_1.mp4');
vContents.push('http://localhost/tasklink/64153/dump_of_IE11/gear1/video_data_0_2_0.mp4');
vContents.push('http://localhost/tasklink/64153/dump_of_IE11/gear1/video_data_0_2_1.mp4');

vContents.push('http://localhost/tasklink/64153/dump_of_IE11/gear5/video_begin_4_1.mp4');
// vContents.push('http://localhost/tasklink/64153/dump_of_IE11/gear5/video_data_4_0_0.mp4');
// vContents.push('http://localhost/tasklink/64153/dump_of_IE11/gear5/video_data_4_0_1.mp4');
// vContents.push('http://localhost/tasklink/64153/dump_of_IE11/gear5/video_data_4_1_0.mp4');
// vContents.push('http://localhost/tasklink/64153/dump_of_IE11/gear5/video_data_4_1_1.mp4');
vContents.push('http://localhost/tasklink/64153/dump_of_IE11/gear5/video_data_4_2_0.mp4');
vContents.push('http://localhost/tasklink/64153/dump_of_IE11/gear5/video_data_4_2_1.mp4');
vContents.push('http://localhost/tasklink/64153/dump_of_IE11/gear5/video_data_4_3_0.mp4');
vContents.push('http://localhost/tasklink/64153/dump_of_IE11/gear5/video_data_4_3_1.mp4');


  vContents.push('http://localhost/tasklink/64153/dump_of_IE11/111.mp4');
  //vContents.push('http://localhost/tasklink/64153/dump_gear5/dump_gear5.mp4');

  vContents.push('http://localhost/2/dash_example/test2_main_index/Video1/Header.m4s');
  vContents.push('http://localhost/2/dash_example/test2_main_index/Video1/0.m4s');
  vContents.push('http://localhost/2/dash_example/test2_main_index/Video1/1.m4s');
  vContents.push('http://localhost/2/dash_example/test2_main_index/Video1/2.m4s');
  vContents.push('http://localhost/2/dash_example/test2_main_index/Video1/3.m4s');
  vContents.push('http://localhost/2/dash_example/test2_main_index/Video1/4.m4s');
  vContents.push('http://localhost/2/dash_example/test2_main_index/Video1/5.m4s');

  vContents.push('http://localhost/2/dash_example/test2_main_index/Video4/Header.m4s');
  vContents.push('http://localhost/2/dash_example/test2_main_index/Video4/0.m4s');
  vContents.push('http://localhost/2/dash_example/test2_main_index/Video4/1.m4s');
  vContents.push('http://localhost/2/dash_example/test2_main_index/Video4/2.m4s');
  vContents.push('http://localhost/2/dash_example/test2_main_index/Video4/6.m4s');
  vContents.push('http://localhost/2/dash_example/test2_main_index/Video4/7.m4s');

  vContents.push('http://localhost/2/dash_example/test2_main_index/Video1/Header.m4s');
  vContents.push('http://localhost/2/dash_example/test2_main_index/Video1/8.m4s');
  vContents.push('http://localhost/2/dash_example/test2_main_index/Video1/9.m4s');
  vContents.push('http://localhost/2/dash_example/test2_main_index/Video1/10.m4s');

  return { videoCodec: videoCodec, vContents: vContents };
}

function init1080i() {
  videoCodec = 'video/mp4; codecs="avc3.640028"';
  
  vContents.push('http://10.2.72.133/7/8082/dash-if/ba/ondemand/testcard/1/avc3-events/1920x1080i25/IS.mp4');
  vContents.push('http://10.2.72.133/7/8082/dash-if/ba/ondemand/testcard/1/avc3-events/1920x1080i25/000001.m4s');
  vContents.push('http://10.2.72.133/7/8082/dash-if/ba/ondemand/testcard/1/avc3-events/1920x1080i25/000002.m4s');
  vContents.push('http://10.2.72.133/7/8082/dash-if/ba/ondemand/testcard/1/avc3-events/1920x1080i25/000003.m4s');
  vContents.push('http://10.2.72.133/7/8082/dash-if/ba/ondemand/testcard/1/avc3-events/1920x1080i25/000004.m4s');
  vContents.push('http://10.2.72.133/7/8082/dash-if/ba/ondemand/testcard/1/avc3-events/1920x1080i25/000005.m4s');
}

// tool functions
function onDiv1Click() {
    alert('click div1 element');
}

function onVideoClick() {
    alert('click video element');
}

function initUI() {
  div1 = document.getElementById('div1');
  media = document.getElementById('idVideo');

  // BD
  media.autoplay = false;
  // ED
}

function initData() {
  if (!player) {
    player = new micromtn.Player(media);

    player.on(micromtn.Events.MSE_OPENED, onMSEOpened, {});
    player.on(micromtn.Events.SB_UPDATE_ENDED, onSBUpdateEnded, {});

    player.on(micromtn.Events.MEDIA_PLAYING, onMediaPlaying, {});
    player.on(micromtn.Events.MEDIA_SEEKING, onMediaSeeking, {});
    player.on(micromtn.Events.MEDIA_SEEKED, onMediaSeeked, {});
    player.on(micromtn.Events.MEDIA_WAITING, onMediaWaiting, {});
    
  }
}

// browser & UI callback functions
function onBtnOpen() {
  //initAudioContent();
  initVideoContent();
  //initAudioVideoContent();
  //initPDContent();

  // drm content part
  //initDRM_PR();
  //initWV_MP4();
  //initPDContent_ClearKey();
  //initCK_WebM();
  //initCK_MP4();

  //var info = initTask62293();
  //initMseCase01();
  //initTestTmp();
  //init1080i();

  var info = {
    audioCodec: audioCodec,
    aContents: aContents,
    videoCodec: videoCodec,
    vContents: vContents,
    pdContent: pdContent,

    drm: {
      type: drmType,
      laUrl: laUrl,
      headers: headers,
      key: key, // only for clearkey
      initDataType: initDataType,
      initData: initData
    }
  };

  player.open(info);
}

function onBtnAddA() {
  player.addA();
}

function onBtnAddV() {
  player.addV();
}

function onBtnAddPD() {
  player.addPD();
}

function onBtnDelAll() {
  player.dellAll();
}

function onBtnClose() {
  player.close();
}

function onBtnStop() {
  player.close();
  player = null;
}

function onBtnCast() {
  if (player) {
    player.cast();
  }
}

function onBtnSeek() {
  var time = document.getElementById('seekedTime').value;
  player.seek(time);
}

function onBtnAddTextTrack() {
  if (player) {
    player.addTextTrack();
  }
}

function onBtnRemoveTextTrack() {
  player.removeTextTrack();
}

function setTextTrackHidden() {
  player.setTextTrackHidden();
}

function setCueAlign(align) {
  player.setCueAlign(align);
}

function onFruitClick() {
  alert('aaaa');
}

function onBtnTest() {
  // if (player) {
  //   //player.signalEndOfStream();
  // }
  // if (player) {
  //   player.test();
  // }

  beginBuffering();
}

function onBtnTest2() {
  //player.test2();

  //endBuffering();
}

function onBtnAttribute() {
  player.attribute();
}

//
function onMSEOpened(ev) {
  console.log('--onMSEOpened--');
  //player.addV();
}

function onSBUpdateEnded(ev) {
  console.log('--onSBUpdateEnded--');
  //player.addV();
}

function onMediaPlaying() {
  console.log('--onMediaPlaying--');
  endBuffering();
}

function onMediaSeeking() {
  console.log('--onMediaSeeking--');
}

function onMediaSeeked() {
  console.log('--onMediaSeeked--');
}

function onMediaWaiting() {
  beginBuffering();
}

/////////////////////////////////////////////////////////////////////////
window.onload = function () {
  initUI();
  initData();

  onBtnTest2();
};

window.onunload = function () {
  onBtnStop();
};






