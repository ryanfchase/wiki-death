const fs = require('fs')
const mkdirp = require('mkdirp')
const d3 = require('d3')
const outputDir = './output'

function clean(data) {
  return data.map(d => ({
    ...d,
    median_views: +d.median_views,
    median_percent_traffic: +d.median_percent_traffic,
    max_views: +d.max_views,
    max_percent_traffic: +d.max_percent_traffic,
    max_change_views: +d.max_change_views,
    max_change_percent_traffic: +d.max_change_percent_traffic
  }))
}

function init() {
  mkdirp(outputDir)

  const data = clean(
    d3.csvParse(
      fs.readFileSync(
        './output/explore.csv', 'utf-8'
      )))

  //pageviews --  results (rows)
  //100k      --  256
  //250k      --  135
  //
  //percent
  //traffic   --  results (rows)
  //0.05%     --  227
  //0.1%      --  130 --> y

  const UPPER_MPT = 0.001
  const filtered = data.filter(d => d.max_percent_traffic >= UPPER_MPT)
  filtered.sort((a, b) => d3.ascending(a.max_views, b.max_views))

  const output = d3.csvFormat(filtered)
  fs.writeFileSync('./output/filtered.csv', output)
}

init()
