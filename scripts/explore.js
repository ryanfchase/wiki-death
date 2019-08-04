const fs = require('fs')
const mkdirp = require('mkdirp')
const d3 = require('d3')
const outputDir = './output'

function calculate(data) {
  // data: {name, link, year_of_birth, year_of_death, date_of_death, description}

  // obtain link, and underscore separated ID from link
  const link = data.link
  const id = link.replace('/wiki/', '')

  // attempt to retrieve consolodated data from people-joined directory
  let rawData = null
  try { rawData = d3.csvParse(fs.readFileSync(`./output/people-joined/${id}.csv`, 'utf-8')) }
  catch { return null }

  // return an object of {name, link, YoB, YoD, DoD, desc, views, percent traffic}
  const dailyData = rawData.map(d => ({
    ...d,
    views: +d.views,
    percent_traffic: +d.percent_traffic
  }))

  const medianViews = d3.median(dailyData, d => d.views)
  const medianPercentTraffic = d3.median(dailyData, d => d.percent_traffic)
  const maxViews = d3.max(dailyData, d => d.views)
  const maxPercentTraffic = d3.max(dailyData, d => d.percent_traffic)
  const maxChangeViews = max_views / median_views
  const maxChangePercentTraffic = maxPercentTraffic / medianPercentTraffic

  return { 
    'id': id,
    'median_views': medianViews, 
    'median_percent_traffic': medianPercentTraffic,
    'max_views': maxViews,
    'max_percent_traffic': maxPercentTraffic,
    'max_change_views': maxChangeViews,
    'max_change_percent_traffic': maxChangePercentTraffic,
    'link': link, 
  }

}

function init() {
  mkdirp(outputDir)

  // var csv_data
  const all_deaths_data = d3.csvParse(
    // We've decided the most useful base information for each person comes from this csv
    fs.readFileSync('./output/all-deaths-2015-2018.csv', 'utf-8')
  )

  // prepare to visit each person from our all_deaths_data
  const len = all_deaths_data.length

  // loop through each person in all-deaths-2015-2018.csv
  const explorationData = all_deaths_data.map((data, i) => {
    // use calculate to explore the object
    console.log("exploring object " + (i + 1) + " of " + len)
    return calculate(data)
  })

  const withAverages = explorationData.filter((obj) => obj)
  const output = d3.csvFormat(withAverages)
  fs.writeFileSync('./output/explore.csv', output)
}

init()
