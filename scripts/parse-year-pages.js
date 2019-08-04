const fs = require('fs')
const mkdirp = require('mkdirp')
const cheerio = require('cheerio')
const d3 = require('d3')

const INPUT_DIR = './output/year-pages'
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// Return Object
// { name, link, year_of_birth, description }

// Helper function to determine if cheerio object contains an embedded date
function tagIsDate(str) {
  const split = str.split(' ')
  const isMonth = months.includes(split[0])
  const isDate = !(isNaN(split[1]))
  return isMonth && isDate
}

// Extract person-death objects from Cheerio selector, needs current year
function getDeathObject({sel, year}) {
  const isPerson = !sel.find('ul').length

  if (isPerson) {

    // Use link tags to determine if name is embedded
    const aTags = sel.find('a')
    const isEmbedded = tagIsDate(aTags.first().attr('title'))
    const nameIndex = isEmbedded ? 1 : 0

    // name
    const nameSel = aTags.eq(nameIndex)
    const nameText = nameSel.attr('title')

    // remove descriptive info from name
    let name = null
    if(nameText.indexOf(',') === -1){
      name = nameText
    }
    else {
      name = nameText.substring(0, nameText.indexOf(','))
    }

    // link
    const link = nameSel.attr('href')

    // year_of_birth
    const yearOfBirth = aTags.eq(-1).text()

    // date_of_death
    let dateOfDeath = null
    if (isEmbedded) {
      dateOfDeath  = aTags.eq(0).text()
    }
    else {
      dateOfDeath = sel
        .parent()
        .parent()
        .find('a')
        .first()
        .text()
    }

    // year_of_death
    const yearOfDeath = year

    // description is located after the comma adjacent to the name and before the open paren with subjects DoD
    const text = sel.text()
    const commaIndex = text.indexOf(',')
    const parenIndex = text.lastIndexOf('(')
    const description = text.substring(commaIndex + 1, parenIndex).trim()

    // Return object will have {name, link, YoB, YoD, DoD, description}
    retObject = {
      'name': name,
      'link': link,
      'year_of_birth': yearOfBirth,
      'year_of_death': yearOfDeath,
      'date_of_death': dateOfDeath,
      'description': description
    }

    return retObject
  }
  // discard anything that doesn't contain a person
  else { return null }
}

// main driver for parsing HTML
function extractPeople(file) {

  // open HTML for a specific year (e.g. 2015)
  const html = fs.readFileSync(`${INPUT_DIR}/${file}`, 'utf-8')
  const $ = cheerio.load(html)

  // prepare to store people in this list
  const year = file.replace('.html', '')
  const deathObjectList = []

  // for each month
  for (i=0; i < months.length; i++) {

    // get month node
    const monthNode = $(`#${months[i]}_2`).parent()

    // grab container of death list (only first one is relevant)
    const listNode = monthNode.nextAll('ul').eq(0)

    // push death objects to our deathObjectList
    listNode.find('li').each((i, el) => {
      const deathObject = getDeathObject({ sel: $(el), year })
      if (deathObject) deathObjectList.push(deathObject)
    })
  }
  return deathObjectList // console.log(deathObjectList) // it works!
}

function init() {
  // 1. obtain all HTML files
  const files = fs.readdirSync(INPUT_DIR).filter(d => d.includes('.html'))

  // 2. run extractPeople() on each year, use d3 to format csv
  const deathObjectList = [].concat(...files.map(extractPeople))
  const csvFile = d3.csvFormat(deathObjectList)

  // 3. Write CSV data to file
  mkdirp('./output')
  fs.writeFileSync('./output/all-deaths-2015-2018.csv', csvFile)
}

init()
