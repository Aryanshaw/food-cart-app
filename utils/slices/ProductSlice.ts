import { createSlice } from "@reduxjs/toolkit";

const initialState={
    id: '',
    name: '',
    category:'',
    quantity:'',
    price: '',
    totalQuantity:'',
    totalPrice: '',
    products:null,
    productLogs:{}
}
interface Product {
    category: string;
    id: string;
    name: string;
    price: number;
    quantity: number;
  }
  
  interface TransformedProduct {
    name: string;
    datetime:string;
    statusCode: number;
    request:object;
    response: object;
    componentName: string;
  }
  


  function transformProducts(products: Product[]): TransformedProduct[] {
    return products?.map(product => ({
      name: product.name,
      datetime:new Date().toISOString(),
      statusCode: 200 ,
      request:{
        method:"GET"
      },
      response: {
        message:"success true"
      }, 
      componentName: product.category,
    }));
  }
const productSlices=createSlice({
    name: 'productDetails',
    initialState,
    reducers:{
      getProduct:(state,{payload}) => {
        if(payload!==null){
            // console.log(payload.productInfo[0].category,"payload");
            state.products=payload;
            state.totalQuantity=payload.totalQuantity;
        }
      },
      getProductLogs:(state,{payload}) => {
        const newPayload = payload?.productInfo?.map((item:any)=>{return {...item}});
        const transformedProducts: TransformedProduct[] = transformProducts(newPayload);
        state.productLogs = transformedProducts
      }
    }
})

export const {getProduct,getProductLogs}= productSlices.actions
export const productInfo = (state:any)=> state.productDetails.products
export const productLogInfo = (state:any)=> state.productDetails.productLogs
export default productSlices.reducer