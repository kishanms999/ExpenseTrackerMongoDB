async function signup(e){
    try{
        e.preventDefault();
        let signupDetails={
            name:e.target.name.value,
            email:e.target.emailid.value,
            password:e.target.password.value
        }
        console.log(signupDetails)
        const response = await axios.post("http://54.85.152.105:3000/user/signup",signupDetails)
            if(response.status === 201){
                window.location.href="../login/login.html"
            } else {
                throw new Error('Failed to login')
            }
    } catch(err){
        document.body.innerHTML+= `<div style="color:red;">${err}</div>`;
    }
}