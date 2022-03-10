var statesByCountry = {
  Select: ['Select'],
  Australia: [
    'New South Wales',
    'Northern Territory',
    'Queensland',
    'South Australia',
    'Tasmania',
    'Victoria',
    'Western Australia',
  ],
  Brazil: ['Bahia', 'Santa Catarina', 'Acre', 'Sergipe'],
  Columbia: ['Antioquia', 'Magdalena', 'Santander', 'Tolima', 'Cundinamarca'],
  India: ['Gujarat', 'Tamil Nadu', 'Punjab', 'Kerala', 'Karnataka', 'Maharashtra'],
  UnitedStatesOfAmerica: ['Alabama', 'California', 'Florida', 'Georgia', 'Montana', 'Ohio', 'Texas', 'Washington'],
}

var close = document.getElementsByClassName('closebtn')
var i

for (i = 0; i < close.length; i++) {
  close[i].onclick = function () {
    var div = this.parentElement
    div.style.opacity = '0'
    setTimeout(function () {
      div.style.display = 'none'
    }, 600)
  }
}

function changestate(value) {
  if (value.length == 0) document.getElementById('States').innerHTML = '<option></option>'
  else {
    var stateOptions = ''
    for (stateId in statesByCountry[value]) {
      stateOptions += '<option>' + statesByCountry[value][stateId] + '</option>'
    }
    document.getElementById('States').innerHTML = stateOptions
  }
}

function openPage(pageName, elmnt, color) {
  // Hide all elements with class="tabcontent" by default */
  var i, tabcontent, tablinks
  tabcontent = document.getElementsByClassName('tabcontent')
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none'
  }

  // Remove the background color of all tablinks/buttons
  tablinks = document.getElementsByClassName('tablink')
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = ''
  }

  // Show the specific tab content
  document.getElementById(pageName).style.display = 'block'

  // Add the specific color to the button used to open the tab content
  elmnt.style.backgroundColor = color
}

setTimeout(() => {
  // Get the element with id="defaultOpen" and click on it
  document.getElementById('defaultOpen').click()
}, 1)
