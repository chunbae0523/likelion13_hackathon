import axios from "axios";
import apiClient from "./apiClient";
import Constants from "expo-constants";

const AI_API_TOKEN = Constants.expoConfig?.extra?.AI_API_TOKEN;

// resoultion, prompt 값 data에서 받아옴
export const createPromotionImage = async (data: any) => {
    console.log("ExtraEnv:", Constants.expoConfig?.extra);
    // const res = await apiClient.post("/api/v1/ai/promotions", data, {
    //     headers: {
    //         Authorization: `Bearer ${AI_API_TOKEN}`,
    //     },
    // });

    const res = await axios.create(
        {
            baseURL: "https://chohw-mefy842z-swedencentral.cognitiveservices.azure.com/openai/deployments/my-dall-e-3/images/generations?api-version=2024-02-01",
            headers: {
                Authorization: `Bearer ${AI_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            timeout: 20000,
        }
    ).post("", data);

    return res.data;
}