import { 
  StyleSheet, 
  Text, 
  View,
  Image,
  ScrollView,
  FlatList,
  SafeAreaView,
  TouchableOpacity, 
  Platform,
  LayoutChangeEvent
} from 'react-native'
import React,{useState,useRef,useEffect} from 'react'
import Navbar from '../../components/Navbar/Navbar'
import CategoryPanel from '../../components/Categories/CategoryPanel'
import { productsData } from '../../../data/ProductData'
import { useSelector, useDispatch } from 'react-redux';
import { getProduct ,getProductLogs} from '../../../utils/slices/ProductSlice'

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  weight: string;
  imageUrl: string;
}


const groupProductsByCategory = (): { [key: string]: Product[] } => {
  const groupedProducts: { [key: string]: Product[] } = {};

  productsData.forEach(product => {
    if (!groupedProducts[product.category]) {
      groupedProducts[product.category] = [];
    }
    groupedProducts[product.category].push(product);
  });

  return groupedProducts;
};


const ProductsPage = () => {
  const groupedProducts = groupProductsByCategory();
  const [productQuantities, setProductQuantities] = useState<{ [key: string]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const lastSelectedCategoryRef = useRef<string | null>(null);
  const [counter ,setCounter] = useState<number>(0)
  const dispatch = useDispatch()
  const categoryHeightRef = useRef<number | null>(null);




  const calculateTotalQuantity = () => {
    let totalQuantity = 0;
  
    Object.values(productQuantities).forEach(quantity => {
      totalQuantity += quantity;
    });
  
    return totalQuantity;
  };
  
  const totalQuantity = calculateTotalQuantity();

  const onCategoryLayout = (event: LayoutChangeEvent) => {
    categoryHeightRef.current = event.nativeEvent.layout.height;
  };

  const handleScroll = (event:any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const categoryHeight = categoryHeightRef.current ? categoryHeightRef.current +15: 120;
 
    
    const selectedCategoryIndex = Math.floor(offsetY / categoryHeight);
    const categoriesArray = Object.keys(groupedProducts);
    const newSelectedCategory = categoriesArray[selectedCategoryIndex];

  if (newSelectedCategory !== lastSelectedCategoryRef.current) {
    lastSelectedCategoryRef.current = newSelectedCategory;

    setSelectedCategory(newSelectedCategory);
  }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);

    const categoryIndex = Object.keys(groupedProducts).indexOf(category);
    if (categoryIndex >= 0 && scrollViewRef.current) {
      const scrollPosition = categoryIndex * 120; 
      scrollViewRef.current.scrollTo({ y: scrollPosition, animated: true });
    }
  };


  const increaseQuantity = (productId: string) => {
    setProductQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));
    setCounter(counter+1)
  };
  
  const decreaseQuantity = (productId: string) => {
    if (productQuantities[productId] > 0) {
      setProductQuantities(prevQuantities => ({
        ...prevQuantities,
        [productId]: (prevQuantities[productId] || 0) - 1,
      }));
    }
    setCounter(counter-1)

  };
  
  const getProductDetails = (productId: string , quantity:number)=>{
    const product = productsData.find(item => item.id === productId);

    if (product) {
      const productDetails = {
        id: product.id,
        name: product.name,
        category: product.category,
        quantity: quantity,
        price : product?.price * quantity,
      };
      return productDetails ;
    } else {
      console.log('Product not found for the given productId:', productId);
    }
  };
  
  const addItemToCart=()=>{
    const cartItems = [];
  
    for (const [key, value] of Object.entries(productQuantities)) {
    if (value > 0) {
      const productDetails = getProductDetails(key, value);
      cartItems.push(productDetails);
      }
      }

  return cartItems;
  }
 
  useEffect(() =>{
      let demo= addItemToCart()
      dispatch(getProduct({
        productInfo: demo,
        totalQuantity: totalQuantity
      
      }))
      dispatch(getProductLogs({
        productInfo: demo,
        totalQuantity: totalQuantity
      
      }))
  },[counter])


  const renderItem = ({ item }: { item: Product }) => {
    const productId = item.id;

    return (
      <View style={styles.productsItemContainer}>
      <View style={styles.productsItem}>
        <Image source={{ uri: item.imageUrl }} style={styles.img} />
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.weight}>{item.weight}</Text>
      </View>
      <View style={styles.addIconContainer} >
         {productQuantities[productId]>0 && (
         <>
         <TouchableOpacity style={styles.button} onPress={() => decreaseQuantity(productId)}>
          <Text style={styles.buttonText}> - </Text>
        </TouchableOpacity>
        <Text>{productQuantities[productId] || 0}</Text>
         </>
        )}
        <TouchableOpacity style={styles.button} 
        onPress={() => {
          increaseQuantity(productId),
          getProductDetails(productId,productQuantities[productId])
          }}>
          <Text style={styles.buttonText}> + </Text>
        </TouchableOpacity>
      </View>  
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container} onLayout={onCategoryLayout}>
      <Navbar/>
      {Platform.OS !=='web' ? (
       <>
        <CategoryPanel 
        selectedCategoryName={selectedCategory} 
        handleCategorySelect={handleCategorySelect}
        onLayout={(event) => onCategoryLayout(event)}
        />
        <ScrollView 
        onScroll={handleScroll}
        contentContainerStyle={styles.content} 
        ref={scrollViewRef}
      scrollEventThrottle={16}
      >
        {Object.entries(groupedProducts).map(([category, products]) => (
          <View key={category}>
            <Text style={styles.categoryHeader}>{category}</Text>
            <FlatList
              data={products}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
              />
          </View>
        ))}
        </ScrollView>
        </>
      ):(
        <View style={styles.webContainer} >
        <CategoryPanel 
        selectedCategoryName={selectedCategory} 
        handleCategorySelect={handleCategorySelect}
        onLayout={(event) => onCategoryLayout(event)}
        />
        <ScrollView 
        onScroll={handleScroll}
        contentContainerStyle={styles.content} 
        ref={scrollViewRef}
      scrollEventThrottle={16}
      >
        {Object.entries(groupedProducts).map(([category, products]) => (
          <View key={category}>
            <Text style={styles.categoryHeader}>{category}</Text>
            <FlatList
              data={products}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
              />
          </View>
        ))}
      </ScrollView>
        </View>
        )
      }
    </SafeAreaView>
  )
}

