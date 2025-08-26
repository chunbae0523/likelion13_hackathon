import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase"; // Supabase 클라이언트 설정
import { Buffer } from "buffer"; // npm install buffer

export const pickLocalImageUri = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: "images",
    quality: 1,
    base64: true,
  });
  if (!result.canceled) {
    const base64 = result.assets[0].base64;
    const uri = result.assets[0].uri;
    return {
      base64: `data:image/jpeg;base64,${base64}`,
      uri: uri,
    }; // 선택한 이미지 URI 반환
  }
  return null; // 사용자가 취소했을 경우 null 반환
};

export const uploadImageUriToSupabase = async (
  uuid: string,
  URIorURL: string,
  bucketName = "images"
) => {
  try {
    let uploadData;
    let contentType = "image/jpeg";

    if (!URIorURL.startsWith("https://") && !URIorURL.startsWith("http://")) {
      // Base64인 경우
      const base64Data = URIorURL.replace(/^data:image\/\w+;base64,/, "");
      uploadData = Buffer.from(base64Data, "base64");
      const matches = URIorURL.match(/^data:image\/(\w+);base64,/);
      if (matches && matches[1]) {
        contentType = `image/${matches[1]}`;
      }
    } else {
      // URL(네트워크)인 경우 fetch 후 blob → ArrayBuffer → Buffer 변환
      const response = await fetch(URIorURL);
      if (!response.ok) throw new Error("Failed fetching image");
      const arrayBuffer = await response.arrayBuffer();
      uploadData = Buffer.from(arrayBuffer);
      contentType = response.headers.get("content-type") || contentType;
    }

    // 확장자 추출(기본 jpg), Base64 mime type 우선
    let extension = "jpg";
    const extMatch = contentType.match(/image\/(\w+)/);
    if (extMatch && extMatch[1]) {
      extension = extMatch[1];
    } else {
      const urlWithoutQuery = URIorURL.split("?")[0];
      extension = urlWithoutQuery.split(".").pop() || extension;
    }

    // 파일명 생성
    const date = new Date();
    const timestamp = date.toISOString().replace(/[-:.TZ]/g, "");
    const filename = `image_${timestamp}.${extension}`;
    const filePath = `${uuid}/${filename}`;

    // 업로드
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, uploadData, {
        contentType,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const publicUrl = supabase.storage.from(bucketName).getPublicUrl(filePath)
      .data.publicUrl;
    console.log("Image Uploaded to:", filePath);

    return publicUrl;
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
};
export const uploadMultipleImagesToSupabase = async (
  uuid: string,
  uriOrUrls: string[],
  bucketName = "images"
) => {
  if (!uriOrUrls || uriOrUrls.length === 0) {
    throw new Error("No images to upload");
  }

  const results = [];
  for (const uri of uriOrUrls) {
    const data = await uploadImageUriToSupabase(uuid, uri, bucketName);
    results.push(data);
  }

  return results; // 업로드된 각 이미지의 메타 정보 배열 반환
};

export const uploadAvataUrl = async (uuid: string, uri: string) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    // 확장자 추출
    const extension = uri.split(".").pop();

    const filename = `avatar_img.${extension}`;

    // userId 폴더에 저장
    const filePath = `${uuid}/${filename}`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(filePath, blob, {
        contentType: blob.type,
        cacheControl: "3600",
        upsert: true, // 덮어쓰기 허용
      });

    if (error) {
      throw error;
    }
    return data; // 업로드 정보 반환
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const getAvatarUrl = (uuid: string, extension = "jpg") => {
  try {
    // 파일 경로 (upload 시 사용한 것과 동일하게)
    const filePath = `${uuid}/avatar.${extension}`;

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Get avatar URL error:", error);
  }
  throw new Error("Failed to return URL");
};
