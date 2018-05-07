var audioCodec = null;
var videoCodec = null;
var aContents = [];
var vContents = [];
var pdContent = null;
var pdDuration = null;
var drmType = null;
var laUrl = null;
var headers;
var key = null; // only for clearkey

var drmInitDataType;
var drmInitData;

///////////////////////////////////////////////////////////////////////////
// init config
function getInitConfig()
{
  // Begin ads test links
  // Single Inline Linear
  var Single_Inline_Linear = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=';
  var Single_Inline_Linear_local = 'http://localhost/2/ads/Single_Inline_Linear.xml';

  // Single Skippable Inline
  var Single_Skippable_Inline = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=';

  // Single Redirect Linear
  //var SAMPLE_AD_TAG_ = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dredirectlinear&correlator=';

  // Single VPAID 1.0 Linear Flash (VAST Inline)
  //var SAMPLE_AD_TAG_ = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinearvpaid&correlator=';

  // Single VPAID 2.0 Linear
  var Single_VPAID_20_Linear = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinearvpaid2js&correlator=';

  // Single Non-linear Inline
  var Single_Non_linear_Inline = 'https://pubads.g.doubleclick.net/gampad/ads?sz=480x70&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dnonlinear&correlator=';
  var Single_Non_linear_Inline_local = 'http://localhost/2/ads/Single_Non_linear_Inline.xml';

  // VMAP Pre-roll
  var VMAP_Pre_roll_Bumper = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpreonlybumper&cmsid=496&vid=short_onecue&correlator=';

  // VMAP Post-roll
  var VMAP_Post_roll = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpostonly&cmsid=496&vid=short_onecue&correlator=';
  var VMAP_Post_roll_Bumper = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpostonlybumper&cmsid=496&vid=short_onecue&correlator=';

  // VMAP Pre-, Mid-, and Post-rolls, Single Ads
  var VMAP_Pre_Mid_Post = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator=';
  
  var VMAP_Pre_3Mid_Post = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpostpod&cmsid=496&vid=short_onecue&correlator=';

  // VMAP - Pre-roll Single Ad, Mid-roll Standard Pods with 5 Ads Every 10 Seconds for 1:40, Post-roll Single Ad
  // cue points: 0,10,20,30,40,50,60,70,80,90,100,-1
  var VMAP_5Ads_Every_10_Secs = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpostlongpod&cmsid=496&vid=short_tencue&correlator=';
  // End ads test links

  // My own ads test links
  var VMAP_Pre_10_20_Post = 'http://localhost/2/ads/VMAP_Pre_10_20_Post.xml';
  var VMAP_Pre_10_20Skip_Post = 'http://localhost/2/ads/VMAP_Pre_10_20Skip_Post.xml';

  var testAd = 'https://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=is&c=23&pl=VAST&pli=14432293&PluID=0&pos=8834&ord=%5Btimestamp%5D&cim=1';
  var yun_test_ad01 = 'https://skychko.com/fullslot/vast.xml';
  var ad67741 = 'https://googleads.g.doubleclick.net/pagead/ads?ad_type=skippablevideo_text_image_flash&client=ca-video-pub-3701526372767426&description_url=[description_url]&hl=en';
  var ad67720 = 'https://projects.kaltura.com/mdale/hotelVastAd.xml?myRefurl=http%3A//myref.com/%3Ffoo%3Dbar%26cat%3Ddog{utility.nativeAdId';
  var ad67966 = 'https://rtr.innovid.com/r1.5554946ab01d97.36996823;cb=%2525%25CACHEBUSTER%2525%2525';
  var ad68010 = 'https://googleads.g.doubleclick.net/pagead/ads?sdkv=h.3.193.1&sdki=3c0d&video_product_type=0&correlator=3883587295669830&client=ca-video-pub-1256482085642647&url=https%3A%2F%2Fdemos.flowplayer.com%2Fads%2Fimage_text.html&adk=3577526078&num_ads=3&channel&output=xml_vast3&sz=982x409.15625&adsafe=high&hl=en&slotname=9152678419&ea=0&image_size=200x200%2C250x250%2C300x250%2C336x280%2C450x50%2C468x60%2C480x70%2C728x90&ad_type=image_text&eid=324123021&u_tz=480&u_his=1&u_java=false&u_h=1080&u_w=1920&u_ah=1040&u_aw=1920&u_cd=24&u_nplug=4&u_nmime=5&dt=1519957339350&unviewed_position_start=1&videoad_start_delay=1&u_so=l&osd=2&frm=0&sdr=1&is_amp=0&t_pyv=allow&min_ad_duration=0&max_ad_duration=110000&ca_type=image&description_url=https%3A%2F%2Fdemos.flowplayer.com%2Fads%2Fimage_text.html&mpt=Flowplayer&mpv=7.2.4&ref=https%3A%2F%2Fflowplayer.com%2Fdemos&ged=ve4_td36_tt33_pd36_la3000_er0.0.0.0_vi0.0.929.1511_vp0_eb16491';
  var ad68010_local = 'http://localhost/2/ads/ad68010.xml';
  var VPAID_LINK01 = 'https://rtr.innovid.com/r1.5554946ab01d97.36996823;cb=%2525%25CACHEBUSTER%2525%2525';

  var ad_jwplayer_nonlinear = 'https://s3.amazonaws.com/demo.jwplayer.com/player-demos/assets/overlay.xml';

  var cfg = {
    // Media
    //poster: 'http://www.oldmtn.com/blog/wp-content/uploads/2018/01/poster.jpg',
    autoplay: false,
    mutedAutoplay: true,

    // advertising: {
    //   //tag: ad67741,
    //   //tag: ad67720,
    //   //tag: ad67966,
    //   //tag: ad68010,
    //   //tag: ad68010_local,
    //   //tag: yun_test_ad01,
    //   //tag: VPAID_LINK01,
    //   tag: Single_Inline_Linear,
    //   //tag: Single_Inline_Linear_local,
    //   //tag: Single_Skippable_Inline,
    //   //tag: Single_Non_linear_Inline,
    //   //tag: Single_Non_linear_Inline2,
    //   //tag: VMAP_Pre_roll_Bumper,
    //   //tag: VMAP_Post_roll_Bumper,
    //   //tag: VMAP_Post_roll,
    //   //tag: VMAP_Pre_Mid_Post,
    //   //tag: VMAP_Pre_3Mid_Post,
    //   //tag: VMAP_5Ads_Every_10_Secs,
    //   //tag: VMAP_Pre_10_20_Post,
    //   //tag: VMAP_Pre_10_20Skip_Post,
    //   //tag: ad_jwplayer_nonlinear,
    //   //tag: 'https://rtr.innovid.com/r1.5554946ab01d97.36996823;cb=%2525%25CACHEBUSTER%2525%2525',
    //   enablePreloading: true,
    //   //autoplayadsmuted: true,
    //   //vpaidmode: 'insecure',
    //   //forceNonLinearFullSlot: false,
    //   //locale: 'fr',
    //   companions: [ { width: 728, height: 90, id: 'idCompanionAd' } ]
    // }
  };

  return cfg;
}

