document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("my_bookings");

  try {
  
    const res_user = await fetch("/api/user", { credentials: "include" });
    if (!res_user.ok) throw new Error("Failed to fetch user");
    const user = await res_user.json();

    let bookings_url 
    if(user.role === "admin"){
      bookings_url="/api/bookings/all"
    }
    else{
      bookings_url = "/api/bookings/my"
    }

    const res_bookings = await fetch(bookings_url, { credentials: "include" });
    if (!res_bookings.ok) {
      throw new Error("Failed to fetch bookings")
    }
    const bookings = await res_bookings.json()

    if (bookings.length === 0) {
      container.innerHTML = "<p>No bookings found</p>"
      return
    }

    const res_hotels = await fetch("/api/hotels", { credentials: "include" })
    if (!res_hotels.ok) throw new Error("Failed to fetch hotels")
    const hotels = await res_hotels.json()

    container.innerHTML = ""

    bookings.forEach(booking => {
      const hotel = hotels.find(h => h._id.toString() === booking.hotel_id.toString()) || {}

      const div = document.createElement("div")
      div.className = "booking_card"

      div.innerHTML = `
        <div style="display:flex; gap:15px; align-items:center; margin-bottom:15px;">
          <img src="${hotel.image || "/images/default.avif"}" alt="${hotel.name || "Hotel"}" style="width:250px;height:300px;object-fit:cover;border-radius:6px;">
          <div>
            <p><b>Hotel:</b> ${hotel.name || "Unknown Hotel"}</p><hr>
            <p><b>User full name:</b> ${booking.name}</p><hr>
            <p><b>Check in:</b> ${new Date(booking.check_in).toLocaleDateString()}</p><hr>
            <p><b>Check out:</b> ${new Date(booking.check_out).toLocaleDateString()}</p><hr>
            <p><b>Total Price:</b> ${booking.total_price}$</p><hr>
            <button class="delete-booking" data-id="${booking._id}"> ${user.role === "admin" ? "Delete" : "Unbook"} </button>
          </div>
        </div>
      `

      container.appendChild(div)
    })

    container.addEventListener("click", async (e) => {
      if (!e.target.classList.contains("delete-booking")) {
        return
      }

      const booking_id = e.target.dataset.id

      let confirm_text
      if(user.role === "admin"){
        confirm_text = "Delete this booking?"
      }
      else{
        confirm_text = "Unbook this reservation?"
      }

      if (!confirm(confirm_text)) {
        return
      }

      const res = await fetch(`/api/bookings/${booking_id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!res.ok) {
        alert("Failed to delete booking")
        return
      }

      e.target.closest(".booking_card").remove()
    })

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p class='error'>Failed to load bookings</p>";
  }
});
