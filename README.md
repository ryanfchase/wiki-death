# wiki-death
clone of The Pudding repo + video tutorial, Wiki-Death

## Setup

#### Dependencies

- [node](https://nodejs.org)

#### Install

Clone the repo and run `npm i`

## Generate Output 

##### 1) `npm run download-year-pages`
Download HTMl for the year event pages from wiki that contain a list of all notable deaths (2015-2018)

##### 2) `npm run parse-year-pages`
Extract every person and their meta data from the event pages to create a csv of all notable deaths

##### 3) `npm run get-wiki-pagesviews`
Use wiki pageviews api to get the daily pageviews for en.wikipedia.org so that we can calculate percent of traffic for each person and look into seasonality in the data 

##### 4) `npm run get-people-pageviews`
Use the wiki pageviews api to get the daily pageviews for each person in our full list of notable deaths

##### 5) `npm run join-people`
Join all three sources into a single csv for each person that contains the daily pageviews, percent traffic, and metadata

##### 6) `npm run explore`
Calculates summary statistics for each person's pageviews

##### 7) `npm run filter-population`
Reduces data to people who satisfy some quantitative criteria

##### 8) `npm run add-details`
Gets more details info on each person

##### 9) `npm run prepare-web`
Consolidates and optimizes data for web presentation

>>>>>>> Stashed changes
