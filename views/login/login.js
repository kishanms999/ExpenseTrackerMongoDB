async function login(e){
    try{
        e.preventDefault();
        let loginDetails={
            email:e.target.emailid.value,
            password:e.target.password.value
        }
        console.log(loginDetails)
        const response = await axios.post("http://localhost:3000/user/login",loginDetails)
            if(response.status === 200){
                alert(response.data.message);
                window.location.href="../expense.html"
            } else {
                throw new Error(response.data.message)
            }
    } catch(err){
        document.body.innerHTML+= `<div style="color:red;">${err}</div>`;
    }
}