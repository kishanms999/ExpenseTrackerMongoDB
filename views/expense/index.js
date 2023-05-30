function expenseDetails(event){
    event.preventDefault();
    
    let obj={
        expenseamount:event.target.expenseamount.value,
        description:event.target.description.value,
        category:event.target.category.value
    }
    const token=localStorage.getItem('token');
    axios.post("http://localhost:3000/expense/add-expense",obj,{headers:{"Authorization":token}}).then((response)=>{
        showOnScreen(response.data.expense)
        console.log(response)
    })
    .catch((err)=>{
        document.body.innerHTML=document.body.innerHTML+"<h4>Something went wrong</h4>"
        console.log(err)
    })
}

function showPremiumuserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "You are a premium user "
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", () => {
        const token=localStorage.getItem('token');
        const decodeToken = parseJwt(token);
        console.log(decodeToken);
        const ispremiumuser = decodeToken.ispremiumuser;
        if(ispremiumuser){
            showPremiumuserMessage()
            showLeaderboard()
        }
        axios.get('http://localhost:3000/expense/get-expenses',{headers:{"Authorization":token}}).then((response)=>{
            response.data.expenses.forEach(expense=>{
                showOnScreen(expense)
            })
            }).catch((error)=>{
                console.log(error)
            })
            
    })          

    function showOnScreen(expense){
    document.getElementById('expenseamount').value='';
    document.getElementById('description').value='';
    document.getElementById('category').value='';
    // if(localStorage.getItem(user.email)!=null){
    //     removeUserFromScreen(user.email)
    // }
    
    const parentNode=document.getElementById('ListOfExpenses');
    const expenseElemId=`expense-${expense.id}`
    const childHTML=`<li id=${expenseElemId}>${expense.expenseamount}-${expense.description}-${expense.category}
        <button onclick='deleteExpense(event,${expense.id})'>Delete Expense</button>
        <button onclick=editExpense('${expense.expenseamount}','${expense.description}','${expense.category}','${expense.id}')>Edit Expense</button>
        </li>`
    parentNode.innerHTML=parentNode.innerHTML+childHTML    
}

function deleteExpense(e,expenseId){
    const token=localStorage.getItem('token');
    axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`,{headers:{"Authorization":token}})
        .then((response)=> {
            // console.log(response);
            removeFromScreen(expenseId)
        })
        .catch((err)=>{
            console.log(err)
        })
}

function showLeaderboard(){
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = 'Show Leaderboard'
    inputElement.onclick = async() => {
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: {"Authorization" : token} })
        console.log(userLeaderBoardArray)

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += '<h1> Leader Board </<h1>'
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.total_cost} </li>`
        })
    }
    document.getElementById("message").appendChild(inputElement);

}

function removeFromScreen(expenseId){
    const parentNode=document.getElementById('ListOfExpenses');
    const expenseElemId=`expense-${expenseId}`
    const childNodeToBeDeleted=document.getElementById(expenseElemId);
    // console.log(childNodeToBeDeleted);
    if(childNodeToBeDeleted){
        parentNode.removeChild(childNodeToBeDeleted);
    }
}

function editExpense(amount,description,category,expenseId){
    document.getElementById('xpamnt').value=amount;
    document.getElementById('descr').value=description;
    document.getElementById('cat').value=category;
    deleteExpense(expenseId)
}

document.getElementById('rzp-button1').onclick=async function (e){
    const token=localStorage.getItem('token');
    const response=await axios.get('http://localhost:3000/purchase/premiummembership',{headers:{"Authorization":token}});
    console.log(response);
    var options =
    {
     "key": response.data.key_id, 
     "order_id": response.data.order.id,
     "handler": async function (response) {
        const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })

         console.log(res)
         alert('You are a Premium User Now')
         document.getElementById('rzp-button1').style.visibility = "hidden"
         document.getElementById('message').innerHTML = "You are a premium user "
         localStorage.setItem('token', res.data.token)
         showLeaderboard()
        }
    }
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response){
        console.log(response)
        alert('Something went wrong')
    });
}