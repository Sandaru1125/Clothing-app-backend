import Products from "../models/product.js";


export async function createProduct(req,res){

if(req.user==null){

res.status(403).json({

message:"you nedd to login first"
//sssss


})
 
return;


}


if(req.user.role !="admin"){


res.status(403).json({

message:"you are not authorized tocreate products"


})
return;

}

const product=new Products(req.body);


try{

    await product.save()

}catch(err){

    console.error("Error saving product:", err);
    res.status(500).json({

message:"product not saved",
error: err.message,

    })

}

}


export function getProduct(req,res){
Products.find().then(

(product)=>{

    res.json(product)
}

).catch(
(err)=>{

res.status(500).json({

message:"product not found"


})


}

)





}


export async function getProductById(req,res){

const productId=req.params.id
const product=await Products.findOne({productId:productId})
if(product==null){

res.status(404).json({
message:"product not found"
})
return
}
res.json({

product:product
})

  
}

export function deleteProduct(req,res){

if(req.user==null){
res.status(403).json({

message:"you need to login first"



})

return;


}

if(req.user.role != "admin"){
    res.status(403).json({
        message : "You are not authorized to delete a product"
    })
    return;
}
Products.findOneAndDelete({
    productId : req.params.productId
}).then(
    ()=>{
        res.json({
            message : "Product deleted successfully"
        })
    }
).catch(
    (err)=>{
        res.status(500).json({
            message : "Product not deleted"
        })
    }
)


}





export function updateProducts(req,res){
    if(req.user == null){
        res.status(403).json({
            message : "You need to login first"
        })
        return;
    }

    if(req.user.role != "admin"){
        res.status(403).json({
            message : "You are not authorized to update a product"
        })
        return;
    }

    Products.findOneAndUpdate({
        productId : req.params.productId
    },req.body).then(
        ()=>{
            res.json({
                message : "Product updated successfully"
            })
        }
    ).catch(
        (err)=>{
            res.status(500).json({
                message : "Product not updated"
            })
        }
    )
}

export default {
    createProduct,
    getProduct,
    getProductById,
    deleteProduct,
    updateProducts,
};