function getFetch(){  //onclick was put directly in html, instead of adding event listener
  let inputVal = document.getElementById("barcode").value 
  
  if(inputVal.length !== 12) {
    alert(`Please ensure that barcode is 12 characters`)
    return
  }

  const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => { //use the JSON data
        console.log(data)
        if (data.status === 1) { //if product is found, call additional stuff
          const item = new ProductInfo(data.product)
          item.showInfo()
          item.listIngredients()
        } else if (data.status === 0) {
          alert(`Product ${inputVal} not found.
          Please try another.`)
        }
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

class ProductInfo {
  constructor(productData) { //passing in data.product (which was called above after doing this here)
    this.name = productData.product_name
    this.ingredients = productData.ingredients
    this.image = productData.image_url
  }

  showInfo() {
    document.getElementById('product-img').src = this.image
    document.getElementById('product-name').innerText = this.name
  }

  listIngredients() {
    let tableRef = document.getElementById('ingredient-table')
    //we delete any existing row from before
    for (let i = 1; i < tableRef.rows.length;) { //no increment here cz when one row is deleted the other replaces it until there are no more rows
      tableRef.deleteRow(i)
    }

    if(!(this.ingredients == null)){

      //for in loop is a specific loop for objects, 'key' is like each in for each, but here it's for objects
      for(let key in this.ingredients) {
        let newRow = tableRef.insertRow(-1) // insertRow is standard in js, -1 to add something to the end of array like 'push', here we're appending a new row
        let newICell = newRow.insertCell(0) //to add a cell, we start at zero
        let newVCell = newRow.insertCell(1) //adding another cell, hence 1
        let newIText = document.createTextNode(this.ingredients[key].text)
        //let veganStatus = this.ingredients[key].vegan
        let veganStatus = !(this.ingredients[key].vegan) ? 'unknown' : this.ingredients[key].vegan
        let newVText = document.createTextNode(veganStatus)
        newICell.appendChild(newIText) //adding new item to the dom
        newVCell.appendChild(newVText)
        if (veganStatus === 'no') {
          //turn item red
          newVCell.classList.add('non-veg-item')
        } else if (veganStatus === 'unknown' || veganStatus === 'maybe'){
          //turn items yellow
          newVCell.classList.add('unkown-maybe-item')
        }
      }

    }
    
  }

}


// 011110038364
// 041196910759


