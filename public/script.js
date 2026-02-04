async function check_role(){
    const res = await fetch("/api/user", { credentials: 'include' });
    const data = await res.json();
    console.log("User role from server:", data.role); // для отладки

    if(data.role !== "admin"){
        document.getElementsByClassName("api")[0].style.display = "none";
    }
}
check_role();


async function show(){
  const res = await fetch("/api/hotels")
  const data = await res.json()

  console.log(data)

  const result = document.getElementById("result")
  result.innerHTML = ""

  data.forEach(q => {
    const div = document.createElement("div")
    div.innerHTML = `<h3>${q.name}:</h3> <br> id: <b>${q._id}</b><br>address: <b>${q.address}</b> <br> city: <b>${q.city}</b> <br> country: <b>${q.country}</b> <br> stars: <b>${q.stars}</b> </br>  price per night: <b>${q.price_per_night}</b> <br> description: <b>${q.description}</b>  <hr>`
    result.appendChild(div)
  })
}

show()

async function show_by_id_or_name(){
  const val = document.getElementById("for_search").value
  if(val === ""){
    show()
    return
  }
  const res = await fetch("/api/hotels")
  const data = await res.json()

  const result = document.getElementById("result")
  result.innerHTML = ""

  data.forEach(q => {
    if(val === q._id || val === q.name){
      const div = document.createElement("div")
      div.innerHTML = `<h3>${q.name}</h3> <br> id: <b>${q._id}</b><br>address: <b>${q.address}</b> <br> city: <b>${q.city}</b> <br> country: <b>${q.country} <br> stars: <b>${q.stars}</b> </br>  price per night: <b>${q.price_per_night}</b> <br> description: <b>${q.description}</b>  <hr>`
      result.appendChild(div)
    }
  })

  if(result.innerHTML===""){
    result.innerHTML = `Hotel not found`
  }
}

document.getElementById("for_search_2").onclick = show_by_id_or_name

async function create() { 
    const name = document.getElementById("name").value 
    const address = document.getElementById("address").value 
    const city = document.getElementById("city").value 
    const country = document.getElementById("country").value 
    const stars = Number(document.getElementById("stars").value) 
    const price_per_night = Number(document.getElementById("price").value) 
    const description = document.getElementById("description").value

    const res = await fetch("/api/hotels", {
        method: "POST", 
        credentials: 'include',
        headers: { 
            "Content-Type": "application/json" 
        }, 
        body: JSON.stringify({ name, address, city, country, stars, price_per_night, description }) 
    })

    if (res.ok) { 
        alert("Hotel created successfully") 
    } 
    else { 
        alert("Failed to create hotel") 
    } 
}

document.getElementById("creating").addEventListener("submit", function (e) { 
    e.preventDefault() 
    create() 
})

async function update() { 
    const id = document.getElementById("update_id").value 
    const name = document.getElementById("update_name").value 
    const address = document.getElementById("update_address").value 
    const city = document.getElementById("update_city").value 
    const country = document.getElementById("update_country").value 
    const stars = document.getElementById("update_stars").value 
    const price_per_night = document.getElementById("update_price").value 
    const description = document.getElementById("update_description").value

    const body = {} 
    if (name) {
        body.name = name 
    } 
    if (address) { 
        body.address = address 
    } 
    if (city) {
         body.city = city 
    } 
    if (country) { 
        body.country = country 
    } if (stars) { 
        body.stars = Number(stars) 
    } if (price_per_night) { 
        body.price_per_night = Number(price_per_night) 
    } if (description) { 
        body.description = description 
    }

    if (Object.keys(body).length === 0) { 
        alert("At least one field must be updated") 
        return 
    }

    const res = await fetch(`/api/hotels/${id}`
        , { 
        method: "PUT", 
        credentials: 'include',
        headers: { 
            "Content-Type": "application/json" 
        }, body: JSON.stringify(body) })

    if (res.ok) { 
        alert("Hotel updated successfully") 
    } 
    else { 
        alert("Failed to update hotel") 
    } 
}

document.getElementById("updating").addEventListener("submit",function(e){
    e.preventDefault()
    update()
})

async function delet(){
    const id = document.getElementById("delete_id").value

    const res = await fetch(`/api/hotels/${id}`,{
        method:"DELETE",
        credentials: 'include'
    })
    const data = await res.json()
    alert("HOTEL deleted successfully")
}

document.getElementById("deleting").addEventListener("submit",function(e){
    e.preventDefault()
    delet()
})