import React, { memo } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Place } from "../src/types/Place";

const ORANGE = "#F19469";

function PlaceCard({ place, onPress }: { place: Place; onPress?: () => void }) {
  const distance =
    typeof place.distanceKm === "number"
      ? `${place.distanceKm.toFixed(1)} km`
      : undefined;

  return (
    <TouchableOpacity style={s.row} activeOpacity={0.85} onPress={onPress}>
      <Image source={require("../assets/images/default_image.png")} style={s.thumb} />
      <View style={s.right}>
        <View style={s.titleRow}>
          <Text style={s.title} numberOfLines={1}>
            {place.title}
          </Text>
          {!!distance && <Text style={s.distance}> {distance}</Text>}
        </View>
        {!!place.address && (
          <Text style={s.addr} numberOfLines={1}>
            {place.address}
          </Text>
        )}
        <View style={s.metaRow}>
          {!!place.openNowText && (
            <Text style={s.meta}>{place.openNowText}</Text>
          )}
          {!!place.openNowText && !!place.reviewSummary && (
            <Text style={s.dot}>|</Text>
          )}
          {!!place.reviewSummary && (
            <Text style={s.meta}>{place.reviewSummary}</Text>
          )}
          {(place.openNowText || place.reviewSummary) &&
            !!place.signatureMenuText && <Text style={s.dot}>·</Text>}
          {!!place.signatureMenuText && (
            <Text style={s.meta} numberOfLines={1}>
              {place.signatureMenuText}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(PlaceCard);

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: "#F19469",
    marginRight: 15,
  },
  right: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: "row", alignItems: "baseline" },
  title: { fontSize: 18, fontWeight: 600, color: "#111", maxWidth: "70%" },
  distance: {
    fontSize: 16,
    fontWeight: 500,
    color: "#EA6844",
    marginLeft: 4,
  },
  addr: { fontSize: 14, color: "#6F6F6F", marginTop: 6 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  meta: { fontSize: 12, marginVertical: 6, color: "#B0B0B0" },
  dot: { marginHorizontal: 6, color: "#D0D0D0" },
});