function getMediaInfo()
{
  // content - streaming
  //initAudioContent();
  //initVideoContent();
  //initAudioVideoContent();
  
  // content - pd
  initPDContent();

  /* drm content part */
  //initDRM_PR();
  //initWV_MP4();
  //initPDContent_ClearKey();
  //initCK_WebM();
  //initCK_MP4();

  //var info = initTask62293();
  //initMseCase01();
  //initTestTmp();
  //init1080i();

  //pdContent = 'http://localhost/2/hls/av_muxed/test.m3u8';
  var info = {
    //--Item: standard url
    //url: 'audio_only_case01.mpd',
    //url: 'video_only_case01.mpd',
    //url: 'case01.mpd', // video + audio
    //url: 'case02.mpd', // video contain audio(microsoft demo)
    //url: 'case03.mpd', // video + audio
    //--Item: Live
    //url: 'live01.mpd',
    //--Item: dash part(True mpd path)
    //url: 'http://localhost/2/dash/voweb/test_audio_template.mpd',
    //url: 'http://localhost/2/dash/voweb/test_video180_audio_template.mpd',
    //url: 'http://localhost/2/dash/voweb/test_video180_template.mpd',
    //url: 'http://localhost/2/pd/mp4/trailer/test_segment_template.mpd',
    //url: 'http://localhost/2/dash/bbb_30fps/video.mpd',
    //url: 'http://localhost/2/dash/testpic_2s/video.mpd',
    //url: 'http://localhost/2/pd/fmp4/microsoft_sample/test_segment_template.mpd',
    //--Item: pd
    //url: 'http://localhost/2/dash/features/av_nonmuxed/V300_with_cc1_and_cc3/first20.mp4',
    //url: 'http://localhost/2/pd/mp4/trailer/test.mp4',
    //url: 'http://localhost/2/pd/mp4/jwplayer_demo/test.mp4',
    //url: 'http://localhost/2/pd/fmp4/pure_audio_01.mp4',
    //--Item: hls part
    //url: 'http://localhost/2/hls/av_muxed/test.m3u8',
    //url: 'http://localhost/2/hls/videoonly01/test.m3u8',
    //--Item: HLS CMAF
    //url: 'http://localhost/2/hls/cmaf01/video/180_250000/test.m3u8',
    //url: 'http://localhost/2/dash/test2_main_index/Video1/cmaf.m3u8',
    url: 'http://localhost/1/dash_to_hls/111/cmaf.m3u8',

    // internal test
    audioCodec: audioCodec,
    aContents: aContents,
    videoCodec: videoCodec,
    vContents: vContents,

    drm: {
      type: drmType,
      laUrl: laUrl,
      headers: headers,
      key: key, // only for clearkey
      drmInitDataType: drmInitDataType,
      drmInitData: drmInitData
    },

    //
    thumbnail: 'http://localhost/2/webvtt_thumbnail/multiple01/thumbnails.vtt'
    //thumbnail: 'http://localhost/2/webvtt_thumbnail/single01/thumbnails.vtt'
  };

  return info;
}

