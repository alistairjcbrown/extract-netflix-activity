const fs = require('fs-extra');
const axios = require('axios');
const _ = require('lodash');

const buildId = process.env.BUILD_ID;
const secureNetflixId = process.env.SECURE_NETFLIX_ID;
const netflixId = process.env.NETFLIX_ID;

const EndOfPaginationError = new Error('End of pagination');

const convertToJson = function(response) {
  return JSON.stringify(_.omit(response, [
      'request',
      ['headers', 'set-cookie'],
      ['config', 'headers']
    ]), null, 4)
    .replace(new RegExp(secureNetflixId, 'g'), '<removed>')
    .replace(new RegExp(netflixId, 'g'), '<removed>');
};

const getPage = function(pageNumber = 0, callback) {
  console.log(`Requesting page ${pageNumber}...`);

  return axios.get(`https://www.netflix.com/api/shakti/${buildId}/viewingactivity`, {
    params: {
      pg: pageNumber
    },
    headers:{
      Cookie: `SecureNetflixId=${secureNetflixId}; NetflixId=${netflixId};`
    }
  })
  .then(function(response) {
    console.log(` - Done, retrieved ${response.data.viewedItems.length} entries`);
    if (response.data.viewedItems.length === 0) {
      throw EndOfPaginationError;
    }
    return fs.outputFile(`./output/raw-data/page-${pageNumber}.json`, convertToJson(response));
  })
};

function getAllPages() {
  return new Promise(async function(resolve, reject){
    let i = 0;
    while(i < 100) {
      try {
        await getPage(i);
      } catch (e) {
        if (e === EndOfPaginationError) {
          resolve();
        } else {
          console.log('Error', e);
          reject();
        }
        break;
      }
      i++;
    }
  });
}

module.exports = getAllPages;
