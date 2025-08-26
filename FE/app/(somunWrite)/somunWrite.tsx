import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation, Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/somunWrite_styles"; // Import styles
import { AppStateContext } from "@/src/context/AppStateContext";
import {
  pickLocalImageUri,
  uploadMultipleImagesToSupabase,
} from "@/src/utils/handleImage";

//icon Imports
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

//svg Imports
import LeftArrowDark from "../../assets/images/left_arrow_dark.svg";
import AIIcon from "../../assets/images/AI.svg";
import ImageIcon from "../../assets/images/image.svg";
import VideoIcon from "../../assets/images/video.svg";
import SmileIcon from "../../assets/images/smile.svg";
import MapPinIcon from "../../assets/images/map_pin.svg";
import TitleIcon from "../../assets/images/title.svg";

// API Imports
import { createPost } from "../../src/api/communityApi";
import { getUserByUUID, getUUID } from "@/src/utils/handleAsyncUUID";
import { Post } from "@/src/types/community";

const ICONSIZE = 27; // AI홍보물 생성 등의 기본 아이콘 크기

export default function somunWrite() {
  const navigation = useNavigation();

  // 상단 기본 헤더 숨김
  useEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  type BadgeType = {
    id: string;
    label: string;
    isAddButton?: boolean;
    selected?: boolean; // 선택 여부
    isNew?: boolean; // 새로 추가된 뱃지 여부
  }; // 뱃지 타입 선언

  const [text, setText] = useState(""); // 소문쓰기 적는 텍스트
  // 뱃지 리스트, 리스트에 추가하는 함수
  const [badges, setBadges] = useState<BadgeType[]>([
    { id: "badge1", label: "이벤트" },
    { id: "badge2", label: "홍보" },
    { id: "badge3", label: "세일" },
    { id: "badge4", label: "추천" },
    { id: "badge5", label: "투표" },
    { id: "add", label: "+추가", isAddButton: true }, // 뱃지 추가 버튼
  ]);

  // 뱃지 제거 함수
  const removeBadge = (id: string) => {
    setBadges((prev) => prev.filter((badge) => badge.id !== id));
  };

  // 뱃지 클릭 시 동작
  const onBadgePress = (badge: BadgeType) => {
    if (badge.isAddButton) {
      // 뱃지 추가 버튼 클릭 시 빈 뱃지 추가
      const newBadge = {
        id: `badge-${Date.now()}`, // 고유 ID 생성
        label: "",
        isNew: true,
        selected: true,
      };
      setBadges((prev) => {
        const lastIndex = prev.length - 1;
        const beforeLast = prev.slice(0, lastIndex); // 마지막 뱃지 제외
        const last = prev[lastIndex]; // 마지막 뱃지
        return [...beforeLast, newBadge, last]; // 추가버튼 앞에 뱃지 생성
      });
    } else {
      setBadges((prev) =>
        prev.map((b) =>
          b.id === badge.id ? { ...b, selected: !b.selected } : b
        )
      );
    }
  };

  // 뱃지 텍스트 변경 함수
  const onChangeText = (text: string, id: string) => {
    setBadges((prev) =>
      prev.map((badge) => (badge.id === id ? { ...badge, label: text } : badge))
    );
  };

  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("AppStateContext must be used within an AppStateProvider");
  }

  const { state } = context;

  const { pickedImages } = state;

  const [modalVisible, setModalVisible] = React.useState(false); // "내용을 입력해주세요" 모달 상태 관리

  // 게시물 생성 함수
  const makePost = async () => {
    if (text === "") {
      setModalVisible(true);
      return;
    }
    // 선택된 뱃지들 중 label이 빈 문자열이 아닌 것들만 태그로 추출
    const tags = badges
      .filter((badge) => badge.selected)
      .filter((badge) => badge.label !== "")
      .map((badge) => badge.label);

    router.back();
    context.dispatch({ type: "SET_IS_UPLOADING", payload: true });
    const UUID = await getUUID();
    const user = await getUserByUUID(UUID);

    const publicUrls =
      pickedImages.length !== 0
        ? await uploadMultipleImagesToSupabase(user.id, pickedImages)
        : [];
    const postData: Post = {
      id: user.id,
      author_name: user.username,
      content: text,
      images: publicUrls,
      likes: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
      tags: tags,
    };
    await createPost(postData);
    context.dispatch({ type: "SET_PICKED_IMAGES", payload: [] }); // pickedImages 초기화
    context.dispatch({ type: "SET_IS_UPLOADING", payload: false });
  };

  const selectImages = async () => {
    const data = await pickLocalImageUri();
    if (data === null) {
      return null;
    }
    const images = [...pickedImages, data.base64];
    context.dispatch({ type: "SET_PICKED_IMAGES", payload: images }); // 업로드용 uri이미지리스트
    return data;
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 상단 커스텀 헤더 */}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={[styles.header, { paddingTop: 8 }]}>
          <Link href="../" asChild>
            <TouchableOpacity hitSlop={10} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={30} color={"#C2C2C2"} />
            </TouchableOpacity>
          </Link>
          <Text style={styles.title}>소문쓰기</Text>
        </View>
      </TouchableWithoutFeedback>

      {/* 텍스트 입력 영역 */}
      <View style={styles.textContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="이웃과 나누고 싶은 이야기를 적어 보세요..."
          placeholderTextColor={"#9C9C9C"}
          multiline={true} // 여러줄 입력 가능
          textAlignVertical="top" // 텍스트 입력 위치를 상단으로
          value={text}
          onChangeText={setText}
        />
      </View>

      {/* 이미지 영역 */}
      <ScrollView
        horizontal
        style={styles.imageContainer}
        showsHorizontalScrollIndicator={false}
      >
        {pickedImages.length !== 0 &&
          pickedImages.map((uri, index) => (
            <View style={styles.imageBox} key={index}>
              <Image
                source={{ uri: uri }}
                style={styles.createdImage}
                resizeMode="cover"
              />
            </View>
          ))}
      </ScrollView>

      {/* 카테고리 뱃지 */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        <View style={styles.badgeContainer}>
          {badges.map((badge) =>
            badge.isNew ? (
              <View key={badge.id} style={styles.newBadge}>
                <TextInput
                  style={styles.newBadgeText}
                  placeholder="(눌러서 수정)"
                  placeholderTextColor={"#FFFFFF"}
                  value={badge.label}
                  onChangeText={(text) => onChangeText(text, badge.id)}
                />
                <TouchableOpacity onPress={() => removeBadge(badge.id)}>
                  <FontAwesome6 name="trash-can" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                key={badge.id}
                style={[styles.badge, badge.selected && styles.selectedBadge]}
                onPress={() => onBadgePress(badge)}
              >
                <Text
                  style={[
                    styles.badgeText,
                    badge.selected && styles.selectedBadgeText,
                  ]}
                >
                  {badge.label}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </ScrollView>

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          {/* 하단 분리 줄 */}
          <View style={styles.seperateLine} />

          {/* 하단 버튼 영역 */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.buttonContainer}
              onPress={() => {
                router.push("/(somunWrite)/createAIpost");
              }}
            >
              <AIIcon width={ICONSIZE + 2} height={ICONSIZE + 2} />
              <Text style={styles.buttonText}>AI 홍보물 생성</Text>
              <LeftArrowDark width={33} height={31} style={styles.leftArrow} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                selectImages();
              }}
            >
              <ImageIcon width={ICONSIZE} height={ICONSIZE} />
              <Text style={styles.buttonText}>사진 추가</Text>
              <LeftArrowDark width={33} height={31} style={styles.leftArrow} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer} onPress={() => {}}>
              <VideoIcon width={ICONSIZE} height={ICONSIZE} />
              <Text style={styles.buttonText}>동영상 추가</Text>
              <LeftArrowDark width={33} height={31} style={styles.leftArrow} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer} onPress={() => {}}>
              <SmileIcon width={ICONSIZE - 2} height={ICONSIZE - 2} />
              <Text style={styles.buttonText}>사람 태그</Text>
              <LeftArrowDark width={33} height={31} style={styles.leftArrow} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer} onPress={() => {}}>
              <MapPinIcon width={ICONSIZE - 3} height={ICONSIZE - 3} />
              <Text style={styles.buttonText}>위치 추가</Text>
              <LeftArrowDark width={33} height={31} style={styles.leftArrow} />
            </TouchableOpacity>
            <View style={styles.locationChipContainer}>
              <Text style={styles.locationChipText}>인천광역시</Text>
              <Text style={styles.locationChipText}>연수구 용담로 135</Text>
              <Text style={styles.locationChipText}>소문난 카페</Text>
            </View>
          </View>

          {/* 게시하기 버튼 */}
          <View style={styles.postContainer}>
            <TouchableOpacity
              onPress={() => {
                makePost();
              }}
            >
              <Text style={styles.postText}>게시하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* 이미지 생성 중 대기 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* insets.top: 배경 상단 잘림 방지*/}
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <TitleIcon style={{ marginTop: 50 }} width={130} height={80} />
            <Text style={styles.makingDesText}>❗내용을 입력해주세요❗</Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <View style={styles.closeModalButtonContainer}>
                <Text style={styles.closeModalText}>닫기</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
