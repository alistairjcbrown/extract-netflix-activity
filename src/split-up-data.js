const fs = require('fs-extra');
const _ = require('lodash');
const moment = require('moment');
const klaw = require('klaw')

const getCombinedHistory = function() {
  return new Promise(function(resolve, reject) {
    const dataDumpPaths = []
    klaw('./output/raw-data')
    .on('data', function(dataDumpStream) {
      if (dataDumpStream.stats.isDirectory()) return;
      dataDumpPaths.push(dataDumpStream.path)
    })
    .on('end', function() {
      const taggedPaths = _.map(dataDumpPaths, (path) => ({
        id: parseInt(path.match(/page-(\d+)\.json/)[1], 10),
        path
      }));

      const sortedPaths = _.sortBy(taggedPaths, 'id');
      const dataDumpRequests = _.map(sortedPaths, ({ path }) => fs.readJson(path));

      Promise.all(dataDumpRequests)
      .then(function (dataDumps) {
        const viewingHistory = _.reduce(dataDumps, function (combinedDump, dataDump) {
          return combinedDump.concat(dataDump.data.viewedItems);
        }, []);

        resolve(viewingHistory);
      })
      .catch(reject);
    });
  });
};

const splitUpData = async function() {
  const combinedHistory = await getCombinedHistory();
  const buckettedEntries = _.reduce(combinedHistory, function(buckets, entry) {
    const key = moment(entry.date).format('YYYY-MM-DD')
    buckets[key] = buckets[key] || [];
    buckets[key].push(entry);
    return buckets;
  }, {});

  return Promise.all(_.map(buckettedEntries, function (bucket, key) {
    const date = moment(key);
    return fs.outputJson(
      `./output/data/${date.format('YYYY')}/${date.format('MM')}/${date.format('DD')}/viewing-activity.json`,
      bucket,
      { spaces: 4 }
    );
  }));
};

module.exports = splitUpData;
