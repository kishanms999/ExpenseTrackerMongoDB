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

window.addEventListener("DOMContentLoaded", () => {
        const token=localStorage.getItem('token');
        console.log(token)
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