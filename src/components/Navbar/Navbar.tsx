import { StyleSheet, Text, View,Platform ,TouchableOpacity} from 'react-native'
import React,{useState,useEffect} from 'react'
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { productInfo ,productLogInfo} from '../../../utils/slices/ProductSlice';


const Navbar = () => {
    const navbarColor = Platform.OS === 'web' ? '#FFE475' : 'white';
    const productSelector = useSelector(productInfo)
    const productLogArray = useSelector(productLogInfo)
    const productQuantity = productSelector?.totalQuantity
    const [isDisabled , setIsDisabled]= useState(true)
   
   
   
    useEffect(()=>{
        if(productQuantity>0){
            setIsDisabled(false)
        }else{
            setIsDisabled(true)
        }
    },[productQuantity])

    const exportData=()=>{
        alert(JSON.stringify(productLogArray, null, 2));
    }


  return (
    <View style={[styles.container, { backgroundColor: navbarColor }]}>
        <Text style={styles.header}>
            E-commerce
        </Text>
        <View style={styles.rightContainer}>


        <TouchableOpacity style={styles.logs} disabled={isDisabled} onPress={exportData}>
            <AntDesign name="filetext1" size={20} color="black" />
            <Text style={styles.logtext}>Share logs</Text>
        </TouchableOpacity>
        <View style={styles.icon}>
        <AntDesign name="shoppingcart" size={24} color="black" />
            {productQuantity>0 && <Text style={styles.quantity}>{productQuantity}</Text>}
        </View>
        </View>
    </View>
  )
}

export default Navbar

const styles = StyleSheet.create({
    container:{
     display: 'flex',
     justifyContent: 'space-between',
     alignItems: 'center',
     flexDirection:'row',
     width:'100%',
     height:70,
     padding:10,
     marginTop:Platform.OS === 'web' ? 0 : 30,
    },
    header:{
        fontSize: 30,
        fontWeight: 'bold',

    },
    logs:{
        borderWidth:1,
        borderColor: 'grey',
        padding:5,
        paddingHorizontal:10,
        borderRadius:10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        cursor: 'pointer'
    },
    logtext:{
        fontSize:15,
        marginLeft:5
    },
    icon:{
        // elevation:1,
        borderRadius:20,
        borderWidth:1,
        borderColor: 'grey',
        cursor: 'pointer',
        //    marginLeft:-9
        paddingHorizontal:16,
        padding:5,
        display:"flex",
        flexDirection:"row",
        alignItems: "center",
        gap:10

    },
    quantity:{
       fontWeight:"bold",
    },
    rightContainer:{
        display: 'flex',
        flexDirection: 'row',
        gap:10
    }
})