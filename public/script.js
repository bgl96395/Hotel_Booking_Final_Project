//GET ALL HOTELS
async function show(){
  const res = await fetch("/api/hotels")
  const data = await res.json()

  const result = document.getElementById("result")
  result.innerHTML = ""

  data.hotels.forEach(q => {
    const div = document.createElement("div")
    div.innerHTML = `id:<b> ${q._id}</b> ----> <b>${q.name}</b> | price per night: <b>${q.price_per_night}</b> | country: <b>${q.country}</b> <hr>`
    result.appendChild(div)
  })
}

show()
//----------------------------------------------------------------------------
//GET HOTEL BY ID
async function show_by_id(){
  const val = document.getElementById("for_search").value.trim().toLowerCase()
  if(val === ""){
    show();
    return
  }
  const res = await fetch("/api/hotels")
  const data = await res.json()

  const result = document.getElementById("result")
  result.innerHTML = ""

  data.hotels.forEach(q => {
    if(val === q._id){
      const div = document.createElement("div")
      div.innerHTML = `id:<b> ${q._id}</b> ----> <b>${q.name}</b> | price per night: <b>${q.price_per_night}</b> | country: <b>${q.country}</b> <hr>`
      result.appendChild(div)
    }
  })

  if(result.innerHTML===""){
    result.innerHTML = `Hotel not found`
  }
}

document.getElementById("for_search_2").onclick = show_by_id
//----------------------------------------------------------------------------
//FILTER HOTELS AND DISPLAY
async function filtered() {
    

    const by_country = document.getElementById("by_country").value
    const sort = document.getElementById("by_price").value
    const by_fields = document.getElementById("fields").value
    const by_min_price = document.getElementById("minp").value

    const params = new URLSearchParams()

    if (by_country) {
        params.append("country", by_country)
    }

    if (sort) {
        if (sort === "Asceding") {
            params.append("sort", "price")
        } else{
            params.append("sort", "priceDesc")
        }
    }

    if (by_fields) {
        params.append("fields", by_fields)
    }

    if (by_min_price) {
        params.append("minPrice", by_min_price)
    }

    const res = await fetch(`/api/hotels?`+params)
    const data = await res.json()

    const result = document.getElementById("result")
    result.innerHTML = ""

    if (!data.hotels || data.hotels.length === 0) {
        result.innerHTML = "Hotels not found"
        return;
    }

    data.hotels.forEach(hotel => {

        const div = document.createElement("div")
        if(hotel.name !== undefined){
            if (hotel.price_per_night !== undefined){
                if(hotel.country !== undefined){
                    div.innerHTML = `<b>${hotel.name}</b> | price per night: <b>${hotel.price_per_night}</b> | country: <b>${hotel.country}</b> <hr>` 
                }
                else{
                    div.innerHTML = `<b>${hotel.name}</b> | price per night: <b>${hotel.price_per_night}</b> <hr>`
                }
            }
            else{
                if(hotel.country !== undefined){
                    div.innerHTML = `<b>${hotel.name}</b> | country: <b>${hotel.country}</b> <hr>`
                }
            }
        }
        else{
            alert("name is required")
            return
        }
        result.appendChild(div)
    })
}

document.getElementById("form").addEventListener("submit", function(e){
    e.preventDefault()
    filtered()
});

//----------------------------------------------------------------------------
//ADD HOTEL
async function create(){
    const name = document.getElementById("name").value
    const price_per_night = Number(document.getElementById("price").value)
    const country = document.getElementById("country").value

    const res = await fetch("/api/hotels",{
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            name: name,
            price_per_night: price_per_night,
            country: country
        })
    })
    
    const data = await res.json()
    alert("Hotel created successfully")
}

document.getElementById("creating").addEventListener("submit",function(e){
    e.preventDefault()
    create()
})

//----------------------------------------------------------------------------
//UPDATE HOTEL
async function update(){
    const id = document.getElementById("update_id").value
    const name = document.getElementById("update_name").value
    const price_per_night = document.getElementById("update_price").value
    const country = document.getElementById("update_country").value

    const body = {}
    if(name){
        body.name = name
    }
    if(price_per_night){
        body.price_per_night = Number(price_per_night)
    }
    if(country){
        body.country = country
    }

    if(Object.keys(body).length === 0){
        alert("Atleast one field must be updated")
        return
    }


    const res = await fetch(`/api/hotels/${id}`,{
        method: "PUT",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(body)
    })

    const data = await res.json()
    alert("Hotel updated successfully")
}

document.getElementById("updating").addEventListener("submit",function(e){
    e.preventDefault()
    update()
})

//----------------------------------------------------------------------------
//DELETE HOTEL
async function delet(){
    const id = document.getElementById("delete_id").value

    const res = await fetch(`/api/hotels/${id}`,{
        method:"DELETE"
    })
    const data = await res.json()
    alert("HOTEL deleted successfully")
}

document.getElementById("deleting").addEventListener("submit",function(e){
    e.preventDefault()
    delet()
})

