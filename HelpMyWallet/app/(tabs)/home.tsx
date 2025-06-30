import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AntDesign, Feather, FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import  Colors from "@/constants/Colors";
import { router, Stack } from "expo-router";
import { PieChart} from "react-native-gifted-charts";
import ExpenseBlock from "@/components/ExpenseBlock";
import IncomeBlock from "@/components/IncomeBlock";
import ExpenseList from '@/data/expenses.json';
import IncomeList from '@/data/income.json';
import TransactionList from '@/data/Spending.json';
import api from "../api";
import TransactionBlock from "@/components/TransactionBlock";
import HomeHeader from "@/components/HomeHeader";
import Loading from "@/components/Loading";
import { darkTheme, lightTheme } from "@/constants/Theme";

const Home = () => {

  const [expenseCategories, setExpenseCategories] = React.useState([]);
  const [incomeCategories, setIncomeCategories] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const appTheme = useColorScheme();
  const Theme = appTheme === 'dark' ? darkTheme : lightTheme;


  const deleteCategory = (id : string) => {
    api.delete(`api/category/delete/${id}`).then((res) => {
      if (res.status === 204) Alert.alert("Action", "Category deleted successfully.")
        else Alert.alert("Action", "Fail to delete category.")
    }).catch((error) => Alert.alert(error))
  }
  
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      
      // Retrieve data for transactions
      try {
        const response = await api.get("api/transactions/");
        const transactionsData = response.data
        console.log("Transactions:", transactionsData);
        setTransactions(transactionsData)
      } catch (err) {
        console.error("API fetch error:", err);
      }

      // Retrieve data for categories
      try {
        const responseCategories = await api.get("api/categories/");
        const categories = responseCategories.data;
        // console.log("Categories:", categories);

        // Get IDs for "Expenses" and "Income"
        const expensesCategory = categories.find((cat: any) => cat.name === "Expenses");
        const incomeCategory = categories.find((cat: any) => cat.name === "Income");

        if (expensesCategory && incomeCategory) {
        const expensesId = expensesCategory.id;
        const incomeId = incomeCategory.id;

        // Filter subcategories by parent
        const expenseSubs = categories.filter((cat: any) => cat.parent === expensesId);
        const incomeSubs = categories.filter((cat: any) => cat.parent === incomeId);

        setExpenseCategories(expenseSubs);
        setIncomeCategories(incomeSubs);
      }


      } catch (err) {
        const errorData = await err.response.data;
        console.log("API fetch error:", errorData);
      }

      // Retrieve merchant data
      try {
        const responseMerchant = await api.get("api/merchants/");
        const merchants = responseMerchant.data;
        console.log("Merchants:", merchants);
        
      
      } catch (err) {
        const errorData = await err.response.data;
        console.log("API fetch error:", errorData);
      }

    };

    fetchData();
    setLoading(false);
  }, []);

    const pieData = [
        {
          value: 47,
          color: '#009FFF',
          gradientCenterColor: '#006DFF',
          focused: true,
        },
        {value: 40, color: '#93FCF8', gradientCenterColor: '#3BE9DE'},
        {value: 16, color: '#BDB2FA', gradientCenterColor: '#8F80F3'},
        {value: 3, color: '#FFA5BA', gradientCenterColor: '#FF7F97'},
      ];
  return (
    <>
   
      <Stack.Screen
        options={{
          header: () => <HomeHeader />,
        }}
      />
       {loading ? (
        <Loading />
      ) : (
      <View style={[styles.container, { paddingTop: 70, backgroundColor: Theme.backgroundColor }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{ gap: 10 }}>
                    <Text style={{color: Theme.textColor}}>
                        My 
                        <Text style={{fontWeight: 700, color: Theme.altTextColor }}> Overview</Text>
                    </Text>
                    <Text style={{ color:Theme.textColor, fontSize:36, fontWeight: 700}}>$1500.<Text style={{fontSize:22, fontWeight: 400}}>00</Text></Text>
                </View>
                
                <View style={{ paddingVertical: 20, alignItems: "center" }}>
                    <PieChart
                        data={pieData}
                        donut
                        showGradient
                        sectionAutoFocus
                        radius={70}
                        innerRadius={55}
                        semiCircle
                        focusOnPress
                        innerCircleColor={'#232B5D'}
                        centerLabelComponent={() => {
                            return (
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Text
                                style={{fontSize: 22, color: 'white', fontWeight: 'bold'}}>
                                47%
                                </Text>
                            </View>
                            );
                        }}
                    />
                </View>
            </View>
                <ExpenseBlock expenseList={expenseCategories}/>
                <IncomeBlock incomeList={incomeCategories}/>
                <TransactionBlock transactionList={transactions} />
                
        </ScrollView>
        <TouchableOpacity style={styles.floatingAddBtn} onPress={()=>router.push('/addCategory')}>
            <Feather name="plus" size={22} color={appTheme === 'dark' ? '#ccc' : Colors.lightTintColor} />
        </TouchableOpacity>
      </View>)}
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10
  },
  floatingAddBtn: {
    backgroundColor : Colors.tintColor, 
    position:'absolute' , 
    justifyContent:'center',
    alignItems:'center',
    right: 12,
    bottom: 45,
    height: 40,
    width: 40,
    borderRadius: 50
  }
});
