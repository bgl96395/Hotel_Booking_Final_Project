document.getElementById('bt').onclick = function(){
    let a = document.getElementById('fname').value.trim() 
    let b = document.getElementById('lname').value.trim()
    let c = document.getElementById('email').value.trim()

    if(a==''){
        document.getElementById('demo1').innerHTML = 'Must be Filled!'
        document.getElementById('demo1').style.color = 'red'
    }
    else {
        document.getElementById('demo1').innerHTML = 'Good'
        document.getElementById('demo1').style.color = 'green'
    }

    if(b==''){
        document.getElementById('demo2').innerHTML = 'Must be Filled!'
        document.getElementById('demo2').style.color = 'red'
    }
    else {
        document.getElementById('demo2').innerHTML = 'Good'
        document.getElementById('demo2').style.color = 'green'
    }

    if(c==''){
        document.getElementById('demo3').innerHTML = 'Must be Filled!'
        document.getElementById('demo3').style.color = 'red'
    }
    else {
        document.getElementById('demo3').innerHTML = 'Good'
        document.getElementById('demo3').style.color = 'green'
    }

    document.getElementById('demo4').innerHTML = 'Not Required'
    document.getElementById('demo4').style.color = 'gray'
}
