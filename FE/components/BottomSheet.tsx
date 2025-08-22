// src/components/BottomSheet.tsx
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";

type Props = {
  snapPoints: number[];
  initialSnap?: number;
  children: React.ReactNode;
};

export default function BottomSheet({
  snapPoints,
  initialSnap = 0,
  children,
}: Props) {
  const snaps = useMemo(
    () => [...snapPoints].sort((a, b) => a - b),
    [snapPoints]
  );
  const minIdx = Math.max(0, Math.min(initialSnap, snaps.length - 1));
  const h = useRef(new Animated.Value(snaps[minIdx])).current;
  const idx = useRef(minIdx);
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_e, g) => {
        const base = snaps[idx.current];
        const next = clamp(base - g.dy, snaps[0], snaps[snaps.length - 1]);
        h.setValue(next);
      },
      onPanResponderRelease: (_e, g) => {
        const cur = (h as any)._value as number;
        const target = nearest(snaps, cur + -g.vy * 80);
        Animated.spring(h, {
          toValue: target,
          useNativeDriver: false,
          bounciness: 0,
        }).start(() => (idx.current = snaps.indexOf(target)));
      },
    })
  ).current;

  useEffect(() => {
    Animated.spring(h, {
      toValue: snaps[minIdx],
      useNativeDriver: false,
      bounciness: 0,
    }).start();
    idx.current = minIdx;
  }, [minIdx, snaps]);

  return (
    <Animated.View style={[s.sheet, { height: h }]} {...pan.panHandlers}>
      <View style={s.handleArea} {...pan.panHandlers}>
        <View style={s.handle} />
      </View>
      <View style={s.content}>{children}</View>
    </Animated.View>
  );
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const nearest = (arr: number[], v: number) =>
  arr.reduce((p, c) => (Math.abs(c - v) < Math.abs(p - v) ? c : p), arr[0]);

const s = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 12,
  },
  handleArea: { alignItems: "center", marginTop: 12, marginBottom: 8 },
  handle: { width: 45, height: 4, borderRadius: 2, backgroundColor: "#DEDEDE" },
  content: { paddingHorizontal: 22, paddingBottom: 20 },
});
