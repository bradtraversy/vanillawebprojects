const button = document.querySelector('.loc-btn')
navigator.geolocation.getCurrentPosition((loc)=>{
    if(!loc){
        return alert('Connect to the internet')
    }
    const longitude = loc.coords.longitude;
    const latitude = loc.coords.latitude;
     
    const link = `https://www.google.com/maps/@${latitude},${longitude},15z`;
    button.href = link;
})
