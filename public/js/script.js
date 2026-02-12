document.addEventListener("DOMContentLoaded", () => {
    check_role()
})

async function check_role(){
    const res = await fetch("/api/user", { credentials: 'include' })
    const user = await res.json()
    if (user.role !== "admin") {
        document.getElementsByClassName("api")[0].style.display = "none"
    }
}

let current_page = 1
let limit = 3

let current_filters = {
    country: "",
    stars: "",
    priceSort: ""
}

async function show(filters = {}) {
    const param = new URLSearchParams({
        page: current_page,
        limit: limit,
        country: filters.country || "",
        stars:filters.stars || "",
        priceSort: filters.priceSort || ""
    })
    const res = await fetch(`/api/hotels?${param}`)
    let data = await res.json()

    const result = document.getElementById("result")
    result.innerHTML = ""

    data.forEach(q => {
        const image = q.image || "/images/default.avif"
        const div = document.createElement("div")
        div.classList.add("hotel_card")
        div.innerHTML = `
            <div class="for_img">
                <img src="${image}" alt="${q.name}" style="cursor:pointer" onclick="window.location.href='/hotel_page?id=${q._id}'">
            </div>
            <div class="for_data">
                <h3>${q.name}:</h3> 
                <br> id: <b>${q._id}</b>
                <br> address: <b>${q.address}</b>
                <br> city: <b>${q.city}</b>
                <br> country: <b>${q.country}</b>
                <br> stars: <b>${q.stars}</b>
                <br> price per night: <b>${q.price_per_night}$</b>
                <br> description: <b>${q.description}</b>
            </div>
        `
        result.appendChild(div)
        const hr = document.createElement("hr")
        result.appendChild(hr)
          
    })

    document.getElementById("prev").disabled = current_page === 1
    document.getElementById("next").disabled = data.length < limit
}

document.getElementById("apply_filters").addEventListener("click", () => {
    current_filters.country = document.getElementById("country_filter").value
    current_filters.stars = document.getElementById("stars_filter").value
    current_filters.priceSort = document.getElementById("price_sort").value
    current_page = 1 
    show(current_filters)
})

document.getElementById("prev").addEventListener("click",()=>{
    if(current_page > 1){
        current_page--
        show(current_filters)
    }
})

document.getElementById("next").addEventListener("click",()=>{
    current_page++
    show(current_filters)
})

show(current_filters)

async function show_by_id_or_name(){
    const val = document.getElementById("for_search").value
    
    if(val === ""){
        show(current_filters) 
        return
    }

    const param = new URLSearchParams({
        page: 1,      
        limit: 1000, 
        country: "",  
        stars: "",
        priceSort: ""
    })

    const res = await fetch(`/api/hotels?${param}`)
    const data = await res.json()

    const result = document.getElementById("result")
    result.innerHTML = ""


    data.forEach(q => {
        if(q._id.includes(val) || q.name.toLowerCase().includes(val.toLowerCase())){
            found = true
            const image = q.image || "/images/default.avif"
            const div = document.createElement("div")
            div.classList.add("hotel_card")
            div.innerHTML = `
                <div class="for_img"><img src="${image}" onclick="window.location.href='/hotel_page?id=${q._id}'"></div>
                <div class="for_data">
                    <h3>${q.name}:</h3>
                    <br> id: <b>${q._id}</b>
                    <br> address: <b>${q.address}</b>
                    <br> city: <b>${q.city}</b>
                    <br> country: <b>${q.country}</b>
                    <br> stars: <b>${q.stars}</b>
                    <br> price per night: <b>${q.price_per_night}$</b>
                    <br> description: <b>${q.description}</b>
                </div>
            `
            result.appendChild(div)
            const hr = document.createElement("hr")
            result.appendChild(hr)
        }
    })

    if(!result){
        result.innerHTML = `Hotel not found`
    }

    document.getElementById("prev").disabled = true
    document.getElementById("next").disabled = true
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