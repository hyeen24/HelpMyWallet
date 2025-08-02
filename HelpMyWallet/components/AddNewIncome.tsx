import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Input from "./Input";
import Colors from "@/constants/Colors";
import { darkTheme, lightTheme } from "@/constants/Theme";
import iconList from "@/data/icons.json";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "./Button";
import api from "@/app/api";
import { router } from "expo-router";

const AddNewIncome = () => {
  const [categoryName, setCategoryName] = useState("");
  const appTheme = useColorScheme();
  const [icon, setIcon] = useState("");
  const [iconFamily, setIconFamily] = useState("");
  const [recurrence, setRecurrence] = useState<string | null>(null);
  const Theme = appTheme === "dark" ? darkTheme : lightTheme;
  const [incomeAmount, setIncomeAmount] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    setStartDate(new Date());
    setEndDate(new Date());
  }, []);

  const selectRecurrence = (selected: string) => {
    if (selected === recurrence) {
      setRecurrence(null);
    } else {
      setRecurrence(selected);
    }
  };

  const displayStartDatePicker = () => {
    setShowStartDatePicker(true);
  };

  const displayEndDatePicker = () => {
    setShowEndDatePicker(true);
  };

  const onChangeStartDate = (event: any, date?: Date) => {
    setShowStartDatePicker(false);
    if (date) {
      setStartDate(date);
      setEndDate(date);
    }
  };

  const onChangeEndDate = (event: any, date?: Date) => {
    setShowEndDatePicker(false);
    if (date) {
      setEndDate(date);
    }

    if (date && startDate && date < startDate) {
      Alert.alert("Error", "End date cannot be before start date.");
      setEndDate(startDate); // Reset end date to start date
    }
  };
  
  const createNewIncome = async () => {
    if (!categoryName || !incomeAmount || !icon || !iconFamily) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // Here you would typically send the data to your backend or state management
    console.log({
      categoryName,
      incomeAmount,
      icon,
      iconFamily,
      recurrence,
      startDate,
      endDate,
    });

    try {
        if (!startDate || !endDate) {
            Alert.alert("Error", "Please select valid start and end dates.");
            return;
        }

        const payload = {
            parent_name: "income",
            icon: icon,
            amount: incomeAmount,
            recurrence: recurrence,
            start_date: startDate.toISOString().split("T")[0], 
            end_date: endDate.toISOString().split("T")[0], 
            name: categoryName,
            icon_type: iconFamily,
        };

        console.log("Payload", payload);

        const res = await api.post("/api/categories/", payload);
        Alert.alert("Category", `Category created`, [
          {
            text: "OK",
            onPress: () => {
              router.push("/(tabs)/home");
            },
          },
        ]);

      } catch (error) {
        console.error(error.response?.data || error.message);
        Alert.alert("Error", "Failed to create category.");
      }

    // Reset form after submission
    setCategoryName("");
    setIncomeAmount(null);
    setIcon("");
    setIconFamily("");
    setRecurrence(null);
    setStartDate(new Date());
    setEndDate(new Date());
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.pageTitleTxt}>Add New Income</Text>
                    <Text style={[styles.pageTxt, { marginBottom: 20 }]}>
                      Let's add a new income source for your{" "}
                      <Text style={{ fontWeight: 600 }}>account.</Text>
                    </Text>
        <Text style={[styles.groupHeaderTxt, { color: Theme.textColor }]}>
          Income Name
        </Text>
        <Input
          placeholder="Enter category type"
          onChangeText={(value) => {
            setCategoryName(value);
          }}
          iconLeft={
            <MaterialIcons name="category" size={24} color={Colors.white} />
          }
        />
      </View>
      <View style={{ height: 500, marginTop: 20 }}>
        <View>
          <Text style={[styles.groupHeaderTxt, { color: Theme.textColor }]}>Amount</Text>
          <Input
            placeholder="Enter the amount"
            keyboardType="number-pad"
            onChangeText={(value) => {
              setIncomeAmount(value === "" ? null : Number(value));
            }}
            iconLeft={
              <FontAwesome name="dollar" size={22} color={Theme.textColor} />
            }
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={[styles.groupHeaderTxt, { color: Theme.textColor }]}>Category Icon</Text>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          {iconList.map((item) => {
            const iconName = item.iconName;
            const iconFamily = item.iconFamily;
            const isSelectedIcon = icon === iconName;
            return (
              <TouchableOpacity
                key={iconName}
                onPress={() => {
                  setIcon(iconName);
                  setIconFamily(iconFamily);
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 40,
                    width: 40,
                    borderColor: isSelectedIcon ? Colors.tintColor : "#666",
                    borderWidth: isSelectedIcon ? 2 : 1,
                    borderRadius: 50,
                  }}
                >
                  {iconFamily === "FontAwesome6" && (
                    <FontAwesome6
                      name={iconName}
                      size={24}
                      color={isSelectedIcon ? Colors.tintColor :Colors.white}
                    />
                  )}
                  {iconFamily === "MaterialIcons" && (
                    <MaterialIcons
                      name={iconName}
                      size={24}
                      color={isSelectedIcon ? Colors.tintColor :Colors.white}
                    />
                  )}
                  {iconFamily === "MaterialCommunityIcons" && (
                    <MaterialCommunityIcons
                      name={iconName}
                      size={24}
                      color={isSelectedIcon ? Colors.tintColor :Colors.white}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{ marginTop: 20 }}>
            <Text style={[styles.groupHeaderTxt, { color: Theme.textColor }]}>Recurrence</Text>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <TouchableOpacity
                style={[
                  styles.recurrenceSelectionContainer,
                  {
                    backgroundColor:
                      recurrence === "once" ? Theme.cardColors : undefined,
                    borderColor:
                      recurrence === "once" ? Colors.tintColor : "#666",
                  },
                ]}
                onPress={() => selectRecurrence("once")}
              >
                <Text style={{ color: Theme.textColor }}>Once</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.recurrenceSelectionContainer,
                  {
                    backgroundColor:
                      recurrence === "daily" ? Theme.cardColors : undefined,
                    borderColor:
                      recurrence === "daily" ? Colors.tintColor : "#666",
                  },
                ]}
                onPress={() => selectRecurrence("daily")}
              >
                <Text style={{ color: Theme.textColor }}>Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.recurrenceSelectionContainer,
                  {
                    backgroundColor:
                      recurrence === "monthly" ? Theme.cardColors : undefined,
                    borderColor:
                      recurrence === "monthly" ? Colors.tintColor : "#666",
                  },
                ]}
                onPress={() => selectRecurrence("monthly")}
              >
                <Text style={{ color: Theme.textColor }}>Monthly</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.recurrenceSelectionContainer,
                  {
                    backgroundColor:
                      recurrence === "yearly" ? Theme.cardColors : undefined,
                    borderColor:
                      recurrence === "yearly" ? Colors.tintColor : "#666",
                  },
                ]}
                onPress={() => selectRecurrence("yearly")}
              >
                <Text style={{ color: Theme.textColor }}>Yearly</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 20, gap: 10 }}>
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                <Text
                  style={[
                    styles.groupHeaderTxt,
                    {color:Theme.textColor , paddingBottom: 0, width: 80 },
                  ]}
                >
                  Start Date:{" "}
                </Text>
                <TouchableOpacity
                  onPress={displayStartDatePicker}
                  style={styles.datePickerButton}
                >
                  <Text style={{ color: Theme.textColor, textAlign: "center" }}>
                    {startDate
                      ? startDate.toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={onChangeStartDate}
                    style={{ width: "100%" }}
                  />
                )}
              </View>
              {recurrence !== "once" && recurrence && (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.groupHeaderTxt,
                      {color:Theme.textColor ,paddingBottom: 0, width: 80 },
                    ]}
                  >
                    End Date:
                  </Text>
                  <TouchableOpacity
                    onPress={displayEndDatePicker}
                    style={styles.datePickerButton}
                  >
                    <Text
                      style={{ color: Theme.textColor, textAlign: "center" }}
                    >
                      {endDate
                        ? endDate.toLocaleDateString("en-GB", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {showEndDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={onChangeEndDate}
                  style={{ width: "100%" }}
                />
              )}
            </View>
          </View>
        </View>
        <Button onPress={()=>createNewIncome()}>
        <Text style={[styles.groupHeaderTxt, {color:Colors.white}]}>Add</Text>
        </Button>
      </View>
      <View style={{height:50}}></View>
    </ScrollView>
  );
};

export default AddNewIncome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  groupHeaderTxt: {
    fontSize: 14,
    paddingBottom: 8,
    fontWeight: 600,
  },
  recurrenceSelectionContainer: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  datePickerButton: {
    width: "70%",
    backgroundColor: "transparent",
    borderRadius: 10,
    borderColor: "#666",
    borderWidth: 1,
    padding: 5,
  },
  pageTitleTxt: {
      fontSize: 24,
      color: Colors.white,
      fontWeight: 700,
    },
    pageTxt: {
      color: Colors.white,
      fontSize: 12,
      marginBottom: 10,
    },
});
