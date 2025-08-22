import React, { memo, useCallback, useMemo } from "react";
import {
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ViewStyle,
  TextStyle,
} from "react-native";

export type FilterKey = "추천" | "인기" | "동네행사" | "맛집" | "카페" | "마트" | "기타";

type Item =
  | FilterKey
  | {
      key: FilterKey;
      label?: string;
      disabled?: boolean;
    };

type Props = {
  items?: Item[];
  selected: FilterKey[];
  onToggle: (key: FilterKey) => void;
  gap?: number;
  contentPaddingH?: number;
  chipStyle?: ViewStyle;
  chipOnStyle?: ViewStyle;
  textStyle?: TextStyle;
  textOnStyle?: TextStyle;
};

const toItem = (v: Item) =>
  typeof v === "string" ? { key: v, label: v } : { label: v.key, ...v };

function MapFilterBarInner({
  items = ["추천", "인기", "동네행사", "맛집", "카페", "마트", "기타"],
  selected,
  onToggle,
  gap = 8,
  contentPaddingH = 0,
  chipStyle,
  chipOnStyle,
  textStyle,
  textOnStyle,
}: Props) {
  const parsed = useMemo(() => items.map(toItem), [items]);

  const handlePress = useCallback(
    (key: FilterKey, disabled?: boolean) => {
      if (!disabled) onToggle(key);
    },
    [onToggle]
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[s.wrap, { paddingHorizontal: contentPaddingH }]}
    >
      {parsed.map((it, idx) => {
        const on = selected.includes(it.key as FilterKey);
        const last = idx === parsed.length - 1;
        const disabled = Boolean((it as any).disabled);

        return (
          <Pressable
            key={String(it.key)}
            onPress={() => handlePress(it.key as FilterKey, disabled)}
            style={[
              s.chip,
              { marginRight: last ? 0 : gap },
              { backgroundColor: on ? "#F19469" : "#FFFFFF" },
              on && chipOnStyle,
              chipStyle,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: on, disabled }}
            disabled={disabled}
          >
            <Text
              style={[
                s.txt,
                { color: on ? "#FFFFFF" : "#9C9C9C" },
                on && textOnStyle,
                textStyle,
              ]}
            >
              {it.label ?? it.key}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export default memo(MapFilterBarInner);

const s = StyleSheet.create({
  wrap: { paddingVertical: 2, flexDirection: "row", alignItems: "center" },
  chip: {
    height: 30,
    paddingHorizontal: 14,
    marginHorizontal: 5,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.24,
    shadowRadius: 2,
    elevation: 4,
  },
  txt: { fontSize: 14, fontFamily: "Pretendard-Regular", fontWeight: 500 },
});
