import * as FileSystem from 'expo-file-system';
import { supabase } from '../lib/supabase';

// base64 -> ArrayBuffer 변환 함수
function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function uploadImageFromUrl(imageUrl: string, bucketName: string) {
  try {
    // 1. 이미지 다운로드
    const uri = FileSystem.documentDirectory + 'temp.jpg';
    await FileSystem.downloadAsync(imageUrl, uri);

    // 2. 다운로드한 파일을 base64로 읽거나 필요 형식으로 변환
    const base64Data = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });

    // 3. base64 -> ArrayBuffer 등 변환(앞서 설명한 함수 사용 가능)
    const arrayBuffer = base64ToArrayBuffer(base64Data);

    // 4. 파일명 및 경로 생성
    const fileName = `uploads/${Date.now()}.jpg`;

    // 5. Supabase Storage에 업로드
    const { data, error } = await supabase.storage.from(bucketName).upload(fileName, arrayBuffer, {
      contentType: 'image/jpeg',
    });

    if (error) throw error;

    // 6. 공개 URL 얻기
    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('uploadImageFromUrl error:', err);
    return null;
  }
}