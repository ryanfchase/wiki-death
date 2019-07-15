const fs = require('fs')
const mkdirp = require('mkdirp')
const d3 = require('d3')
const outputDir = './output/people-joined'

const wikiPageviewData = d3.csvParse(
  fs.readFileSync('./output/wiki-pageviews.csv', 'utf-8')
)

function calculateTraffic({views, timestamp}) {
  const match = wikiPageviewData.find(d => d.timestamp)

  if (match) return views / match.views
  console.error('no match', ppd)
  return null
}

function joinData(person) {
  const id = person.link.replace('/wiki/', '')


  let personPageviewData = null

  try {
    personPageviewData = d3.csvParse(
      fs.readFileSync(`./output/people-pageviews/${id}.csv`, 'utf-8')
    )
  }
  catch(err) {
    console.error(err)
    return
  }

  // TODO uncomment to view object
  //console.log(personPageviewData)

  // person
  // name, link, YoB, YoD, DoD, description

  // ppd
  // project, article, granularity, timestamp, access, agent, views

  const merged = personPageviewData.map(ppd => ({
    ...ppd,
    ...person,
    percent_traffic: calculateTraffic(ppd)
  }))

  // Remove unecessary fields
  merged.forEach(d => {
    delete d.article
    delete d.granularity
    delete d.access
    delete d.agent
  })

  const output = d3.csvFormat(merged)
  fs.writeFileSync(`${outputDir}/${id}.csv`, output)
}

function init() {
  mkdirp(outputDir)

  const data = d3.csvParse(
    fs.readFileSync('./output/all-deaths-2015-2018.csv', 'utf-8')
  )

  // TODO
  // we can make this data.map(joinData) if we don't want logging
  data.forEach((d, i) => {
    console.log(`${i} of ${data.length}`)
    joinData(d);
  })
}


init()
