import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  AntDesign,
  Feather,
  FontAwesome,
  SimpleLineIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router, Stack } from "expo-router";
import { PieChart } from "react-native-gifted-charts";
import ExpenseBlock from "@/components/ExpenseBlock";
import IncomeBlock from "@/components/IncomeBlock";
import ExpenseList from "@/data/expenses.json";
import IncomeList from "@/data/income.json";
import TransactionList from "@/data/Spending.json";
import AsyncStorage from '@react-native-async-storage/async-storage';

import TransactionBlock from "@/components/TransactionBlock";
import HomeHeader from "@/components/HomeHeader";
import Loading from "@/components/Loading";
import api from "../api";
import Button from "@/components/Button";
import { useTheme } from "@/contexts/ThemeContext";

const Home = () => {
  const [expenseCategories, setExpenseCategories] = React.useState([]);
  const [incomeCategories, setIncomeCategories] = React.useState([]);
  const [transactions, setTransactions] = React.useState<[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataMonth, setDataMonth] = useState<string>(
    String(new Date().getMonth() + 1)
  );
  const [dataYear, setDataYear] = useState<string>(
    String(new Date().getFullYear())
  );
  const [dataMonthName, setDataMonthName] = useState<string>(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [dataDate, setDataDate] = useState<Date>(new Date());
  const [budget, setBudget] = useState<number>(0);
  const [merchantData, setMerchantData] = useState<[]>([]);

  const { theme } = useTheme();

  const storeData = async (key:string, value: any) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  };

  const fetchData = async () => {
    console.log("Fetching data for month:", dataMonth, "and year:", dataYear);

    // Retrieve data for transactions
    try {
      const response = await api.get(
        `api/transactions/?year=${dataYear}&month=${dataMonth}`
      );
      const transactionsData = response.data;
      console.log("Transactions:", transactionsData);
      setTransactions(transactionsData);
    } catch (err) {
      console.error("API fetch error:", err);
    }

    // Retrieve data for categories
    try {
      const resIncome = await api.get("api/incomes/");
      const incomes = resIncome.data;

      setIncomeCategories(incomes);
      console.log("Incomes:", incomes);
      // console.log("Categories:", categories);

      const resExpense = await api.get("api/expenses/");
      const expenses = resExpense.data;
      // console.log("Expenses:", expenses);

      setExpenseCategories(expenses);

      const responseMerchant = await api.get("api/merchants/");
      const  merchants = responseMerchant.data;
      // console.log("Merchants:", merchants);
      setMerchantData(merchants);
      storeData("merchants",JSON.stringify(merchants));
      storeData("incomes",JSON.stringify(incomes));
      storeData("expenses",JSON.stringify(expenses));

    } catch (err) {
      const errorData = await err.response.data;
      console.log("API fetch error:", errorData);
    }

  };

  useEffect(() => {
    setLoading(true);
    // fetchData();
    setLoading(false);
    getData();
  }, []);

  const getData = () => {
    const groupedMerchants = merchantData.filter(
      (item) => item.category != null
    );
    console.log("Merchant with group:", groupedMerchants);
  };

  const updateMonthData = (to: any) => {
    if (to === "next") {
      const nextMonthDate = new Date(dataDate);
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

      const newDataMonthName = nextMonthDate.toLocaleString("default", {
        month: "long",
      });
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

      const newDataMonthName = previousMonthDate.toLocaleString("default", {
        month: "long",
      });
      const newDataYear = String(previousMonthDate.getFullYear());
      const newDataMonth = String(previousMonthDate.getMonth() + 1); // Months are 0-indexed in JS

      setDataDate(previousMonthDate);
      setDataMonth(newDataMonth);
      setDataYear(newDataYear);
      setDataMonthName(newDataMonthName);
      // console.log("Updated Month:", newDataMonth, "Year:", newDataYear, "Name:", newDataMonthName);
    }
    // fetchData();
  };

  useEffect(() => {
    if (dataMonth && dataYear) {
      console.log;
      fetchData();
    }
  }, [dataMonth, dataYear]);

  // Sample data for the pie chart

  const pieData = [
    {
      value: 47,
      color: "#009FFF",
      gradientCenterColor: "#006DFF",
      focused: true,
    },
    { value: 40, color: "#93FCF8", gradientCenterColor: "#3BE9DE" },
    { value: 16, color: "#BDB2FA", gradientCenterColor: "#8F80F3" },
    { value: 3, color: "#FFA5BA", gradientCenterColor: "#FF7F97" },
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
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          { 
            transactions.map((item) => {
              return (
                <View
                  style={{ flexDirection: "row", alignItems: "center", width: 120 }}>
                    
                </View>
              )
            })
          }
            {renderDot("#006DFF")}
            <Text style={{ color: "white" }}>Income: 47%</Text>
        
          <View
            style={{ flexDirection: "row", alignItems: "center", width: 120 }}
          >
            {renderDot("#8F80F3")}
            <Text style={{ color: "white" }}>Okay: 16%</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <HomeHeader budget={budget} />,
          headerStyle: { backgroundColor: theme }
        }}
      />
      {loading ? (
        <Loading />
      ) : (
        <View
          style={[
            styles.container,
            { paddingTop: 80, backgroundColor: theme.backgroundColor },
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
              <View style={{ marginTop: 20 }}></View>
            </View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 80,
                  height: 30,
                  marginTop: 10,
                }}
              >
                <Button
                  style={{ backgroundColor: "transparent" }}
                  onPress={() => updateMonthData("previous")}
                >
                  <AntDesign name="left" size={16} color={theme.textColor} />
                </Button>
                <Text style={{ color: theme.textColor }}>
                  {dataMonthName} - {dataYear}
                </Text>
                <Button
                  style={{ backgroundColor: "transparent" }}
                  onPress={() => updateMonthData("next")}
                >
                  <AntDesign name="right" size={16} color={theme.textColor} />
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
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: theme.altTextColor,
                  }}
                >
                  Spending Overview
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
              color={theme.textColor}
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
    paddingHorizontal: 10,
  },
  floatingAddBtn: {
    backgroundColor: Colors.tintColor,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    right: 12,
    bottom: 45,
    height: 40,
    width: 40,
    borderRadius: 50,
  },
});
