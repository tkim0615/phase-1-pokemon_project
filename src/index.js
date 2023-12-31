//DOM elements/ variables
const url = 'http://localhost:5000/pokemons'
const favoriteBtn = document.querySelector('#favorite-poke')
const newPokeForm = document.querySelector('#poke-form')
const pokeDetailName = document.getElementById("name")
const pokeDetailImage = document.getElementById("poke-image")
const pokeDetailType = document.getElementById("type")
const pokedexDetailNumber = document.getElementById("pokedex")
const pokeCollection = document.getElementById("collection_amount")
const deleteBtn = document.getElementById('delete-poke')
deleteBtn.remove()
const pokeInfoDiv = document.getElementById('pokemon-info')
const pokeDetailDiv = document.getElementById('pokemmon-details')
const pokeList = document.getElementById("pokemon-list")
const pokeAmountString = document.getElementById('amount')
pokeAmountString.remove()
let currentPoke
let pokeDataCopy

fetch(url)  //get fetch
    .then(response => response.json())
    .then(pokeData => {
        pokeDataCopy = pokeData
        pokeData.map(eachPoke => {
        addPokeToMenu(eachPoke)
    })
        let randomArrayIndex = Math.floor((Math.random() * pokeData.length)) // stretch: render random poke
        pokeDetails(pokeData[randomArrayIndex])  
})

//submit event handler #1
newPokeForm.addEventListener('submit', handleNewPokeFormSubmit);
//#2 event handler focusin/focusout
newPokeForm.addEventListener('focusin', (e) =>{
    e.target.style.backgroundColor = 'yellow'
})
newPokeForm.addEventListener('focusout', (e) =>{
    e.target.style.backgroundColor = ''   
})
//#3 event handler click
favoriteBtn.addEventListener('click', (e)=>{
    currentPoke.favorite = !currentPoke.favorite
    let updatedFav = {
        favorite: currentPoke.favorite
    }
    // patch fetch
    fetch(`http://localhost:5000/pokemons/${currentPoke.id}`,{  
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFav)
    })
        .then(resp => resp.json())
        .then(updatedFavorite => {
            favoriteBtn.textContent = updatedFavorite.favorite? "Favorited! Click to unfavorite": "Unfavorited! Click to favorite"
        })    
 })
//render functions
function pokeDetails(pokemon){
    currentPoke = pokemon
    pokeDetailName.textContent = pokemon.name
    pokeDetailImage.src = pokemon.image 
    pokeDetailType.textContent = pokemon.type
    pokedexDetailNumber.textContent = "Pokedex: " + pokemon.pokedex
    pokeCollection.textContent = "Amount in collection: " + parseInt(pokemon.collection_amount)
    favoriteBtn.textContent = pokemon.favorite ? "Favorited! Click to unfavorite": "Unfavorited! Click to favorite"
}
function addPokeToMenu(pokemon){
    const pokeImage = document.createElement("img")
    const pokeDelBtn = document.createElement('button')
    const divElement = document.createElement('div')
    const pokeName = document.createElement('h5')
    pokeName.id = "poke-menu-name"
    pokeDelBtn.textContent = 'Lost in battle'
    pokeName.textContent = pokemon.name
    pokeImage.src = pokemon.image 
    divElement.append(pokeDelBtn)
    divElement.append(pokeImage, pokeName)
    pokeList.appendChild(divElement)
    // event handler click
    pokeImage.addEventListener("click", () => {
        pokeDetails(pokemon)
    })
    
    pokeDelBtn.addEventListener('click', (e) =>{
        fetch(`http://localhost:5000/pokemons/${pokemon.id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if(response.ok){
                    pokeDataCopy = pokeDataCopy.filter(p=>{
                        return pokemon.id !== p.id
                    })
                    updateImageNav(pokeDataCopy)
                    pokeDetails(pokeDataCopy[0])
                }
                else{
                    alert('Delete unsuccesful, try again')
                }})
})}

function updateImageNav(pokeDataCopy){
   pokeList.innerHTML = ' '
   pokeDataCopy.forEach(pokemon => {
    addPokeToMenu(pokemon)
   })}

function createIncrementBtn(){
    const pokeIncrementBtn = document.createElement('button')
    const divBtnElement = document.createElement('div')
    pokeIncrementBtn.textContent = ' Add to collection '
    divBtnElement.appendChild(pokeIncrementBtn)
    pokeDetailDiv.appendChild(divBtnElement)
    // #4 event handler
    pokeIncrementBtn.addEventListener('click', () =>{
        incrementCollection()
    })}

function incrementCollection(){
    let currentCollectionAmt = Number(pokeCollection.textContent.slice(-2))
    currentCollectionAmt += 1
    currentPoke.collection_amount = currentCollectionAmt
    let updatedCollectionData = {
            collection_amount : currentCollectionAmt
    }
    fetch(`http://localhost:5000/pokemons/${currentPoke.id}`,    //2nd patch fetch
    {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCollectionData)
    }
    )
        .then(resp => resp.json())
        .then(updatedCollection => pokeCollection.textContent = `Amount in collection: ${updatedCollection.collection_amount}` 
        )}

function handleNewPokeFormSubmit(e) {
    e.preventDefault();
  
    let newPokeData = {
      name: e.target[0].value,
      type: e.target[1].value,
      image: e.target[2].value,
      collection_amount: Number(e.target[3].value),
      favorite: Boolean(e.target[4].value),
      pokedex: e.target[5].value,
    };
  
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPokeData),
    })
      .then(response => response.json())
      .then(newPokeData => {
        addPokeToMenu(newPokeData);
        pokeDetails(newPokeData);
      });
    newPokeForm.reset();
  };
  
  createIncrementBtn()
