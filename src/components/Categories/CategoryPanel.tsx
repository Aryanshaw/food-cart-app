import React,{useState} from 'react';
import { View, Text, StyleSheet, Platform,FlatList ,TouchableOpacity,LayoutChangeEvent} from 'react-native';
import { Ionicons, MaterialIcons,FontAwesome5 ,MaterialCommunityIcons} from '@expo/vector-icons'; // Import various icons from Expo vector icons

interface Category {
  name: string;
  icon: string;
}

interface CategoryPanelProps {
    selectedCategoryName: string | null;
    handleCategorySelect: (category: string) => void;
    onLayout?: (event: LayoutChangeEvent) => void;
  }
  

const categories: Category[] = [
  { name: 'Fruits', icon: 'ios-flame' },
  { name: 'Bakery', icon: 'cake' },
  { name: 'Dairy', icon: 'ice-cream' },
  { name: 'Beverages', icon: 'wine-bottle' },
  { name: 'Sweets', icon: 'candy' },
  { name: 'Frozen', icon: 'ios-snow' }
];

const CategoryPanel: React.FC <CategoryPanelProps> = ({selectedCategoryName,handleCategorySelect, onLayout}) => {
    
    const [selectedCategory, setSelectedCategory] = useState(selectedCategoryName);
    
    const handleSelect=(category:string)=>{
      setSelectedCategory(category)
    } 

    const renderItem = ({ item }: { item: Category }) => {
        const IconComponent = getCategoryIconComponent(item.icon);
        return (
            <TouchableOpacity
            style={styles.category}
             onPress={() => {handleCategorySelect(item.name),handleSelect(item.name)}}
             >

          <View style={[Platform.OS !== 'web' ? styles.categoryIcon : styles.categoryweb ,
           ( selectedCategoryName===item.name) && styles.selectedCategory]}>
          {IconComponent && <IconComponent name={item.icon} size={24} color={( selectedCategoryName===item.name) ? 'white' : 'grey'} />}
          </View>
          <Text style={[styles.categoryText, ( selectedCategoryName===item.name) && styles.selectedCategoryText]}>{item.name}</Text>
          </TouchableOpacity>
        );
      };
    

  const getCategoryIconComponent = (iconName: string) => {
    if (Platform.OS === 'web') {
      return null; 
    }

    switch (iconName) {
      case 'candy':
        return MaterialCommunityIcons;
      case 'wine-bottle':
        return FontAwesome5;
      case 'ios-flame':
        return Ionicons;
      case 'cake':
        return MaterialIcons;
      case 'ice-cream':
        return FontAwesome5;
      case 'ios-snow':
        return Ionicons;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.name}
        horizontal={Platform.OS !== 'web'}
        renderItem={renderItem}
        contentContainerStyle={Platform.OS === 'web' && styles.webFlatListContent}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: Platform.OS === 'web' ? 'column' : 'row',
    alignItems: 'center',
    paddingHorizontal:10,
    borderBottomWidth:Platform.OS!=='web' ? 1:0,
    borderColor: Platform.OS === 'web' ? '#c2c2c2':"#c2c2c2",
    paddingRight:-10,
    width:Platform.OS==='web' ?200:"100%",
    borderRightWidth:Platform.OS==='web' ? 1:0,
},
category: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: Platform.OS === 'web' ? 0 : 20,
    marginBottom: Platform.OS === 'web' ? 20 : 0,
},
categoryIcon:{
      borderWidth:2,
      borderColor:'#e6e8eb',
      padding:20,
      borderRadius:10,
      backgroundColor:"#EDEDED"

    },
    categoryText: {
        lineHeight:17,
        fontWeight:"800",
        color:"grey",
        marginBottom: Platform.OS === 'web' ?0:10,
  },
  webFlatListContent: {
    flexDirection: 'column',
    marginTop: Platform.OS === 'web'?30:0
  },
  categoryweb:{
    
  }
  ,selectedCategoryText:{
   color:Platform.OS==='web'?"white":"#5DA9E9",
   backgroundColor:Platform.OS ==='web'?"#5DA9E9":"white",
   borderRadius:5,
   width: Platform.OS==='web' ? 195 : 'auto',
   height: Platform.OS==='web' ? 30 :'auto',
   display:"flex",
   alignItems: 'center',
   justifyContent: 'center'
  },
  selectedCategory:{
    backgroundColor:"#5DA9E9"
  }
});

export default CategoryPanel;
