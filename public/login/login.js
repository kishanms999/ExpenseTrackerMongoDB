async function login(e){
    try{
        e.preventDefault();
        let loginDetails={
            email:e.target.emailid.value,
            password:e.target.password.value
        }
        console.log(loginDetails)
        const response = await axios.post("http://54.82.120.167:3000/user/login",loginDetails)
            if(response.status === 200){
                alert(response.data.message);
                console.log(response.data)
                localStorage.setItem('token',response.data.token)
                window.location.href="../expense/index.html"
            } else {
                throw new Error(response.data.message)
            }
    } catch(err){
        document.body.innerHTML+= `<div style="color:red;">${err}</div>`;
    }
}

function forgotpassword() {
    window.location.href = "../password/password.html"
}
