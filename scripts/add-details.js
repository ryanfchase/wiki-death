const fs = require('fs')
const mkdirp = require('mkdirp')
const d3 = require('d3')
const request = require('request')
const OUTPUT_DIR = './output'

const BASE_PATH = 'https://en.wikipedia.org/api/rest_v1/page/summary'

function getDetails(person) {
  return new Promise((resolve, reject) => {
    const id = person.link.replace('/wiki/', '')
    const url = `${BASE_PATH}/${id}`
    console.log(url)
    request(url, (err, resp, body) => {
      if (err) reject(err)
      else if (resp.statusCode === 200) {
        const data = JSON.parse(body)

        const { pageid, thumbnail, description, extract_html } = data
        const { canonical, display } = data.titles

        const thumbnail_source = thumbnail ? thumbnail.source : null
        const thumbnail_width = thumbnail ? thumbnail.width : null
        const thumbnail_height = thumbnail ? thumbnail.height : null

        resolve({
          ...person,
          pageid,
          description,
          canonical,
          display,
          thumbnail_source,
          thumbnail_width,
          thumbnail_height,
          extract_html: extract_html.replace(/\n/g, '')
        })
      }
      else reject(resp.statusCode)
    })
  })
}

async function init() {
  // create output directory
  mkdirp(OUTPUT_DIR)

  // parse our filtered people csv
  const peopleData = d3.csvParse(
    fs.readFileSync(
      `${OUTPUT_DIR}/filtered.csv`, 'utf-8'
    )
  )

  // prepare to add details for just this subset of people
  //  via async query
  let index = 0;
  const withDetails = []

  for (person of peopleData) {
    console.log(`${index + 1} of ${peopleData.length}`)
    await getDetails(person).then(response => {
      withDetails.push(response)
    })
      .catch(err => {
        console.log(err)
        withDetails.push(person)
      })
    index += 1
  }

  const output = d3.csvFormat(withDetails)
  fs.writeFileSync(`${OUTPUT_DIR}/details.csv`, output)
}

init()

