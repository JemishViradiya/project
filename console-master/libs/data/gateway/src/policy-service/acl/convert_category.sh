#!/bin/bash

# Convert the csv to a simple json structure using https://www.npmjs.com/package/csvtojson
csvtojson category_list.csv > category_list.json

# Now let's create the translation and data models. Note the second 'inputs add' operation is to merge the json arrays into one object
jq '{ data: [ group_by(."category-id")[] | {id: .[0]."category-id", name: .[0]."category", subcategories: [.[] | {id: ."subcategory-id", "name": ."subcategory"}]} ] }' category_list.json > categories.json

# Remove the converted simple json file
rm category_list.json