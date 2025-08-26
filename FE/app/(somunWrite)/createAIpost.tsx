import React, { useEffect, useContext } from "react";
import {
  TextInput,
  View,
  Pressable,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Link, router, useNavigation } from "expo-router";
import styles from "../styles/createAIpost_style.js"; // Import styles
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppStateContext } from "../../src/context/AppStateContext";

// Import Icons
import TitleIcon from "../../assets/images/title.svg";
import ImageUploadIcon from "../../assets/images/image_upload.svg";
import CharacterIcon from "../../assets/images/character.svg";
import { Ionicons } from "@expo/vector-icons";

// Import Animations
import LottieView from "lottie-react-native";

// Import API
import { createPromotionImage } from "../../src/api/aiPromotionApi";

export default function createAIposts() {
  // 상단 기본 헤더 숨김
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  const insets = useSafeAreaInsets(); // 안전 영역 인셋 가져오기

  const [modalVisible, setModalVisible] = React.useState(false); // "생성 중" 모달 상태 관리
  const [imageGenerateError, setImageGenerateError] = React.useState(false); // 이미지 생성 에러 상태 관리
  // const [imageURL, setImageURL] = React.useState<string | null>(null); // 이미지 생성 완료 상태 관리

  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("AppStateContext must be used within an AppStateProvider");
  }

  const { state, dispatch } = context;

  const { pickedImages } = state;
  const setPickedImages = (url: string) => {
    // url이 ""이 아닐때만 값 넣음
    if (url !== "") {
      dispatch({ type: "SET_PICKED_IMAGES", payload: [...pickedImages, url] });
    }
  };

  const [AIimageURL, setAIimageURL] = React.useState("");

  // 입력값 상태 관리
  const [text, setText] = React.useState("");
  const maxLength = 2000; // 최대 글자 수
  const onChangeText = (input: string) => {
    if (input.length <= maxLength) {
      setText(input);
    }
  };

  // 생성하기 버튼 클릭 시 이벤트 -> AIpostAPI 호출
  const onCreateTextSubmit = (text: String) => {
    setModalVisible(true); // 모달 표시
    const data = {
      prompt: text,
      size: "1024x1024",
      n: 1,
    };
    createPromotionImage(data)
      .then((result) => {
        const url = result.data[0].url;
        console.log(url);
        setAIimageURL(url); // 이미지 생성 완료 상태로 변경
        setModalVisible(false); // 모달 숨김
      })
      .catch((error) => {
        setImageGenerateError(true); // 이미지 생성 에러 상태로 변경
        console.error(error);
      });
  };

  // AI 이미지 생성된 후 저장 버튼 눌렀을 시 이벤트
  const saveAIimage = () => {
    setPickedImages(AIimageURL);
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={[
          styles.safe,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom },
        ]}
      >
        {/* 상단 커스텀 헤더 */}
        <View style={[styles.header, { marginTop: 8 }]}>
          <Link href="../" asChild>
            <TouchableOpacity hitSlop={10} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={30} color={"#C2C2C2"} />
            </TouchableOpacity>
          </Link>
          <Text style={styles.title}>AI 홍보물 생성</Text>
        </View>

        {/* 중앙 홍보물 생성 안내글 */}
        {!AIimageURL && (
          <View style={styles.descriptionContainer}>
            <TitleIcon width={114} height={32} />
            <Text style={styles.descriptionText}>
              어떤 AI 홍보물을 생성할까요?
            </Text>
          </View>
        )}

        {/* 중앙 입력란 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputText}
            placeholder="참조 이미지를 업로드하거나 글을 적어서 홍보물에 대해 설명해주세요! (자세한 정보들이 들어갈수록 더 멋진 게시물이 탄생할거에요! ex) 행사기간, 홍보 상품, 장소 등)"
            placeholderTextColor={"#C2C2C2"}
            value={text}
            onChangeText={onChangeText}
            multiline
          />

          {AIimageURL && (
            <View style={styles.imageContainer}>
              <View style={styles.imageBox}>
                <Image
                  source={{ uri: AIimageURL }}
                  style={styles.createdImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}

          {/* 이미지 업로드 버튼, 글자 수 표시란 */}
          <View style={styles.inputBottomContainer}>
            <TouchableOpacity onPress={() => {}} activeOpacity={0.8}>
              <View style={styles.imageUploadContainer}>
                <Text style={styles.imageUploadText}>이미지</Text>
                <ImageUploadIcon width={15} height={15} />
              </View>
            </TouchableOpacity>
            <Text style={styles.textCounter}>
              {text.length}/{maxLength}
            </Text>
          </View>
        </View>

        {/* 저장하기 버튼 */}
        {AIimageURL ? (
          <View>
            {/* 재생성 버튼 */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                onCreateTextSubmit(text);
              }}
            >
              <View style={styles.reCreateButtonContainer}>
                <Ionicons name="reload-circle" size={24} color="#FFFFFF" />
                <Text style={styles.createButtonText}>재생성하기</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                saveAIimage();
              }}
            >
              <View style={styles.saveButtonContainer}>
                <Text style={styles.saveButtonText}>저장하기</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {/* 생성하기 버튼 */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                onCreateTextSubmit(text);
              }}
            >
              <View style={styles.createButtonContainer}>
                <Text style={styles.createButtonText}>생성하기</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

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
              <CharacterIcon style={{ marginTop: 50 }} width={68} height={45} />
              <Text style={styles.makingDesText}>
                지금, 가게를 소문낼 {"\n"}홍보물을 만들고 있어요!
              </Text>
              {imageGenerateError ? (
                <View>
                  <Text style={styles.waitingDesText}>
                    이미지 생성에 실패했습니다.
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setImageGenerateError(false);
                    }}
                  >
                    <View style={styles.closeModalButtonContainer}>
                      <Text style={styles.closeModalText}>닫기</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.waitingDesText}>
                    잠시만 기다려주세요...
                  </Text>
                  <LottieView
                    source={require("../animations/loading.json")}
                    autoPlay
                    loop
                    style={styles.loadingAnimation}
                  />
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}
