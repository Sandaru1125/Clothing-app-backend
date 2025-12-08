import Order from "../models/order.js";
import Products from "../models/product.js";

export async function createOrder(req,res){


if(req.user==null){


res.status(401).json({

message:"unauthorized"


})
return;

}


const body=req.body;
const orderData={
    orderID:"",
    email:req.user.email,
    name:body.name,
    address:body.address,
    phoneNumber:body.phoneNumber,
    billItems:[],
    total:0



};

const lastBill=Order.find().sort({

    date:-1
}).limit(1).then( async(lastBills)=>{

    if(lastBills.length==0){

        orderData.orderID="ORD001";
        }else{
        
        
        const lastBill=lastBills[0];
        
        const lastOrderId=lastBill.orderID;
        
        const lastOrderNumber=lastOrderId.replace("ORD","");
        const lastOrderNumberInt=parseInt(lastOrderNumber);
        const newOrderNumber=lastOrderNumberInt+1;
        const newOrderNumberStr=newOrderNumber.toString().padStart(4,"0");
        orderData.orderID="ORD"+newOrderNumberStr;
        }
        

      for(let i=0;i<body.billItems.length;i++){

        const product=await Products.findOne({productId:body.billItems[i].productId});

if(product==null){

res.status(404).json({
message:"product with product id"+body.billItems[i].productId+"not found"
})
return;
}

 orderData.billItems[i]={

    productId:product.productId,
    productName:product.name,
    Image:product.images[0],
    quantity:body.billItems[i].quantity,
    price:product.price



 }

 orderData.total+=product.price*body.billItems[i].quantity



        
      }

        const order=new Order(orderData);
        order.save().then(()=>{
        
        res.json({
        
        message:"order saved successfully"
        
        
        })
        }).catch((err)=>{
        
        res.status(500).json({
        
        
        message:"order not created"
        
        
        })

});






})
}

export function getOrders(req,res){
    if(req.user==null){

        res.status(401).json({

            message:"unauthorized"


            })
            return;
            }

            if(req.user.role=="admin"){    
               Order.find().then((orders)=>{
                   res.json(orders)
               }).catch((err)=>{

                   res.status(500).json({
                       message:"orders not found"
                   })
            }
            
                
                )
            }else{
                Order.find({
                    email:req.user.email
                }).then((orders)=>{
                    res.json(orders)
                }).catch((err)=>{

                    res.status(500).json({
                        message:"orders not found"
                    })
                })
            }
    }

export async function updateOrder(req,res){

        try{

            if(req.user==null){
                res.status(401).json({
                    message:"unauthorized"
                })
                return;
            }


               if(req.user.role!="admin"){
                res.status(403).json({
                    message:"you are not unauthorized to update order"
                })
                return;
            }
          

            const orderID=req.params.orderID;
            const order=await Order.findOneAndUpdate({orderID:orderID},req.body);
            if(order==null){
                res.status(404).json({
                    message:"order not found"
                })
                return;
            }
            res.json({
                message:"order updated successfully"
            })
        }catch(err){
            res.status(500).json({
                message:"order not updated"
            })
        }

           

    }

export default {
    createOrder,
    getOrders,
    updateOrder,
};

