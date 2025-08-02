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

import TransactionBlock from "@/components/TransactionBlock";
import HomeHeader from "@/components/HomeHeader";
import Loading from "@/components/Loading";
import { darkTheme, lightTheme } from "@/constants/Theme";
import api from "../api";
import Button from "@/components/Button";

const Home = () => {

  const [expenseCategories, setExpenseCategories] = React.useState([]);
  const [incomeCategories, setIncomeCategories] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [dataMonth, setDataMonth] = useState<string>(String(new Date().getMonth() + 1));
  const [dataYear, setDataYear] = useState<string>(String(new Date().getFullYear()));
  const [dataMonthName, setDataMonthName] = useState<string>(new Date().toLocaleString('default', { month: 'long' }));
  const [dataDate, setDataDate] = useState<Date>(new Date());
  const appTheme = useColorScheme();
  const Theme = appTheme === 'dark' ? darkTheme : lightTheme;

  const fetchData = async () => {
    console.log("Fetching data for month:", dataMonth, "and year:", dataYear);
      
      // Retrieve data for transactions
      try {
        const response = await api.get(`api/transactions/?year=${dataYear}&month=${dataMonth}`);
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
        console.log("Expense Subcategories:", expenseSubs);
        console.log("Income Subcategories:", incomeSubs);
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
        // console.log("Merchants:", merchants);
      } catch (err) {
        const errorData = await err.response.data;
        console.log("API fetch error:", errorData);
      }

      try {
        const responseCalendar = await api.get(`api/calendar/?year=${dataYear}&month=${dataMonth}`);
        const calendarData = responseCalendar.data;
        console.log("Calendar Data:", calendarData);
      
      } catch (err) {
        const errorData = await err.response.data;
        console.log("API fetch error:", errorData);
      }

    };
  
  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);

  }, []);

  const updateMonthData = ( to: any) => {
    if (to === "next") {
      const nextMonthDate = new Date(dataDate);
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

      const newDataMonthName = nextMonthDate.toLocaleString("default", { month: "long" });
      const newDataYear = String(nextMonthDate.getFullYear());
      const newDataMonth = String(nextMonthDate.getMonth() + 1); // Months are 0-indexed in JS

      setDataDate(nextMonthDate);
      setDataMonth(newDataMonth); // Months are 0-indexed in JS
      setDataYear(newDataYear);
      setDataMonthName(newDataMonthName);
      // console.log("Updated Month:", newDataMonth, "Year:", newDataYear, "Name:", newDataMonthName);
    }

    if (to === "previous") {
      const previousMonthDate = new Date(dataDate);
      previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

      const newDataMonthName = previousMonthDate.toLocaleString("default", { month: "long" });
      const newDataYear = String(previousMonthDate.getFullYear());
      const newDataMonth= String(previousMonthDate.getMonth() + 1); // Months are 0-indexed in JS

      setDataDate(previousMonthDate);
      setDataMonth(newDataMonth);
      setDataYear(newDataYear);
      setDataMonthName(newDataMonthName);
      // console.log("Updated Month:", newDataMonth, "Year:", newDataYear, "Name:", newDataMonthName);
    }
    // fetchData();
  }

  useEffect(() => {
    if (dataMonth && dataYear) {
      console.log
      fetchData();
    }
  }, [dataMonth, dataYear]);

  // Sample data for the pie chart

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

    const renderDot = (color: string) => {
  return (
    <View
      style={{
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 10,
      }}
    />
  );
};

const renderLegendComponent = () => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 120,
            marginRight: 20,
          }}>
          {renderDot('#006DFF')}
          <Text style={{color: 'white'}}>Income: 47%</Text>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', width: 120}}>
          {renderDot('#8F80F3')}
          <Text style={{color: 'white'}}>Okay: 16%</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 120,
            marginRight: 20,
          }}>
          {renderDot('#3BE9DE')}
          <Text style={{color: 'white'}}>Good: 40%</Text>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', width: 120}}>
          {renderDot('#FF7F97')}
          <Text style={{color: 'white'}}>Poor: 3%</Text>
        </View>
      </View>
    </>
  );
};

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
        <View
          style={[
            styles.container,
            { paddingTop: 70, backgroundColor: Theme.backgroundColor },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{  marginTop: 20 }}>
              </View>
            </View>
            <View>
                <View style={{ flexDirection: "row",justifyContent:"space-between", alignItems: "center", paddingHorizontal: 80, height: 30 , marginTop: 10}}>
                  <Button style={{ backgroundColor: 'transparent'}} onPress={() => updateMonthData("previous")}>                                                          
                    <AntDesign
                      name="left"
                      size={16}
                      color={Theme.textColor}
                    />
                  </Button>
                  <Text style={{color: Theme.textColor}}>{dataMonthName} - {dataYear}</Text>
                  <Button style={{ backgroundColor: 'transparent'}} onPress={() => updateMonthData("next")}>
                    <AntDesign
                      name="right"
                      size={16}
                      color={Theme.textColor}
                    />
                    </Button>
                </View>
              <View
                style={{
                  margin: 20,
                  padding: 16,
                  borderRadius: 20,
                  backgroundColor: "#232B5D",
                }}
              >
                <Text
                  style={{ fontSize: 24, fontWeight: 700, color: Theme.altTextColor}}
                >
                  Overview
                </Text>
                <View style={{ alignItems: "center" }}>
                  <PieChart
                    data={pieData}
                    donut
                    showGradient
                    sectionAutoFocus
                    focusOnPress
                    radius={90}
                    innerRadius={60}
                    innerCircleColor={"#232B5D"}
                    centerLabelComponent={() => {
                      return (
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 22,
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            47%
                          </Text>
                          <Text style={{ fontSize: 14, color: "white" }}>
                            Excellent
                          </Text>
                        </View>
                      );
                    }}
                  />
                </View>
                {renderLegendComponent()}
              </View>
            </View>

            <ExpenseBlock expenseList={expenseCategories} />
            <IncomeBlock incomeList={incomeCategories} onRefresh={fetchData} />
            <TransactionBlock transactionList={transactions} />
          </ScrollView>
          <TouchableOpacity
            style={styles.floatingAddBtn}
            onPress={() => router.push("/addCategory")}
          >
            <Feather
              name="plus"
              size={22}
              color={appTheme === "dark" ? "#ccc" : Colors.lightTintColor}
            />
          </TouchableOpacity>
        </View>
      )}
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
