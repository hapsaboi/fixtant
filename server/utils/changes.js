// Change Model
const Changes = require('../models/Changes');

async function addProduct(product) {
    let store = product.store;
    var productChange = {
        data:{
            "type": "Add",
            "message" : "A product with name: <b>"+product.product_name+"</b> was added",
            "item_id": product._id, 
        },
        store  
    }
    
    const change = await Changes.find({store});
    if(change.length>0){
        change[0].data.push(productChange.data);
        await Changes.findOneAndUpdate({store},change[0]);
    }else{    
        const newChange = new Changes(productChange);
        await newChange.save(); 
    }

}
function variationDiff(a,b) {
    var messages = [];
    var type = "";

    //deleted variations
    let res = a.filter(el => {
        return !b.find(element => {
           return element._id == el._id;
        });
    });

    
    res.forEach(function (one,index) {
        var temp2 = true;
        for(var element in one) {
            if(temp2 == true){
                var message = "variation : <b>" +one.variation+"</b> has been removed <br />";
                messages.push(message); 
                type+="variaiton,";
                temp2 = false;
            }
        }
    });

    b.forEach(function (oneB,index) {
        //if item already exist
        if(oneB._id){
            for(var element in oneB) {
                if(a[index] && b[index]){
                    if(a[index][element]!=b[index][element]){
                        var message = element + " of variation <b>" +a[index].variation+"</b> has been changed from <b>" + a[index][element] + "</b> to <b>" + b[index][element]+"</b><br />";
                        messages.push(message); 
                        type+=element+",";
                    
                    } 
                }
            }
        }else{
            if(b[index]){
                var message = "A new variation : <b>" +b[index].variation+"</b> has been added <br />";
                messages.push(message); 
                type+="variation,";
            }
        }
    });

    return ({messages,type});
}

function diff(a,b) {
    var messages = [];
    var varmesseage = [];
    var type = "Update - ";
    for(var element in b) {
        if(element=="variations"){
            varmesseage = variationDiff(a[element],b[element]);
        }

       if(typeof(a[element])=="string"){
           if(a[element]!==b[element]){
               var message = element +" has been changed from <b>" + a[element] + "</b> to <b>" + b[element]+"</b><br />";
               messages.push(message); 
               type+=element+",";
           }
       }
   };
   
   messages = messages.concat(varmesseage.messages);
   if(messages!=""){
        if(a.product_name){
           messages = "<b>"+a.product_name + "</b>: <br />"+messages
        } else{
            messages = "<b>"+a.store + "</b>: <br />"+messages
        }
       
    }
    if(varmesseage.type){
        type=type+varmesseage.type; 
    }

   type=type.slice(0,-1);
   return({messages,type}); 
}

async function updateProductChange(product,updatedProduct) {
    let difference  = diff(product,updatedProduct);

    let store = updatedProduct.store;
    if(difference.messages!=""){
        var productChange = {
            data:{
                "type": difference.type,
                "message" : difference.messages.toString().replace(/,/g, ""),
                "item_id": updatedProduct._id   
            },
            store  
        }

        const change = await Changes.find({store});
        if(change.length>0){
            change[0].data.push(productChange.data);
            await Changes.findOneAndUpdate({store},change[0]);
        }else{    
            const newChange = new Changes(productChange);
            await newChange.save(); 
        }
        //Changes Made Successfully
        return("CMS");
    }else{
         //No Changes Made
        return("NCM");
    }
   
}



// for users

async function addUser(user) {
    let store = user.store;
    var userChange = {
        data:{
            "type": "Add",
            "message" : "Store with name Owner: <b>"+user.name+"</b> was added",
            "item_id": user._id, 
        },
        store  
    }
    
    const change = await Changes.find({store});
    if(change.length>0){
        change[0].data.push(userChange.data);
        await Changes.findOneAndUpdate({store},change[0]);
    }else{    
        const newChange = new Changes(userChange);
        await newChange.save(); 
    }

    return userChange;

}

async function editProfileChange(userData,updatedData){
    let difference = diff(userData,updatedData);
    
    let store = updatedData._id;
    if(difference.messages!=""){
        var userChange = {
            data:{
                "type": difference.type,
                "message" : difference.messages.toString().replace(/,/g, ""),
                "item_id": updatedData._id   
            },
            store  
        }

        const change = await Changes.find({store});
        if(change.length>0){
            change[0].data.push(userChange.data);
            await Changes.findOneAndUpdate({store},change[0]);
        }else{    
            const newChange = new Changes(userChange);
            await newChange.save(); 
        }
        //Changes Made Successfully
        return("CMS");
    }else{
         //No Changes Made
        return("NCM");
    }
}

// To export above functions:
module.exports = {addProduct,updateProductChange,addUser,editProfileChange};