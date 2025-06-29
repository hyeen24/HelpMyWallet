import { Theme } from "@/types";
import Colors from "./Colors";

export const lightTheme: Theme = {
  backgroundColor: Colors.neutral100,
  textColor: Colors.black,
  cardColors: Colors.tintColor,
  altTextColor: Colors.tintColor
};

export const darkTheme: Theme = {
  backgroundColor: Colors.black,
  textColor: Colors.white,
  cardColors: Colors.neutral700,
  altTextColor: Colors.cyan
};