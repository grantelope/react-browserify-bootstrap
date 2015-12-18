import axios from 'axios';
import demoURL from './url'; // used for nock

axios.interceptors.request.use(function (config) {
  let conf = Object.assign({}, config);
  conf.url = demoURL + conf.url.replace(demoURL, '');
  return conf;
}, function (err) {
  return Promise.reject(err);
});