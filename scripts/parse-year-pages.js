const fs = require('fs')
const mkdirp = require('mkdirp')
const cheerio = require('cheerio')
const d3 = require('d3')

const inputDir = './output/year-pages'
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
// {
//  name: a,
//  link: b,
//  year_of_birth: c,
//  description: d
// }

function tagIsDate(str) {
  const split = str.split(' ')
  const isMonth = months.includes(split[0])
  const isDate = !(isNaN(split[1]))
  return isMonth && isDate
}

function getDeathObject({sel, year}) {
  const isPerson = !sel.find('ul').length

  if (isPerson) {

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

    // description
    const text = sel.text()
    const commaIndex = text.indexOf(',')
    const parenIndex = text.lastIndexOf('(')
    const description = text.substring(commaIndex + 1, parenIndex).trim()

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
  else {
    return null
  }
}

function extractPeople(file) {
  // html was downloaded in download-year-pages.js
  const html = fs.readFileSync(`${inputDir}/${file}`, 'utf-8')
  const $ = cheerio.load(html)

  const year = file.replace('.html', '')

  const deathObjectList = []

  // for each month
  for (i=0; i < months.length; i++) {
    // get month node
    const month_node = $(`#${months[i]}_2`).parent()

    // grab container of death list (only first one is relevant)
    const list = month_node.nextAll('ul').eq(0)

    // push death objects to our deathObjectList
    list.find('li').each((i, el) => {
      const deathObject = getDeathObject({ sel: $(el), year })
      if (deathObject) deathObjectList.push(deathObject)
    })
  }

  // console.log(deathObjectList) // it works!
  return deathObjectList
}

function init() {
  const files = fs.readdirSync(inputDir).filter(d => d.includes('.html'))
  const deathObjectList = [].concat(...files.map(extractPeople))
  // console.log(deathObjectList)
  const csvFile = d3.csvFormat(deathObjectList)

  mkdirp('./output')
  fs.writeFileSync('./output/all-deaths-2015-2018.csv', csvFile)
}

init()

// this didn't work because the cheerio object still returned metadata at the end *shrugs*
  /*const cheerioObject = ul
    .find('li')
    .map((i, el) => getDeathObject({sel: $(el), year}))
  const deathObjectList = Object.values(cheerioObject)
  */
