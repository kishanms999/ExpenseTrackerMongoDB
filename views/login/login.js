async function login(e){
    try{
        e.preventDefault();
        let loginDetails={
            email:e.target.emailid.value,
            password:e.target.password.value
        }
        console.log(loginDetails)
        const response = await axios.post("http://localhost:3000/user/login",loginDetails)
            if(response.status === 201){
                window.alert("User logged in successfully");
            } else {
                throw new Error('Failed to login')
            }
    } catch(err){
        document.body.innerHTML+= `<div style="color:red;">${err}</div>`;
    }
}