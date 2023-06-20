async function resetpass(e){
    try{
        e.preventDefault();
        let resetDetails={
            email:e.target.emailid.value
        }
        console.log(resetDetails)
        const response = await axios.post("http://54.82.120.167:3000/password/forgotpassword ",resetDetails)
            document.body.innerHTML+= `<div>${response.data.message}</div>`;
    } catch(err){
        document.body.innerHTML+= `<div style="color:red;">${err}</div>`;
    }
}

