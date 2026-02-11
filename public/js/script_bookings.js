document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search)
  const hotelId = params.get("id")
  const container = document.getElementById("hotel_details")

  if (!hotelId) {
    container.innerHTML = `<p class="error">Hotel not found</p>`
    return
  }

  try {
    const res = await fetch(`/api/hotels/${hotelId}`, { credentials: "include" })
    if (!res.ok) {
      container.innerHTML = `<p class="error">Hotel not found (status ${res.status})</p>`
      return
    }

    const hotel = await res.json()

    if (!hotel || hotel.error) {
      container.innerHTML = `<p class="error">${hotel?.error || "Hotel not found"}</p>`
      return
    }

    const image = hotel.image || "/images/default.avif"

    container.innerHTML = `
      <div class="hotel-card">
        <img src="${image}" alt="${hotel.name}">
        <div class="hotel-info">
          <h2>${hotel.name}</h2>
          <p><b>Address:</b> ${hotel.address}</p>
          <p><b>City:</b> ${hotel.city}</p>
          <p><b>Country:</b> ${hotel.country}</p>
          <p><b>Stars:</b> ${hotel.stars}</p>
          <p class="price">${hotel.price_per_night}$ / night</p>
          <p><b>Description:</b> ${hotel.description}</p>
          <div class="for_book">
            Your name:
            <input id="name" type="text" class="b">
            Check in date:
            <input id="check_in" type="date" class="b">
            Check out date:
            <input id="check_out" type="date" class="b">
          </div>
          <button id="book_${hotelId}" class="b_btn">Book</button>
        </div>
      </div>
    `

    document.getElementById(`book_${hotelId}`).addEventListener("click",async () =>{
      try{
        const name_of_booker = document.getElementById("name").value
        const check_in = document.getElementById("check_in").value
        const check_out = document.getElementById("check_out").value

        if(!name_of_booker || !check_in || !check_out){
          alert("Fill all fileds!")
          return
        }

        const res = await fetch("/api/bookings",{
          method: "POST",
          credentials: "include",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({
            hotel_id: hotelId,
            name: name_of_booker,
            check_in: check_in,
            check_out: check_out
          })
        })

        const data = await res.json()

        if(!res.ok){
          alert("Failed to Book: ",data.error)
          return
        }
        else{
          alert("Booking Successful")
        }

      }catch(err){
        console.error(err)
        alert("Failed to Book")
      }
    })

  } catch (err) {
    console.error(err)
    container.innerHTML = `<p class="error">Failed to load hotel</p>`
  }
})

