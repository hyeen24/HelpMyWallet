import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/Input";
import {
  Entypo,
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Button from "@/components/Button";
import DateTimePicker from '@react-native-community/datetimepicker';
import api from "./api";
import CustomIconButton from "@/components/CustomIconButton";
import ColorList from "@/data/colors.json";

import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton";
import * as ImagePicker from "expo-image-picker";
import Loading from "@/components/Loading";
import PageHeader from "@/components/PageHeader";
import { darkTheme, lightTheme } from "@/constants/Theme";
import AddNewIncome from "@/components/AddNewIncome";
import AddNewExpense from "@/components/AddNewExpense";

const addCategory = () => {
  const [icon, setIcon] = useState("");
  const [iconFamily, setIconFamily] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [selectedType, setSelectedType] = useState<
    "income" | "expenses" | "merchant" | null
  >(null);
  const [categoryColor, setCategoryColor] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [incomeAmount, setIncomeAmount] = useState<number | null>(null);
 

  const appTheme = useColorScheme();
  const Theme = appTheme === "dark" ? darkTheme : lightTheme;

  const router = useRouter();

  
  const pickImage = async () => {
    // Ask the user for permission to access the media library
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const createCategory = async () => {
    setLoading(true);
    if (
      !categoryName ||
      !selectedType ||
      (selectedType === "expenses" && !categoryColor) ||
      (selectedType === "income" && !icon)
    ) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    console.log("category Type ", selectedType);

    if (selectedType === "merchant") {
      const formData = new FormData();

      formData.append("name", categoryName.toLowerCase());

      if (image) {
        const fileName = image.split("/").pop();
        const fileType = fileName?.split(".").pop();

        formData.append("icon", {
          uri: image,
          name: fileName,
          type: `image/${fileType}`,
        } as any); // `as any` to satisfy TypeScript
      }

      await api
        .post("/api/merchants/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log("Response", res.data);
          Alert.alert("Merchant Category", `Merchant category created`, [
            {
              text: "OK",
              onPress: () => {
                setLoading(false);
                router.push("/(tabs)/home");
              },
            },
          ]);
          setCategoryName("");
          setIcon("");
          setImage(null);
        })
        .catch((error) => {
          let message = error.response.data.name[0];
          console.log(message);
          Alert.alert(
            "Failed to Create Merchant.",
            message[0].toUpperCase() + message.slice(1)
          );
        });
    } else {
        // start if category is not merchant
      try {
        const payload = {
          parent_name: selectedType,
          icon: icon,
          color: categoryColor,
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

        setCategoryName("");
        setIcon("");
        setImage(null);
      } catch (error) {
        console.error(error.response?.data || error.message);
        Alert.alert("Error", "Failed to create category.");
      }
      // End if not merchant
    }
    setLoading(false);
  };

  const toggleRadio = (type: "income" | "expenses" | "merchant") => {
    setSelectedType((prev) => (prev === type ? null : type));
  };

  

  

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <PageHeader title="Category" />
          <View style={styles.container}>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginTop: 10,
                justifyContent: "space-evenly",
                backgroundColor: Theme.backgroundColor,
              }}
            >
              <CustomIconButton
                icon={
                  <MaterialCommunityIcons
                    name="gold"
                    size={18}
                    color={Colors.white}
                  />
                }
                text="Income"
                focusable={true}
                focused={selectedType === "income"}
                onPress={() => toggleRadio("income")}
                style={{ borderRadius: 10 }}
              />

              <CustomIconButton
                icon={
                  <FontAwesome6
                    name="hand-holding-dollar"
                    size={18}
                    color={Colors.white}
                  />
                }
                text="Expenses"
                focusable={true}
                focused={selectedType === "expenses"}
                onPress={() => toggleRadio("expenses")}
                style={{ borderRadius: 10 }}
              />
              <CustomIconButton
                icon={<Entypo name="shop" size={18} color={Colors.white} />}
                text="Merchant"
                focusable={true}
                focused={selectedType === "merchant"}
                onPress={() => toggleRadio("merchant")}
                style={{ borderRadius: 10 }}
              />
            </View>
            <View>
              {selectedType === "merchant" ? (
                <View style={{ gap: 20 }}>
                  <View>
                    <Text style={styles.groupHeaderTxt}>Merchant Name</Text>
                    <Input
                      placeholder="Enter merchant name"
                      onChangeText={(value) => {
                        setCategoryName(value);
                      }}
                      icon={
                        <MaterialIcons
                          name="storefront"
                          size={24}
                          color={Colors.white}
                        />
                      }
                    />
                  </View>
                  <View>
                    <Text style={styles.groupHeaderTxt}>Linked Account</Text>
                    <Input
                      placeholder="Select linked account"
                      onChangeText={(value) => {}} // Handle linked account selection
                      icon={
                        <MaterialCommunityIcons
                          name="bank"
                          size={22}
                          color={Colors.white}
                        />
                      }
                    />
                  </View>
                  <View>
                    <Text style={styles.groupHeaderTxt}>Merchant Icon</Text>
                    <TouchableOpacity
                      onPress={() => {
                        pickImage();
                      }}
                      style={{
                        width: 100,
                        height: 100,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        borderWidth: 0.7,
                        borderColor: Colors.white,
                        borderStyle: "dashed",
                        backgroundColor: Colors.grey,
                      }}
                    >
                      {image ? (
                        <Image
                          source={{ uri: image }}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 10,
                          }}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="file-image-plus"
                          size={36}
                          color={Colors.white}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
              
            </View>
            {selectedType === "income" && (
              <AddNewIncome/>
              )}

            {selectedType === "expenses" && (
              <AddNewExpense/>
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default addCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 8,
    gap: 8,
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
  groupHeaderTxt: {
    color: Colors.white,
    fontSize: 14,
    paddingBottom: 8,
    fontWeight: 600,
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  colorContainer: {
    height: 30,
    width: 30,
    borderRadius: 30,
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  }
  
  
});
