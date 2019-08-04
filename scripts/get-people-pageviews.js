const fs = require('fs')
const mkdirp = require('mkdirp')
const pageviews = require('pageviews')
const d3 = require('d3')
const outputDir = './output/people-pageviews'

// pageviews - https://www.npmjs.com/package/pageviews
// getPerArticlePageviews() :: Given a Mediawiki article and a date range, 
//  returns a daily timeseries of its pageview counts. You can also filter by access 
//  method and/or agent type.

// Perform query via pageviews library
function queryPersonAndWriteToCSV(person) {
  return new Promise((resolve, reject) => {
    const id = person.link.replace('/wiki', '');
    pageviews
      .getPerArticlePageviews({
        project: 'en.wikipedia',
        agent: 'user',
        granularity: 'daily',
        start: '20150701',
        end: '20180626',
        article: person.name
      })
      .then(result => {
        const output = d3.csvFormat(result.items)
        fs.writeFileSync(`${outputDir}/${id}.csv`, output)
        resolve()
      })
      .catch(reject)
  })
}

async function init() {
  // 1. create output directy
  mkdirp(outputDir)

  // 2. extract all people from csv
  const allDeaths = d3.csvParse(
    fs.readFileSync('./output/all-deaths-2015-2018.csv', 'utf-8')
  )

  // helper info for printing
  const size = allDeaths.length
  let i = 1

  // use for( item of all ) when doing async query
  for (const person of allDeaths) {
    await queryPersonAndWriteToCSV(person).then(() => { // returns promise, thenable + catchable
      console.log(`${i} of ${size}`)
      i += 1
    }) .catch(console.error)
  }
}

init()
