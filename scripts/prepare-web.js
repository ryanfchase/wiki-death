const fs = require('fs')
const mkdirp = require('mkdirp')
const d3 = require('d3')
const ALL_DEATHS_PATH = './output/all-deaths-2015-2018.csv'
const FILTERED_PATH = './output/details.csv' /* NOTE: using this instead of filtered.csv */
const OUTPUT_DIR = './web-data/'

function getPageviews(person) {

  // clean ID
  const { pageid } = person
  const id = person.link.replace('/wiki/', '')

  // file I/O
  const fileData = fs.readFileSync(`./output/people-joined/${id}.csv`, 'utf-8')
  const joinedPersonData = d3.csvParse(fileData)

  // extract relevant data
  const output = joinedPersonData.map(({ link, timestamp, views, percent_traffic }) => ({
    link,
    timestamp: timestamp.substring(0, 8),
    views,
    percent_traffic: (percent_traffic * 1).toFixed(8)
  }))

  return output
}

function init() {
  mkdirp(OUTPUT_DIR)
  // grab csv data from ALL and FILTERED
  const dataAll = d3.csvParse(fs.readFileSync(ALL_DEATHS_PATH, 'utf-8'))
  const population = d3.csvParse(fs.readFileSync(FILTERED_PATH, 'utf-8'))

  // for some reason, use our dataALL but only grab ones that exist in the filtered population
  const populationLinks = population.map(d => d.link)
  const dataAllFiltered = dataAll.filter(d => populationLinks.includes(d.link))

  // now create an object that has a combination of both of them...?
  const withCalcs = dataAllFiltered.map(d => ({
    id: d.link.replace('/wiki', ''),
    ...d,
    ...population.find(p => p.link === d.link)
  }))

  // output to our web-data/people.csv
  const peopleOutput = d3.csvFormat(withCalcs)
  fs.writeFileSync(`${OUTPUT_DIR}/people.csv`, peopleOutput)

  // pageviews
  const pageviewData = [].concat(...withCalcs.map(getPageviews))
  // console.log(withCalcs.map(getPageviewData)) -> currently a bunch of empty lists
  const pageviewOutput = d3.csvFormat(pageviewData)
  fs.writeFileSync(`${OUTPUT_DIR}/pageviews.csv`, pageviewOutput)
}

init()