export default ProductsPage

const styles = StyleSheet.create({
  container: {
    height:"auto",
    overflow: Platform.OS !=='web' ?"scroll" :'hidden',
  },
  content: {
    padding: 10,  
    width:"100%",   
  },
  categoryHeader: {
    fontSize: Platform.OS !=='web' ? 18:28,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  productsItem:{
    padding:Platform.OS !=='web' ?10:21,
    
  },
  img:{
    width:Platform.OS !=='web' ? 110:220,
    height:Platform.OS !=='web' ?100:170,
    borderRadius:10,
    resizeMode:'cover',
  },
  price:{
    fontSize:20,
    fontWeight:'bold',
  },
  name:{
    fontSize:16,
    letterSpacing:1,
    fontWeight:'500'
  },
  weight:{
    fontSize:12,
    color:'grey'
  },
  productsItemContainer:{
    position:"relative",
    paddingRight:20
  },
  addIconContainer:{
    position:"absolute",
    bottom:"24%",
    right:30,
    backgroundColor:"white",
    width:30 ,
    height:30,
    borderRadius:5,
    justifyContent:"center",
    alignItems:"center",
    display:"flex",
    flexDirection:"row",
    gap:10,
  },
  button: {
    backgroundColor: '#40D589',
    borderRadius: 5,
    alignItems:"center",
    display:"flex",
    justifyContent:"center",
    width:30,
    height:30,
  },
  buttonText:{
    color : "white",
    fontSize:21,
    textAlign:"center",
  },
  webContainer:{
    display:"flex",
    flexDirection: "row",
    gap:20
  }
})