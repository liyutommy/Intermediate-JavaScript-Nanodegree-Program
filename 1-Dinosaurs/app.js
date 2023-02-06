// Create Dino Constructor
function Dino(species, weight, height, diet, where, when, fact) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.where = where;
  this.when = when;
  this.fact = fact;
}


// Read the local JSON file
const readLocalJSON = async () => {
  const response = await fetch('./dino.json');

  try {
    // parse the response into JSON format
    const data = await response.json();
    // store the dinosaur objects
    const dinoObjs = data['Dinos'];
    console.log('dinoObjs', dinoObjs);
    return dinoObjs;
  } catch (error) {
    console.log('error: ', error);
  }
}

// Create Dino Objects
const createDinoObjs = (dinoData) => {
  const dinoArr = [];
  for (const data of dinoData) {
    const dino = new Dino(
      data.species,
      data.weight,
      data.height,
      data.diet,
      data.where,
      data.when,
      data.fact
    );
    dinoArr.push(dino);
  }
  return dinoArr;
}

// Create a human object
const createHumanObj = () => {
  const name = document.getElementById('name').value;
  const feet = parseInt(document.getElementById('feet').value);
  const inches = parseInt(document.getElementById('inches').value);
  const weight = parseInt(document.getElementById('weight').value);
  const diet = document.getElementById('diet').value;
  return { name, feet, inches, weight, diet };
}


// Validate the input form
const validateForm = data => {

  // validate if each input is empty
  for (const key in data) {
    if (data[key].length == 0) {
      alert(`The input ${key} is empty!`);
      return false;
    }
  }

  // name must start with an underscore (_), dollar sign ($), or a letter (a-z and A-Z)
  const regex = '^([a-zA-Z_$][a-zA-Z\d_$]*)$';
  if (!data['name'].match(regex)) {
    alert(`The input name must start with an underscore (_), dollar sign ($), or a letter`);
    return false;
  }

  // check if the range of feet or inches is reasonable
  if (data['feet'] <= 0 || data['feet'] >= 9) {
    alert('The input feet must be greater than zero and less than nine!');
    return false;
  }

  if (data['inches'] < 0 || data['inches'] >= 12) {
    alert('The input inches must be greater than and equal to zero and less than twelve!');
    return false;
  }

  // check if the range of weight is reasonable
  if (data['weight'] <= 0 || data['weight'] > 950) {
    alert('The input inches must be greater than zero and less than nine hundred and fifty!');
    return false;
  }

  return true;

}


// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareWeight = function (humanObj) {
  if (this.weight < humanObj.weight) {
    return `The ${this.species} weighted ${humanObj.weight - this.weight} pounds less than ${humanObj.name}.`
  } else if (this.weight > humanObj.weight) {
    return `The ${this.species} weighted ${this.weight - humanObj.weight} pounds more than ${humanObj.name}.`
  } else {
    return `The weight of ${this.species} is equal to ${humanObj.name}.`
  }
}

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareHeight = function (humanObj) {
  const humanHeight = humanObj.feet * 12 + humanObj.inches;
  if (this.height < humanHeight) {
    return `The ${this.species} is ${humanHeight - this.height} inches shorter than ${humanObj.name}.`
  } else if (this.height > humanHeight) {
    return `The ${this.species} is ${this.height - humanHeight} inches higher than ${humanObj.name}.`
  } else {
    return `The height of ${this.species} is equal to ${humanObj.name}.`
  }
}


// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareDiet = function (humanObj) {
  if (this.diet == humanObj.diet) {
    return `${this.species} and ${humanObj.name} are belong to ${this.diet}.`;
  } else {
    if (this.diet[0] == 'O') {
      return `${this.species} is an ${this.diet}, but ${humanObj.name} is belong to ${humanObj.diet}.`;
    } else {
      return `${this.species} is a ${this.diet}, but ${humanObj.name} is belong to ${humanObj.diet}.`;
    }
  }
}

// Generate Tiles for each Dino in Array
const generateTiles = (dinoArr, humanObj) => {
  const header = document.getElementsByTagName('header')[0];
  const grid = document.getElementById('grid');

  // Remove h3 "how to compare"
  const h3 = document.querySelector('h3');
  h3.classList.add('display-none');
  // Add 'try again' button
  const button = document.createElement('button');
  button.id = 'try-again-button';
  button.innerHTML = 'Try again?';
  button.onclick = function () {
    window.location.reload()
  };
  header.appendChild(button);

  // Generate random tiles contain a different dinosaur
  const randomTiles = randomizeTiles(dinoArr);
  // Modify the pigeon's fact
  randomTiles.forEach(e => {
    if (e.species == 'Pigeon') {
      e.fact = 'All birds are dinosaurs.';
    }
  })


  let dinoArrIndex = 0;
  // Add the grid
  for (let i = 0; i < 9; i++) {
    const div = document.createElement('div');
    div.classList.add('grid-item');
    if (i == 4) {
      div.innerHTML = `<h3>${humanObj.name}</h3>` +
        `<img src=./images/human.png />`;
    } else {
      const dino = randomTiles[dinoArrIndex];
      console.log(dino);
      const imgName = dino.species.toLowerCase();
      const fact = randomizeComparison(dino, humanObj)
      div.innerHTML = `<h3>${dino.species}</h3>
							<img src='./images/${imgName}.png' />
							<p>${fact}</p>`;
      dinoArrIndex++;
    }
    // Add tiles to DOM
    grid.appendChild(div);
  }
}


// Remove form from screen
const toggleDisplay = () => {
  const form = document.getElementsByTagName('form')[0];
  if (form.classList.contains('display-none')) {
    form.classList.remove('display-none');
  } else {
    form.classList.add('display-none');
  }
}

// The dino fact displayed should be chosen at random from at least 6 options
const options = ['weight', 'height', 'diet', 'where', 'when', 'fact'];
const randomizeComparison = (dino, human) => {
  const index = Math.round(Math.random() * (options.length - 1));
  console.log(index);
  switch (options[index]) {
    case 'weight':
      return dino.compareWeight(human);
    case 'height':
      return dino.compareHeight(human);
    case 'diet':
      return dino.compareDiet(human);
    case 'where':
      return `The ${dino.species} lived in ${dino.where}.`;
    case 'when':
      return `The ${dino.species} appeared in the ${dino.when}.`;
    case 'fact':
      return dino.fact;
  }
}

// Modify the order of reading dinosaurs' data
const randomizeTiles = (dinoArr) => {
  const randomNum = [];
  // generate random index array
  while (randomNum.length != 8) {
    const index = Math.round(Math.random() * (dinoArr.length - 1));
    if (!randomNum.includes(index)) {
      randomNum.push(index)
    }
  }
  // resort the dino array
  const randomTiles = randomNum.map(element => dinoArr[element]);
  return randomTiles;
}

// On button click, prepare and display infographic
// Use IIFE to get human data from form
(function getHumanData() {

  const compareMeButton = document.getElementById('btn');

  compareMeButton.onclick = () => {
    // Get the data of form
    const humanObj = createHumanObj();
    console.log(humanObj);
    // Check if the data of form is valid
    const isValid = validateForm(humanObj);

    if (isValid) {
      // Make the form disappear
      toggleDisplay();
      // After reading the JSON file
      readLocalJSON().then(dinoData => {
        // Generate the dinosaurs' objects
        const dinoArr = createDinoObjs(dinoData);
        // Generate the tiles of dinosaurs and append them to the DOM
        generateTiles(dinoArr, humanObj);
      });
    }
  }
})();