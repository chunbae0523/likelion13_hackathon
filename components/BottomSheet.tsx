import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";

const H = Dimensions.get("window").height;
const AP = Animated.createAnimatedComponent(Pressable);

export default function BottomSheet({
  snapPoints,
  initialSnap = 0,
  children,
}: {
  snapPoints: number[];
  initialSnap?: number;
  children: React.ReactNode;
}) {
  const snaps = useMemo(
    () =>
      [...snapPoints]
        .sort((a, b) => a - b)
        .map((v) => Math.max(0, Math.min(v, H))),
    [snapPoints]
  );
  const min = snaps[0],
    max = snaps[snaps.length - 1];
  const startIdx = Math.max(0, Math.min(initialSnap, snaps.length - 1));
  const minIdx = startIdx;

  const h = useRef(new Animated.Value(snaps[startIdx] ?? min)).current;
  const idx = useRef(startIdx);
  const [overlayOn, setOverlayOn] = useState(idx.current >= 1);
  const overlayOpacity = h.interpolate({
    inputRange: [snaps[minIdx], snaps[1] ?? max, max],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_e, g) => {
        const base = snaps[idx.current] ?? snaps[minIdx];
        const next = clamp(base - g.dy, snaps[minIdx], max);
      },
      onPanResponderRelease: (_e, g) => {
        const cur = (h as any)._value as number;
        const chosen = pick(snaps, cur, -g.vy);
        const targetIdx = Math.max(minIdx, chosen);
        Animated.spring(h, {
          toValue: snaps[targetIdx],
          useNativeDriver: false,
          bounciness: 0,
        }).start(() => {
          idx.current = targetIdx;
          setOverlayOn(targetIdx >= 1);
        });
      },
    })
  ).current;

  useEffect(() => {
    Animated.spring(h, {
      toValue: snaps[startIdx] ?? min,
      useNativeDriver: false,
      bounciness: 0,
    }).start();
    idx.current = startIdx;
    setOverlayOn(idx.current >= 1);
  }, [startIdx, snaps]);

  return (
    <>
      <AP
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "rgba(0,0,0,0.35)", opacity: overlayOpacity },
        ]}
        pointerEvents={overlayOn ? "auto" : "none"}
        onPress={() => {
          const next = Math.max(minIdx, idx.current - 1);
          Animated.spring(h, {
            toValue: snaps[next],
            useNativeDriver: false,
          }).start(() => {
            idx.current = next;
            setOverlayOn(next >= 1);
          });
        }}
      />
      <Animated.View style={[s.sheet, { height: h }]}>
        <View {...pan.panHandlers} style={s.handleArea}>
          <View style={s.handle} />
        </View>
        <View style={s.content}>{children}</View>
      </Animated.View>
    </>
  );
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const pick = (sn: number[], cur: number, vy: number) => {
  const t = cur + vy * 80;
  let bi = 0,
    bd = 1e9;
  sn.forEach((s, i) => {
    const d = Math.abs(t - s);
    if (d < bd) {
      bd = d;
      bi = i;
    }
  });
  return bi;
};

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