///////////////////////////////////////////////////////////////////////////
// assets
function initAudioContent() {
  audioCodec = 'audio/mp4; codecs="mp4a.40.2"';

  //
  aContents = [];
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/all.mp4');
  return;

  aContents = [];
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/init.mp4');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/1.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/2.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/3.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/4.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/5.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/6.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/7.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/8.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/9.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/10.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/11.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/12.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/13.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/14.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/15.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/16.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/17.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/18.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/19.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/20.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/21.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/22.m4s');
  aContents.push('http://localhost/2/dash/features/av_nonmuxed/A48/23.m4s');
}

function initVideoContent() {
  videoCodec = 'video/mp4; codecs="avc1.64001e"';

  // case 1
  //vContents = [];
  //vContents.push('http://10.2.72.19/2/dash/features/av_nonmuxed/V300_with_cc1_and_cc3/first20.mp4');
  //vContents.push('http://localhost/2/dash/features/av_nonmuxed/V300_with_cc1_and_cc3/all.mp4');
  //return;

  vContents = [];
  vContents.push('http://localhost/2/dash/features/av_nonmuxed/V300_with_cc1_and_cc3/init.mp4');
  for (var i = 1; i <= 180; i ++) {
    var content = 'http://localhost/2/dash/features/av_nonmuxed/V300_with_cc1_and_cc3/' + i.toString() + '.m4s';
    vContents.push(content);
  }

  // case 2
  //vContents.push('http://localhost/2/dash_example/mulitmpd/mp4-main-multi-aaclc_high-.mp4');
  //vContents.push('http://localhost/2/dash_example/mulitmpd/mp4-main-multi-aaclc_high-1.m4s');
  //vContents.push('http://localhost/2/dash_example/mulitmpd/mp4-main-multi-aaclc_high-2.m4s');
  //vContents.push('http://localhost/2/dash_example/mulitmpd/mp4-main-multi-aaclc_high-3.m4s');

  //// case 3
  //vContents.push('http://localhost/2/dash/common/bbb_30fps_320x180_200k/bbb_30fps_320x180_200k_0.m4v');
  //vContents.push('http://localhost/2/dash/common/bbb_30fps_320x180_200k/bbb_30fps_320x180_200k_1.m4v');
  //vContents.push('http://localhost/2/dash/common/bbb_30fps_320x180_200k/bbb_30fps_320x180_200k_2.m4v');
  //vContents.push('http://localhost/2/dash/common/bbb_30fps_320x180_200k/bbb_30fps_320x180_200k_3.m4v');
  //vContents.push('http://localhost/2/dash/common/bbb_30fps_320x180_200k/bbb_30fps_320x180_200k_4.m4v');
  //vContents.push('http://localhost/2/dash/common/bbb_30fps_320x180_200k/bbb_30fps_320x180_200k_5.m4v');
  //vContents.push('http://localhost/2/dash/common/bbb_30fps_320x180_200k/bbb_30fps_320x180_200k_6.m4v');
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
  vContents.push('http://localhost/2/pd/fmp4/sample_dashinit.mp4');

  //vContents.push('http://localhost/2/dash_example/hh2/cuc_ieschool_dashinit.mp4');

  return { videoCodec: videoCodec, vContents: vContents };
}

function initPDContent() {
  pdContent = [];

  // test webm vp8
  // videoCodec = 'video/webm; codecs="vorbis,vp8"';
  // vContents.push('http://localhost/1/ark64_frontend/source/resource/movie/test.webm');

  //
  // videoCodec = 'video/webm; codecs="vp9,opus"';
  // pdContent = 'http://localhost/2/pd/webm/cilla_black_bean_sauce_vp9.webm';

  // 
  // videoCodec = 'video/mp4; codecs="mp4a.40.2, avc1.4D401e"';
  pdContent = 'http://localhost/2/pd/mp4/jwplayer_demo/fmp4.mp4';
  // pdDuration = 30;

  //
  //pdContent = 'http://localhost/2/pd/mp4/trailer.mp4';

  // 
  //pdContent = 'http://localhost/2/pd/mp4/mov_bbb.mp4';
  
  //
  //pdContent = 'http://localhost/2/pd/fmp4/sample_dashinit.mp4';
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
  
  drmInitDataType = 'keyids';
  drmInitData = new Uint8Array([
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
  vContents = [];
  
  // case01
  //audioCodec = 'audio/mp4; codecs="mp4a.40.2"';
  //aContents.push('http://localhost/tasklink/65421_chromecast/content_wv_shaka/a-eng-0128k-aac.mp4');

  videoCodec = 'video/mp4; codecs="avc1.42c01e"';
  vContents.push('http://localhost/tasklink/65421_chromecast/content_wv_shaka/v-0144p-0100k-libx264.mp4');
  //pdContent.push('http://localhost/tasklink/65421_chromecast/content_wv_shaka/v-0144p-0100k-libx264.mp4');

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
