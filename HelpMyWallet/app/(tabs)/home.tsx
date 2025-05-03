import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { AntDesign, FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Stack } from "expo-router";
import Header from "@/components/Header";
import { PieChart} from "react-native-gifted-charts";
import ExpenseBlock from "@/components/ExpenseBlock";
import IncomeBlock from "@/components/IncomeBlock";
import ExpenseList from '@/data/expenses.json';
import IncomeList from '@/data/income.json';
import TransactionList from '@/data/Spending.json';
import api from "../api";
import TransactionBlock from "@/components/SpendingBlock";

const Home = () => {

  const deleteCategory = (id : string) => {
    api.delete(`api/category/delete/${id}`).then((res) => {
      if (res.status === 204) Alert.alert("Action", "Category deleted successfully.")
        else Alert.alert("Action", "Fail to delete category.")
    }).catch((error) => Alert.alert(error))
  }
  
  useEffect(() => {
    const fetchData = async () => {
      
      // Retrieve data for transactions
      try {
        const response = await api.get("api/transactions/");
        const transactionsData = response.data
        console.log("Transactions:", transactionsData);
      } catch (err) {
        console.error("API fetch error:", err);
      }

      // Retrieve data for categories
      try {
        const response = await api.get("api/categories/");
          const categoriesData = response.data
          console.log("Categories:",categoriesData);
        
      } catch (err) {
        console.error("API fetch error:", err);
      }
    };

    fetchData();
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
          header: () => <Header />,
        }}
      />
      <View style={[styles.container, { paddingTop: 60 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{ gap: 10 }}>
                    <Text style={styles.text}>
                        My 
                        <Text style={{fontWeight: 700}}> Expenses</Text>
                    </Text>
                    <Text style={{ color: Colors.white, fontSize:36, fontWeight: 700}}>$1500.<Text style={{fontSize:22, fontWeight: 400}}>00</Text></Text>
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
                <ExpenseBlock expenseList={ExpenseList}/>
                <IncomeBlock incomeList={IncomeList}/>
                <TransactionBlock transactionList={TransactionList} />
        </ScrollView>
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 10
  },
  text: {
    color: Colors.white,
  },
});
